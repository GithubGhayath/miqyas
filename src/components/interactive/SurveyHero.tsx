'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import type { SurveyPin } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { useDirection } from '@/hooks/useDirection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { GradeChip } from '@/components/ui/GradeChip';
import { Measure } from '@/components/ui/Measure';
import { springSnappy } from '@/lib/motion';

gsap.registerPlugin(DrawSVGPlugin);

// A fixed coordinate space the connector SVG stretches to fill (see
// preserveAspectRatio="none" below) — lets pin xPct/yPct map directly to
// viewBox units without a separate unit-conversion step.
const VIEWBOX_W = 800;
const VIEWBOX_H = 500;
const CONNECTOR_LENGTH = 28;

const HERO_IMAGE_SRC = '/images/hero/production-hall.jpg';
const HERO_IMAGE_ALT = {
  ar: 'قاعة إنتاج صناعية مظلمة وصامتة، غير مفحوصة',
  en: 'A dark, silent industrial production hall, unexamined',
};

export function SurveyHero({ pins }: { pins: SurveyPin[] }) {
  const { t } = useLocalized();
  const tGrade = useTranslations('grade');
  const { dir, sign } = useDirection();
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 39.99rem)');
  const [openPinId, setOpenPinId] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tiltRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({});

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

  useEffect(() => {
    const targets = (isMobile ? pins.filter((p) => !p.hideOnMobile) : pins)
      .map((pin) => lineRefs.current[pin.id])
      .filter((el): el is SVGLineElement => el !== null);
    if (targets.length === 0) return;
    if (reduceMotion) {
      gsap.set(targets, { drawSVG: '100%' });
      return;
    }
    gsap.set(targets, { drawSVG: '0%' });
    if (!loaded) return;
    const tweens = targets.map((line, index) =>
      gsap.to(line, { drawSVG: '100%', duration: 0.3, delay: index * 0.09, ease: 'power2.out' }),
    );
    return () => tweens.forEach((tween) => tween.kill());
  }, [loaded, pins, isMobile, reduceMotion]);

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
            alt={t(HERO_IMAGE_ALT)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            data-critical="true"
          />
        </m.div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="none"
        >
          {visiblePins.map((pin) => {
            const physicalXPct = dir === 'rtl' ? 100 - pin.xPct : pin.xPct;
            const x1 = (physicalXPct / 100) * VIEWBOX_W;
            const y1 = (pin.yPct / 100) * VIEWBOX_H;
            const x2 = x1 + sign * CONNECTOR_LENGTH;
            return (
              <line
                key={pin.id}
                ref={(el) => {
                  lineRefs.current[pin.id] = el;
                }}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y1}
                vectorEffect="non-scaling-stroke"
                strokeWidth={1.5}
                className="stroke-signal"
              />
            );
          })}
        </svg>
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
