'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CaseStudy, Locale } from '@/content/types';
import { pick } from '@/lib/pick';
import { useLocalized } from '@/hooks/useLocalized';
import { respectsReducedMotion } from '@/lib/ignition';
import { TransitionLink } from '@/components/motion/TransitionLink';

gsap.registerPlugin(ScrollTrigger);

/**
 * One case study riding the Work conveyor's rail (FIX-AND-POLISH-V1 §2.3) —
 * a fixed-width carriage, not a full-bleed slide: a rectangular frame with
 * corner brackets and a dimension-rule tick beneath it, as if it were a
 * unit riding a physical rail. The duotone-to-colour reveal on the cover is
 * unchanged from the previous vertical layout — that mechanic already
 * works, it just needed a less generic container.
 */
export function WorkCarriage({ caseStudy, locale }: { caseStudy: CaseStudy; locale: Locale }) {
  const { t } = useLocalized();
  const tWork = useTranslations('work');
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (respectsReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && cardRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'left 85%',
        horizontal: true,
        once: true,
        onEnter: () => setRevealed(true),
      });
      return () => trigger.kill();
    }
  }, []);

  return (
    <TransitionLink
      ref={cardRef}
      href={`/work/${caseStudy.slug}`}
      transition="case-reveal"
      className="carriage group relative flex h-[480px] w-[26rem] flex-none flex-col border border-border bg-surface"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => !respectsReducedMotion() && setRevealed(false)}
    >
      <div
        className={`duotone duotone-fade relative flex-1 overflow-hidden${revealed ? ' is-revealed' : ''}`}
        style={{ viewTransitionName: `case-${caseStudy.slug}` } as CSSProperties}
      >
        {/* Fixed 26rem (416px) card width — only rendered inside
            WorkConveyor, which is desktop-only (≥1024px), so a fixed px
            value here is accurate rather than a vw-based guess. */}
        <Image src={caseStudy.cover.src} alt={t(caseStudy.cover.alt)} fill sizes="416px" className="object-cover" />
      </div>
      <span className="carriage__corner carriage__corner--tl" aria-hidden="true" />
      <span className="carriage__corner carriage__corner--br" aria-hidden="true" />
      <div className="flex flex-col gap-[var(--spacing-3xs)] p-[var(--spacing-m)]">
        <span className="font-mono text-[length:var(--step--1)] text-ink-3">
          {caseStudy.status === 'pilot' ? tWork('pilotLabel') : tWork('deliveredLabel')}
        </span>
        <h2 className="u-display text-[length:var(--step-2)] text-ink group-hover:text-signal-text">
          {pick(caseStudy.title, locale)}
        </h2>
        <span className="text-[length:var(--step--1)] text-ink-2">
          {pick(caseStudy.sector, locale)} — {pick(caseStudy.governorate, locale)}
        </span>
      </div>
      <span className="carriage__rail-tick" aria-hidden="true" />
    </TransitionLink>
  );
}
