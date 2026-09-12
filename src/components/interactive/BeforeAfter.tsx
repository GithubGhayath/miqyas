'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { ImageRef } from '@/content/types';
import { useDirection } from '@/hooks/useDirection';
import { useLocalized } from '@/hooks/useLocalized';

export function BeforeAfter({ before, after }: { before: ImageRef; after: ImageRef }) {
  const { t } = useLocalized();
  const tBeforeAfter = useTranslations('beforeAfter');
  const { dir, sign } = useDirection();
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const physicalPercent = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(100, Math.max(0, physicalPercent));
      const logical = dir === 'rtl' ? 100 - clamped : clamped;
      setPosition(logical);
    },
    [dir],
  );

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  }

  function onPointerUp() {
    draggingRef.current = false;
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPosition(100);
    }
  }

  const clipPath =
    dir === 'rtl' ? `inset(0 0 0 ${100 - position}%)` : `inset(0 ${100 - position}% 0 0)`;

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/2] w-full touch-none overflow-hidden border border-border select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="absolute inset-0 duotone">
        {/* `priority` (not the default lazy loading), on both images below:
            native `loading="lazy"` reliably failed to ever fire its
            intersection check for an <img> nested two levels inside
            `absolute` ancestors — one of them clipped via `clip-path` —
            confirmed by forcing `loading="eager"` at runtime, which loaded
            it instantly with no other change. Both images here sit inside
            exactly that structure, and there are only ever two of them per
            instance, so eager-loading is the correct, low-cost fix rather
            than chasing the browser's lazy-load heuristic further. */}
        <Image src={before.src} alt={t(before.alt)} fill priority sizes="(min-width: 768px) 640px, 100vw" className="object-cover" />
        <div className="grain-local" aria-hidden="true" style={{ opacity: 0.05 }} />
        <span className="absolute bottom-[var(--spacing-2xs)] start-[var(--spacing-2xs)] bg-ink/70 px-[var(--spacing-2xs)] font-mono text-[length:var(--step--1)] text-void">
          {tBeforeAfter('before')}
        </span>
      </div>
      <div className="absolute inset-0" style={{ clipPath }}>
        <Image src={after.src} alt={t(after.alt)} fill priority sizes="(min-width: 768px) 640px, 100vw" className="object-cover" />
        <span className="absolute bottom-[var(--spacing-2xs)] end-[var(--spacing-2xs)] bg-ink/70 px-[var(--spacing-2xs)] font-mono text-[length:var(--step--1)] text-void">
          {tBeforeAfter('after')}
        </span>
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label={tBeforeAfter('label')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 flex w-6 cursor-ew-resize items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
        style={{ insetInlineStart: `${position}%`, transform: `translateX(${-sign * 50}%)` }}
      >
        <span className="pointer-events-none absolute inset-y-0 w-px bg-void" />
        <span className="pointer-events-none flex h-9 w-9 items-center justify-center rounded-full border-2 border-void bg-signal text-void">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 2 2 7l3 5M9 2l3 5-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
