'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TeamMember } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(ScrollTrigger);

/**
 * Spotlight Roster — UI-OVERHAUL-V4 §7. Replaces the card-grid "Personnel
 * Dossier": a full-bleed portrait per member, dark duotone at rest, resolved
 * to full colour only where a cursor-tracked (or, on touch, a one-time
 * automatic sweep) light actually falls.
 */
export function SpotlightMember({ member }: { member: TeamMember }) {
  const { t } = useLocalized();
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  // GSAP's quickTo on a CSS custom property tweens raw numbers, not
  // percentage strings — animate a plain object instead and write the
  // `--x`/`--y` variables (with their `%` unit) onto the element ourselves.
  const pos = useRef({ x: 50, y: 50 });
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const [lit, setLit] = useState(false);
  // Read only inside event handlers below, never during render — a ref is
  // the correct tool here, not state (which would need an effect-driven
  // update purely for that render-body read).
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const reduced = respectsReducedMotion();
    reduceMotionRef.current = reduced;
    if (reduced) {
      // Reduced motion is client-only information; portraits render fully
      // lit at rest in that case, which can only be decided post-mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLit(true);
      return;
    }

    const el = maskRef.current;
    if (el) {
      quickX.current = gsap.quickTo(pos.current, 'x', {
        duration: 0.3,
        ease: 'power2',
        onUpdate: () => el.style.setProperty('--x', `${pos.current.x}%`),
      });
      quickY.current = gsap.quickTo(pos.current, 'y', {
        duration: 0.3,
        ease: 'power2',
        onUpdate: () => el.style.setProperty('--y', `${pos.current.y}%`),
      });
    }

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && containerRef.current && el) {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            pos.current,
            { x: 0 },
            {
              x: 100,
              duration: 1.8,
              ease: 'power1.inOut',
              onUpdate: () => el.style.setProperty('--x', `${pos.current.x}%`),
              onComplete: () => setLit(true),
            },
          );
        },
      });
      return () => trigger.kill();
    }
  }, []);

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotionRef.current || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    quickX.current?.(x);
    quickY.current?.(y);
  }

  return (
    <div
      ref={containerRef}
      className="bleed relative flex min-h-screen items-center overflow-hidden bg-void"
      onMouseMove={onMouseMove}
    >
      <div className="duotone absolute inset-0">
        <Image src={member.portrait.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div
        ref={maskRef}
        className="absolute inset-0"
        style={
          {
            '--x': '50%',
            '--y': '50%',
            maskImage: lit ? 'none' : 'radial-gradient(160px circle at var(--x) var(--y), black 0%, transparent 65%)',
            WebkitMaskImage: lit
              ? 'none'
              : 'radial-gradient(160px circle at var(--x) var(--y), black 0%, transparent 65%)',
          } as CSSProperties
        }
      >
        <Image src={member.portrait.src} alt={t(member.portrait.alt)} fill sizes="100vw" className="object-cover" />
      </div>

      <button
        type="button"
        aria-label={t(member.name)}
        className="absolute inset-0 h-full w-full cursor-default opacity-0 focus-visible:outline-2 focus-visible:outline-focus"
        onFocus={() => setLit(true)}
        onBlur={() => !reduceMotionRef.current && setLit(false)}
      />

      <div className="frame pointer-events-none relative z-10">
        <KineticHeading as="h3" className="u-display pointer-events-none text-[length:var(--step-6)] text-ink">
          {t(member.name)}
        </KineticHeading>
        <div className="pointer-events-auto mt-[var(--spacing-m)] max-w-[40ch]">
          <span className="font-mono text-[length:var(--step--1)] text-signal-text">{t(member.role)}</span>
          <p className="mt-[var(--spacing-2xs)] text-ink-2">{t(member.contribution)}</p>
        </div>
      </div>
    </div>
  );
}
