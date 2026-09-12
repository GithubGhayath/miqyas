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
 */
export function WorkConveyor({ caseStudies, locale }: { caseStudies: CaseStudy[]; locale: Locale }) {
  const { dir } = useDirection();
  const tWork = useTranslations('work');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(caseStudies[0]?.id);
  const activeCaseStudy = caseStudies.find((c) => c.id === activeId) ?? caseStudies[0];

  function activate(id: string) {
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
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [dir, caseStudies.length]);

  if (!activeCaseStudy) return null;

  const pullQuote = activeCaseStudy.findings[locale][0];

  return (
    <>
      <section ref={sectionRef} className="conveyor relative hidden overflow-hidden lg:block" aria-label="Work">
        <div ref={trackRef} className="conveyor__track relative flex h-screen w-max items-center gap-[var(--spacing-xl)] px-[var(--spacing-2xl)]">
          <span className="conveyor__rail" aria-hidden="true" />
          {caseStudies.map((caseStudy) => (
            <WorkCarriage key={caseStudy.id} caseStudy={caseStudy} locale={locale} onActivate={() => activate(caseStudy.id)} />
          ))}
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
