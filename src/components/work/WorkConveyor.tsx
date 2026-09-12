'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import type { CaseStudy, Locale } from '@/content/types';
import { pick } from '@/lib/pick';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { spikeInstrumentTrace } from '@/lib/instrumentTrace';
import { WorkCarriage } from '@/components/work/WorkCarriage';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { TitleBlock } from '@/components/ui/TitleBlock';

gsap.registerPlugin(ScrollTrigger);

/**
 * Work index, desktop (≥1024px) — FIX-AND-POLISH-V1 §2.3. The team
 * documents production lines; the index behaves like one: a pinned,
 * full-viewport section whose vertical scroll input drives horizontal
 * track movement, each case study riding a carriage on a literal rail
 * (a continuous dimension-rule line the full length of the track).
 * Below 1024px this component isn't rendered at all — the horizontal-pin
 * mechanic fights native touch scroll, so mobile gets the plain vertical
 * `.bleed` stack instead, a deliberate breakpoint behaviour, not a
 * compromise.
 *
 * FIX-AND-POLISH-V2 §3.4 / V3 §5.2 — a detail strip below the rail (real
 * content, not decoration) following whichever carriage the visitor last
 * focused or hovered: a facts column (sector, governorate, year, pulled
 * straight from `CaseStudy`) with the `whatThisProves` takeaway, and a
 * pull-quote lifted from the first `findings` paragraph set large in the
 * display face. This is Variant A's index-and-detail idea combined with
 * the existing full-height conveyor rather than shrinking it — the
 * conveyor's horizontal-scroll mechanic is worth strengthening, not
 * trading away for a compact selector strip (V3 §5.1). Selecting a
 * different carriage cross-fades the whole strip in on a fresh key.
 *
 * Creative-enhancement-pass §3.1/§3.2 — while the pin is scrubbing, two
 * more things track scroll progress directly (no separate ScrollTrigger,
 * both driven off the same tween's onUpdate): a small read-only "you are
 * here" rail reusing RailSelect's own line/mark/tick classes as a
 * position gauge (not the interactive component itself — autoplay/coach-
 * mark/click-to-jump don't make sense for a passive indicator), and a
 * small depth-of-field blur on every carriage that isn't centred,
 * increasing with distance from the viewport centre.
 */
const MAX_CARRIAGE_BLUR_PX = 3;
const SETTLE_DEBOUNCE_MS = 160;

export function WorkConveyor({ caseStudies, locale }: { caseStudies: CaseStudy[]; locale: Locale }) {
  const { dir } = useDirection();
  const tWork = useTranslations('work');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressTickRef = useRef<HTMLSpanElement>(null);
  const centeredIdRef = useRef<string | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleNonceRef = useRef(0);
  const [activeId, setActiveId] = useState(caseStudies[0]?.id);
  const [settled, setSettled] = useState<{ id: string; nonce: number } | null>(null);
  const activeCaseStudy = caseStudies.find((c) => c.id === activeId) ?? caseStudies[0];

  function activate(id: string) {
    // Task 3.4 — confirmed already wired (FIX-AND-POLISH-V3 §5.3): a
    // work-carriage selection change is already one of the instrument
    // trace's spike triggers, alongside a condition grade resolving and a
    // section reaching full scroll-focus. Kept as-is, not duplicated.
    if (id !== activeId) spikeInstrumentTrace(1);
    setActiveId(id);
  }

  useEffect(() => {
    if (respectsReducedMotion()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const distance = track.scrollWidth - section.clientWidth;
    if (distance <= 0) return;
    const target = dir === 'rtl' ? distance : -distance;
    const carriages = Array.from(track.querySelectorAll<HTMLElement>('.carriage'));

    function updateGauges(progress: number) {
      const tick = progressTickRef.current;
      if (tick) tick.style.insetInlineStart = `${progress * 100}%`;

      const viewportCenter = window.innerWidth / 2;
      let closestId: string | null = null;
      let closestDist = Infinity;
      for (const el of carriages) {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(center - viewportCenter);
        const normalized = Math.min(1, dist / viewportCenter);
        const blur = normalized * MAX_CARRIAGE_BLUR_PX;
        el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : '';
        if (dist < closestDist) {
          closestDist = dist;
          closestId = el.dataset.caseId ?? null;
        }
      }

      // Task 3.3 — "comes to rest" means the centred carriage hasn't
      // changed for SETTLE_DEBOUNCE_MS, not merely that it's centred this
      // one frame (which would fire continuously while scrubbing past
      // it). Every intermediate change during a still-moving scrub
      // restarts the timer instead of firing.
      if (closestId && closestId !== centeredIdRef.current) {
        centeredIdRef.current = closestId;
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        const settledCandidate = closestId;
        settleTimerRef.current = setTimeout(() => {
          settleNonceRef.current += 1;
          setSettled({ id: settledCandidate, nonce: settleNonceRef.current });
        }, SETTLE_DEBOUNCE_MS);
      }
    }

    const tween = gsap.to(track, {
      x: target,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateGauges(self.progress),
        onRefresh: (self) => updateGauges(self.progress),
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      for (const el of carriages) el.style.filter = '';
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [dir, caseStudies.length]);

  if (!activeCaseStudy) return null;

  const pullQuote = activeCaseStudy.findings[locale][0];

  return (
    <>
      {/* Task 3.3 — the shared edge-detection filter every carriage's
          cross-section overlay references by id. Defined once here rather
          than once per carriage. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <filter id="carriage-technical-edge" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" preserveAlpha="true" />
          </filter>
        </defs>
      </svg>

      <section ref={sectionRef} className="conveyor relative hidden overflow-hidden lg:block" aria-label="Work">
        <div ref={trackRef} className="conveyor__track relative flex h-screen w-max items-center gap-[var(--spacing-xl)] px-[var(--spacing-2xl)]">
          <span className="conveyor__rail" aria-hidden="true" />
          {caseStudies.map((caseStudy) => (
            <WorkCarriage
              key={caseStudy.id}
              caseStudy={caseStudy}
              locale={locale}
              onActivate={() => activate(caseStudy.id)}
              sweepTrigger={settled?.id === caseStudy.id ? settled.nonce : 0}
            />
          ))}
        </div>
        {/* Task 3.1 — a read-only "you are here" gauge reusing RailSelect's
            line/mark/tick classes, not the interactive component (a
            passive scroll-position indicator has no use for autoplay,
            coach-marks, or click-to-jump). Fixed within the pinned
            section, so it stays on screen the whole time the conveyor
            scrubs. */}
        <div className="work-progress-rail mx-auto flex w-64 items-center" aria-hidden="true">
          <span className="rail-select__line" aria-hidden="true" />
          {caseStudies.map((caseStudy) => (
            <span key={caseStudy.id} className="flex flex-1 flex-col items-center py-[var(--spacing-xs)]">
              <span className="rail-select__mark" aria-hidden="true" />
            </span>
          ))}
          <span ref={progressTickRef} className="rail-select__active-tick" aria-hidden="true" style={{ insetInlineStart: 0 }} />
        </div>
      </section>

      <div className="frame hidden py-[var(--spacing-xl)] lg:block">
        <div
          key={activeCaseStudy.id}
          className="work-detail grid grid-cols-1 gap-[var(--spacing-l)] md:grid-cols-[minmax(0,320px)_1fr] md:items-start"
        >
          <div className="flex flex-col gap-[var(--spacing-s)]">
            <span className="font-mono text-[length:var(--step--1)] text-ink-3">
              {pick(activeCaseStudy.title, locale)}
            </span>
            <TitleBlock
              cells={[
                { label: tWork('sector'), value: pick(activeCaseStudy.sector, locale) },
                { label: tWork('governorate'), value: pick(activeCaseStudy.governorate, locale) },
                { label: tWork('year'), value: String(activeCaseStudy.year) },
              ]}
            />
            <KineticHeading
              key={`${activeCaseStudy.id}-proves`}
              as="p"
              className="u-display measure-block text-[length:var(--step-2)] text-ink"
            >
              {pick(activeCaseStudy.whatThisProves, locale)}
            </KineticHeading>
          </div>
          <blockquote className="work-detail__quote u-display measure-block text-[length:var(--step-3)] text-ink">
            {pullQuote}
          </blockquote>
        </div>
      </div>
    </>
  );
}
