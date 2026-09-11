'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CaseStudy, Locale } from '@/content/types';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { WorkCarriage } from '@/components/work/WorkCarriage';

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
 */
export function WorkConveyor({ caseStudies, locale }: { caseStudies: CaseStudy[]; locale: Locale }) {
  const { dir } = useDirection();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="conveyor relative hidden overflow-hidden lg:block" aria-label="Work">
      <div ref={trackRef} className="conveyor__track relative flex h-screen w-max items-center gap-[var(--spacing-xl)] px-[var(--spacing-2xl)]">
        <span className="conveyor__rail" aria-hidden="true" />
        {caseStudies.map((caseStudy) => (
          <WorkCarriage key={caseStudy.id} caseStudy={caseStudy} locale={locale} />
        ))}
      </div>
    </section>
  );
}
