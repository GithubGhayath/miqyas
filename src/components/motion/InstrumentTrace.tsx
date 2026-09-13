'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from '@/i18n/navigation';
import { respectsReducedMotion } from '@/lib/ignition';
import { onInstrumentSpike } from '@/lib/instrumentTrace';

gsap.registerPlugin(ScrollTrigger);

const SAMPLE_COUNT = 140;
const WIDTH = 40;
const CENTER = WIDTH / 2;
const AMPLITUDE_MAX = 16;
const SPIKE_DECAY = 0.9;
const NOISE_SPEED = 0.015;
const BASE_STROKE = 1;
const MAX_STROKE = 2.6;

interface TickMark {
  id: string;
  fraction: number; // 0-1, this section's vertical centre / total document height
  label: string;
}

/**
 * The instrument trace — creative-layout-replacement §4, building on
 * FIX-AND-POLISH-V3 §5.3 rather than replacing its scroll-scrub/spike
 * logic (explicitly out of scope per the brief).
 *
 * §4.1.A ("fixed to the literal right edge regardless of language") was
 * checked against the real rule before touching anything: it already used
 * `inset-inline-end` (a logical property, confirmed live in an earlier
 * session — it renders on the physical left in `rtl`), not `right`. No
 * fix was needed there; left as-is rather than "fixing" something that
 * wasn't broken.
 *
 * §4.1.B is genuinely new: the trace now doubles as a page ruler layered
 * on top of the existing live "recording" —
 *  - Section tick marks: every top-level <section> on the current page
 *    gets a fixed mark positioned at its own scroll fraction, with a
 *    short mono index label (an actual page name, not a fixed six-item
 *    list — this is a multi-page site, not the single scrolling page the
 *    brief's "Home/Services/Method/Work/Notes/About" phrasing assumes;
 *    marking this page's own sections is the honest equivalent).
 *  - A travelling dot at the current scroll fraction, precise position
 *    rather than just amplitude.
 *  - Stroke width now varies with the same spike value that already
 *    drives amplitude, settling back to a thin baseline.
 */
export function InstrumentTrace() {
  const pathname = usePathname();
  const polylineRef = useRef<SVGPolylineElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const spikeRef = useRef(0);
  const phaseRef = useRef(0);
  const [ticks, setTicks] = useState<TickMark[]>([]);

  // Tick discovery — recomputed per route (client-side navigation keeps
  // this component mounted; the page underneath it changes). Waits for
  // `load` for the same reason CameraMoveSections does: mutating/reading
  // layout before every Suspense boundary has settled races the page's
  // own hydration reveal.
  useEffect(() => {
    // Static, informational marks — not decorative motion — so these
    // compute regardless of reduced-motion preference.
    let cancelled = false;

    function measure() {
      if (cancelled) return;
      const main = document.getElementById('main');
      if (!main) return;
      const sections = Array.from(main.querySelectorAll<HTMLElement>('section'));
      const totalHeight = document.documentElement.scrollHeight;
      if (sections.length === 0 || totalHeight === 0) {
        setTicks([]);
        return;
      }
      setTicks(
        sections.map((section, index) => {
          const rect = section.getBoundingClientRect();
          const centre = rect.top + window.scrollY + rect.height / 2;
          return { id: `${index}`, fraction: Math.min(1, Math.max(0, centre / totalHeight)), label: `S${String(index + 1).padStart(2, '0')}` };
        }),
      );
    }

    if (document.readyState === 'complete') {
      requestAnimationFrame(measure);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(measure), { once: true });
    }
    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
    };
  }, [pathname]);

  // Reduced motion: the dot still tracks real scroll position (it reflects
  // where you are, not decorative motion — kept per the brief), but with a
  // plain scroll listener, no GSAP ticker, no wave animation, no spikes.
  useEffect(() => {
    if (!respectsReducedMotion()) return;
    const dot = dotRef.current;
    if (!dot) return;
    function updateDot() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      dot!.style.top = `${Math.min(1, Math.max(0, progress)) * 100}%`;
    }
    updateDot();
    window.addEventListener('scroll', updateDot, { passive: true });
    window.addEventListener('resize', updateDot);
    return () => {
      window.removeEventListener('scroll', updateDot);
      window.removeEventListener('resize', updateDot);
    };
  }, [pathname]);

  useEffect(() => {
    if (respectsReducedMotion()) return;
    const el = polylineRef.current;
    if (!el) return;

    const samples = new Array(SAMPLE_COUNT).fill(CENTER);
    const scrollProxy = { v: 0 };

    const tween = gsap.to(scrollProxy, {
      v: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          velocityRef.current = self.getVelocity() / 1000;
          progressRef.current = self.progress;
        },
      },
    });

    const offSpike = onInstrumentSpike((intensity) => {
      spikeRef.current = Math.min(3, spikeRef.current + intensity);
    });

    function tick() {
      phaseRef.current += NOISE_SPEED;
      spikeRef.current *= SPIKE_DECAY;
      const velocityContribution = Math.min(1, Math.abs(velocityRef.current)) * 0.6;
      const idleNoise = Math.sin(phaseRef.current) * 0.08 + Math.sin(phaseRef.current * 2.7) * 0.04;
      const amplitude = (idleNoise + velocityContribution + spikeRef.current * 0.5) * AMPLITUDE_MAX;
      samples.shift();
      samples.push(CENTER + Math.max(-AMPLITUDE_MAX, Math.min(AMPLITUDE_MAX, amplitude)));
      el!.setAttribute('points', samples.map((x, i) => `${x.toFixed(2)},${i}`).join(' '));
      el!.setAttribute('stroke-width', Math.min(MAX_STROKE, BASE_STROKE + spikeRef.current * 0.8).toFixed(2));

      const dot = dotRef.current;
      if (dot) dot.style.top = `${progressRef.current * 100}%`;
    }

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      tween.scrollTrigger?.kill();
      tween.kill();
      offSpike();
    };
  }, [pathname]);

  const flatPoints = Array.from({ length: SAMPLE_COUNT }, (_, i) => `${CENTER},${i}`).join(' ');

  return (
    <div className="instrument-trace no-print" aria-hidden="true">
      <svg className="instrument-trace__wave" viewBox={`0 0 ${WIDTH} ${SAMPLE_COUNT}`} preserveAspectRatio="none">
        <polyline
          ref={polylineRef}
          points={flatPoints}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth={BASE_STROKE}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {ticks.map((mark) => (
        <span key={mark.id} className="instrument-trace__tick" style={{ top: `${mark.fraction * 100}%` }}>
          <span className="instrument-trace__tick-line" />
          <span className="instrument-trace__tick-label">{mark.label}</span>
        </span>
      ))}
      <span ref={dotRef} className="instrument-trace__dot" />
    </div>
  );
}
