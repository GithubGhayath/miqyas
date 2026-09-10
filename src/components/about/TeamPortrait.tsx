'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import gsap from 'gsap';
import type { ImageRef } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { respectsReducedMotion } from '@/lib/ignition';

const TILT_MAX_DEG = 7;

/**
 * The interactive piece of a team card: a duotone portrait that tilts
 * gently toward the cursor and resolves to full colour where a
 * cursor-tracked spotlight falls — the Spotlight Roster's mask idiom
 * (UI-OVERHAUL-V4 §7), scoped to one card instead of a full-bleed section.
 * Text (name/role/contribution) lives outside this component so it never
 * rides the 3D tilt transform.
 */
export function TeamPortrait({ portrait, name }: { portrait: ImageRef; name: string }) {
  const { t } = useLocalized();
  const cardRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const maskPos = useRef({ x: 50, y: 50 });
  const tiltPos = useRef({ rx: 0, ry: 0 });
  const quick = useRef<{
    x: gsap.QuickToFunc;
    y: gsap.QuickToFunc;
    rx: gsap.QuickToFunc;
    ry: gsap.QuickToFunc;
  } | null>(null);
  const reduceMotionRef = useRef(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    // Whether the device even has a fine pointer is client-only information
    // that decides the portrait's resting state (touch gets no cursor to
    // spotlight with, so it renders fully lit); it can't be known at SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!window.matchMedia('(pointer: fine)').matches) setLit(true);
  }, []);

  function ensureQuickTo() {
    if (quick.current || reduceMotionRef.current) return;
    if (respectsReducedMotion()) {
      reduceMotionRef.current = true;
      return;
    }
    const mask = maskRef.current;
    const card = cardRef.current;
    if (!mask || !card) return;
    quick.current = {
      x: gsap.quickTo(maskPos.current, 'x', {
        duration: 0.3,
        ease: 'power2',
        onUpdate: () => mask.style.setProperty('--x', `${maskPos.current.x}%`),
      }),
      y: gsap.quickTo(maskPos.current, 'y', {
        duration: 0.3,
        ease: 'power2',
        onUpdate: () => mask.style.setProperty('--y', `${maskPos.current.y}%`),
      }),
      rx: gsap.quickTo(tiltPos.current, 'rx', {
        duration: 0.4,
        ease: 'power2',
        onUpdate: () => card.style.setProperty('--rx', `${tiltPos.current.rx}deg`),
      }),
      ry: gsap.quickTo(tiltPos.current, 'ry', {
        duration: 0.4,
        ease: 'power2',
        onUpdate: () => card.style.setProperty('--ry', `${tiltPos.current.ry}deg`),
      }),
    };
  }

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotionRef.current || !window.matchMedia('(pointer: fine)').matches) return;
    ensureQuickTo();
    if (!quick.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    quick.current.x(px * 100);
    quick.current.y(py * 100);
    quick.current.ry((px - 0.5) * TILT_MAX_DEG * 2);
    quick.current.rx((0.5 - py) * TILT_MAX_DEG * 2);
  }

  function onMouseLeave() {
    quick.current?.rx(0);
    quick.current?.ry(0);
  }

  return (
    <div
      ref={cardRef}
      className="team-portrait relative aspect-[3/4] w-full overflow-hidden border border-border bg-surface"
      style={
        {
          transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
          transformStyle: 'preserve-3d',
        } as CSSProperties
      }
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="duotone absolute inset-0">
        <Image src={portrait.src} alt="" fill sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw" className="object-cover" />
      </div>

      <div
        ref={maskRef}
        className="absolute inset-0"
        style={
          {
            '--x': '50%',
            '--y': '50%',
            maskImage: lit ? 'none' : 'radial-gradient(140px circle at var(--x) var(--y), black 0%, transparent 70%)',
            WebkitMaskImage: lit
              ? 'none'
              : 'radial-gradient(140px circle at var(--x) var(--y), black 0%, transparent 70%)',
          } as CSSProperties
        }
      >
        <Image
          src={portrait.src}
          alt={t(portrait.alt) || name}
          fill
          sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <button
        type="button"
        aria-label={name}
        className="absolute inset-0 h-full w-full cursor-default opacity-0 focus-visible:outline-2 focus-visible:outline-focus"
        onFocus={() => setLit(true)}
        onBlur={() => !reduceMotionRef.current && window.matchMedia('(pointer: fine)').matches && setLit(false)}
      />

      <span className="team-portrait__corner team-portrait__corner--tl" aria-hidden="true" />
      <span className="team-portrait__corner team-portrait__corner--br" aria-hidden="true" />
    </div>
  );
}
