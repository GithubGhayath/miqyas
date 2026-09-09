'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { SurveyPin } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { useDirection } from '@/hooks/useDirection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { GradeChip } from '@/components/ui/GradeChip';
import { Measure } from '@/components/ui/Measure';
import { springSnappy } from '@/lib/motion';

const HERO_IMAGE_SRC = 'https://picsum.photos/seed/miqyas-hero-line/1600/1000';

export function SurveyHero({ pins }: { pins: SurveyPin[] }) {
  const { t } = useLocalized();
  const tGrade = useTranslations('grade');
  const { dir } = useDirection();
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 39.99rem)');
  const [openPinId, setOpenPinId] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tiltRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onTiltMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || isMobile || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visiblePins = isMobile ? pins.filter((p) => !p.hideOnMobile) : pins;

  function closePin(returnFocusId?: string) {
    setOpenPinId((current) => {
      if (returnFocusId && current !== returnFocusId) return current;
      return null;
    });
    if (returnFocusId) {
      requestAnimationFrame(() => btnRefs.current[returnFocusId]?.focus());
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number, pin: SurveyPin) {
    const forward = dir === 'rtl' ? -1 : 1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? forward : -forward;
      const next = (index + delta + visiblePins.length) % visiblePins.length;
      setFocusIndex(next);
      btnRefs.current[visiblePins[next].id]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpenPinId((current) => (current === pin.id ? null : pin.id));
    } else if (event.key === 'Escape' && openPinId === pin.id) {
      closePin(pin.id);
    }
  }

  return (
    <figure className="relative w-full overflow-hidden border border-border">
      <div
        className="relative aspect-[8/5] w-full"
        style={{ perspective: 800 }}
        onMouseMove={onTiltMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <m.div
          ref={tiltRef}
          className="absolute inset-0"
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={springSnappy}
        >
          <Image
            src={HERO_IMAGE_SRC}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            data-critical="true"
          />
        </m.div>
        <ul className="absolute inset-0 list-none" role="list">
          {visiblePins.map((pin, index) => {
            const open = openPinId === pin.id;
            const panelId = `${baseId}-panel-${pin.id}`;
            const btnId = `${baseId}-btn-${pin.id}`;
            return (
              <li
                key={pin.id}
                className="absolute"
                style={{ insetInlineStart: `${pin.xPct}%`, top: `${pin.yPct}%` }}
              >
                <m.span
                  aria-hidden="true"
                  className="pointer-events-none absolute block h-px bg-signal"
                  style={{
                    width: 28,
                    insetInlineStart: 0,
                    top: 0,
                    transformOrigin: dir === 'rtl' ? 'right' : 'left',
                  }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: reduceMotion ? 1 : loaded ? 1 : 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                    delay: reduceMotion ? 0 : index * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <button
                  ref={(el) => {
                    btnRefs.current[pin.id] = el;
                  }}
                  id={btnId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-label={`${t(pin.equipment)} — ${tGrade('label')} ${pin.grade}`}
                  tabIndex={index === focusIndex ? 0 : -1}
                  onFocus={() => setFocusIndex(index)}
                  onClick={() => setOpenPinId((current) => (current === pin.id ? null : pin.id))}
                  onKeyDown={(event) => onKeyDown(event, index, pin)}
                  onMouseEnter={() => {
                    if (window.matchMedia('(pointer: fine)').matches) setOpenPinId(pin.id);
                  }}
                  onMouseLeave={() => {
                    if (window.matchMedia('(pointer: fine)').matches) closePin();
                  }}
                  style={{ marginInlineStart: 28 }}
                  className="relative flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-void bg-signal text-void focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <span className="h-2 w-2 rounded-full bg-void" aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {open ? (
                    <m.div
                      id={panelId}
                      role="group"
                      aria-labelledby={btnId}
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: reduceMotion ? 0 : 0.16 }}
                      className="absolute z-10 w-56 border border-border bg-void p-[var(--spacing-s)] text-start"
                      style={{ insetInlineStart: 48, top: 20 }}
                    >
                      <div className="flex items-center justify-between gap-[var(--spacing-2xs)]">
                        <span className="font-medium text-ink">{t(pin.equipment)}</span>
                        <GradeChip grade={pin.grade} label={tGrade('label')} />
                      </div>
                      <p className="mt-[var(--spacing-2xs)] font-mono text-[length:var(--step--1)] text-ink-3">
                        <Measure value={pin.measure.value} unit={pin.measure.unit} />
                      </p>
                      <p className="mt-[var(--spacing-2xs)] text-[length:var(--step--1)] text-ink-2">
                        {t(pin.observation)}
                      </p>
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
