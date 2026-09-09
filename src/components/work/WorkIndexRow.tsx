'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CaseStudy, Locale } from '@/content/types';
import { pick } from '@/lib/pick';
import { useLocalized } from '@/hooks/useLocalized';
import { respectsReducedMotion } from '@/lib/ignition';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

/**
 * Work index row — UI-OVERHAUL-V4 §8. Full-viewport-height "slide," not a
 * small grid card; the cover resolves from dark documentary duotone to full
 * colour on hover (desktop) or a one-time automatic sweep (touch) — the
 * exact mechanism used on team portraits, reused so the site reads as one
 * system rather than one idea per page.
 */
export function WorkIndexRow({ caseStudy, locale }: { caseStudy: CaseStudy; locale: Locale }) {
  const { t } = useLocalized();
  const tWork = useTranslations('work');
  const [revealed, setRevealed] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (respectsReducedMotion()) {
      // Reduced motion is client-only information (a media query); the
      // resting "revealed" appearance genuinely depends on it, so this
      // render decision can only be made after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && rowRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: rowRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => setRevealed(true),
      });
      return () => trigger.kill();
    }
  }, []);

  return (
    <div
      ref={rowRef}
      className="bleed relative flex min-h-screen snap-start items-end overflow-hidden bg-void"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => !respectsReducedMotion() && setRevealed(false)}
    >
      {/* A full-bleed background image, not MediaFigure's normal in-flow
          <figure>: that wrapper has no explicit height, which collapses an
          absolutely-positioned image inside it to near-zero size. */}
      <div
        className={`duotone duotone-fade ken-burns absolute inset-0${revealed ? ' is-revealed' : ''}`}
        style={{ viewTransitionName: `case-${caseStudy.slug}` } as CSSProperties}
      >
        <Image
          src={caseStudy.cover.src}
          alt={t(caseStudy.cover.alt)}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <TransitionLink
        href={`/work/${caseStudy.slug}`}
        transition="case-reveal"
        className="frame group pointer-events-none relative z-10 w-full pb-[var(--spacing-2xl)]"
      >
        <span className="font-mono text-[length:var(--step--1)] text-ink-2">
          {caseStudy.status === 'pilot' ? tWork('pilotLabel') : tWork('deliveredLabel')}
        </span>
        <KineticHeading
          as="h2"
          className="u-display pointer-events-auto text-[length:var(--step-6)] text-ink group-hover:text-signal-text"
        >
          {pick(caseStudy.title, locale)}
        </KineticHeading>
        <span className="text-ink-2">
          {pick(caseStudy.sector, locale)} — {pick(caseStudy.governorate, locale)}
        </span>
      </TransitionLink>
    </div>
  );
}
