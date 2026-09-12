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
export function WorkCarriage({
  caseStudy,
  locale,
  onActivate,
  sweepTrigger = 0,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  onActivate?: () => void;
  /** Task 3.3 (creative-enhancement-pass) — increments each time the
   *  conveyor settles on *this* carriage; 0 means "never settled yet"
   *  (skipped, not a mount-time flash). See WorkConveyor's settle
   *  detection for how this is computed. */
  sweepTrigger?: number;
}) {
  const { t } = useLocalized();
  const tWork = useTranslations('work');
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const crossSectionRef = useRef<HTMLDivElement>(null);
  const sweepLineRef = useRef<HTMLSpanElement>(null);
  const sweepMountedRef = useRef(false);

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

  // Task 3.3 — the instant the conveyor comes to rest on this carriage, a
  // thin line sweeps once down the cover, with a simplified technical
  // line-diagram version of the same photo showing through directly
  // behind the sweep before the real photograph settles back. Runs once
  // per settle (guarded by `sweepTrigger` changing, not by any interval),
  // never on first mount, never under reduced motion.
  useEffect(() => {
    if (!sweepMountedRef.current) {
      sweepMountedRef.current = true;
      return;
    }
    if (!sweepTrigger || respectsReducedMotion()) return;
    const overlay = crossSectionRef.current;
    const line = sweepLineRef.current;
    if (!overlay || !line) return;
    const tl = gsap.timeline();
    tl.set(overlay, { opacity: 0 })
      .set(line, { top: '0%', opacity: 1 })
      .to(overlay, { opacity: 0.85, duration: 0.15, ease: 'power1.out' }, 0)
      .to(line, { top: '100%', duration: 0.55, ease: 'power2.inOut' }, 0)
      .to(overlay, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0.35)
      .to(line, { opacity: 0, duration: 0.15 }, 0.5);
    return () => {
      tl.kill();
    };
  }, [sweepTrigger]);

  return (
    <TransitionLink
      ref={cardRef}
      href={`/work/${caseStudy.slug}`}
      transition="case-reveal"
      data-case-id={caseStudy.id}
      className="carriage group relative flex h-[480px] w-[26rem] flex-none flex-col border border-border bg-surface"
      onMouseEnter={() => {
        setRevealed(true);
        onActivate?.();
      }}
      onMouseLeave={() => !respectsReducedMotion() && setRevealed(false)}
      onFocus={() => onActivate?.()}
    >
      <div
        className={`duotone duotone-fade relative flex-1 overflow-hidden${revealed ? ' is-revealed' : ''}`}
        style={{ viewTransitionName: `case-${caseStudy.slug}` } as CSSProperties}
      >
        {/* Fixed 26rem (416px) card width — only rendered inside
            WorkConveyor, which is desktop-only (≥1024px), so a fixed px
            value here is accurate rather than a vw-based guess. */}
        {/* priority: see BeforeAfter.tsx — native lazy-loading doesn't
            reliably fire for a `fill` image nested this many
            `absolute`/`relative` layers deep. */}
        <Image src={caseStudy.cover.src} alt={t(caseStudy.cover.alt)} fill priority sizes="416px" className="object-cover" />
        {/* Task 3.3 — the technical cross-section overlay + sweep line,
            hidden until a settle event fires the timeline above. */}
        <div ref={crossSectionRef} className="carriage__cross-section pointer-events-none absolute inset-0 opacity-0" aria-hidden="true">
          <Image
            src={caseStudy.cover.src}
            alt=""
            fill
            sizes="416px"
            className="carriage__cross-section-image object-cover"
          />
          <span ref={sweepLineRef} className="carriage__sweep-line" aria-hidden="true" />
        </div>
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
