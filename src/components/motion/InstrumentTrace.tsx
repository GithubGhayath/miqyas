'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { respectsReducedMotion } from '@/lib/ignition';
import { onInstrumentSpike } from '@/lib/instrumentTrace';

gsap.registerPlugin(ScrollTrigger);

const SAMPLE_COUNT = 140;
const WIDTH = 40;
const CENTER = WIDTH / 2;
const AMPLITUDE_MAX = 16;
const SPIKE_DECAY = 0.9;
const NOISE_SPEED = 0.015;

/**
 * The instrument trace — FIX-AND-POLISH-V3 §5.3. One continuous
 * oscilloscope-style line running the full height of the viewport in the
 * margin opposite `SheetMargin`, "recorded" by a ring buffer of samples
 * shifted one step per animation frame so the whole page reads as a
 * single unbroken reading rather than something that redraws or restarts
 * per scroll position.
 *
 * Base amplitude comes from scroll velocity, read off a real GSAP
 * `scrub`bed tween spanning the full document height (not a bare
 * ScrollTrigger.create with no animation — `scrub` only means something
 * attached to a tween's playhead). On top of that, three unrelated site
 * mechanics call `spikeInstrumentTrace()` at their own existing
 * "something just resolved" moment — a condition grade settling on a
 * reading (ConditionScale), a section reaching full focus
 * (CameraMoveSections), a work-conveyor selection change (WorkConveyor)
 * — and this component is the sole listener, adding a decaying boost.
 *
 * Desktop-only (≥1024px, the Work conveyor's own breakpoint) — a density
 * detail, not something to fight for space with on mobile (hidden via
 * CSS, see .instrument-trace in globals.css). Under reduced motion it
 * renders as a single flat static line: no ticker, no scroll listener,
 * no spikes.
 */
export function InstrumentTrace() {
  const polylineRef = useRef<SVGPolylineElement>(null);
  const velocityRef = useRef(0);
  const spikeRef = useRef(0);
  const phaseRef = useRef(0);

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
    }

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      tween.scrollTrigger?.kill();
      tween.kill();
      offSpike();
    };
  }, []);

  const flatPoints = Array.from({ length: SAMPLE_COUNT }, (_, i) => `${CENTER},${i}`).join(' ');

  return (
    <svg
      className="instrument-trace no-print"
      aria-hidden="true"
      viewBox={`0 0 ${WIDTH} ${SAMPLE_COUNT}`}
      preserveAspectRatio="none"
    >
      <polyline
        ref={polylineRef}
        points={flatPoints}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
