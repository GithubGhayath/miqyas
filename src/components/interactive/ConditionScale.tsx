'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import type { ConditionGrade, Grade } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { GradeChip } from '@/components/ui/GradeChip';
import { MediaFigure } from '@/components/ui/MediaFigure';

gsap.registerPlugin(Flip);

export function ConditionScale({ grades }: { grades: ConditionGrade[] }) {
  const { t } = useLocalized();
  const tGrade = useTranslations('grade');
  const { dir } = useDirection();
  const [selected, setSelected] = useState<Grade>(3);
  const groupId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const mountedRef = useRef(false);
  // positionHighlight is called from a mount-only resize listener as well
  // as from the selection-change effect below; reading selection through a
  // ref (kept current every render) means the mount-only listener never
  // closes over a stale selected grade.
  const selectedRef = useRef(selected);
  useLayoutEffect(() => {
    selectedRef.current = selected;
  });

  const active = grades.find((g) => g.grade === selected) ?? grades[0];

  function positionHighlight() {
    const container = groupRef.current;
    const highlight = highlightRef.current;
    const btn = btnRefs.current[selectedRef.current];
    if (!container || !highlight || !btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    highlight.style.left = `${btnRect.left - containerRect.left}px`;
    highlight.style.width = `${btnRect.width}px`;
  }

  useLayoutEffect(() => {
    positionHighlight();
    window.addEventListener('resize', positionHighlight);
    return () => window.removeEventListener('resize', positionHighlight);
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const highlight = highlightRef.current;
    if (!highlight) return;
    if (respectsReducedMotion()) {
      positionHighlight();
      return;
    }
    const state = Flip.getState(highlight);
    positionHighlight();
    Flip.from(state, { duration: 0.3, ease: 'power2.out' });
  }, [selected]);

  function focusGrade(grade: Grade) {
    requestAnimationFrame(() => document.getElementById(`${groupId}-${grade}`)?.focus());
  }

  function move(delta: number) {
    const next = Math.min(5, Math.max(1, selected + delta)) as Grade;
    setSelected(next);
    focusGrade(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = dir === 'rtl' ? -1 : 1;
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        move(forward);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        move(-forward);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'Home':
        event.preventDefault();
        setSelected(1);
        focusGrade(1);
        break;
      case 'End':
        event.preventDefault();
        setSelected(5);
        focusGrade(5);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={tGrade('label')}
        onKeyDown={onKeyDown}
        className="relative flex border-y border-s border-border"
      >
        <div
          ref={highlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-0 bg-ember"
        />
        {grades.map((g) => {
          const isSelected = g.grade === selected;
          return (
            <button
              key={g.id}
              ref={(el) => {
                btnRefs.current[g.grade] = el;
              }}
              id={`${groupId}-${g.grade}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${tGrade('label')} ${g.grade}: ${t(g.name)}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(g.grade)}
              className={`relative z-10 min-h-11 flex-1 border-e border-border py-[var(--spacing-s)] text-center font-mono text-[length:var(--step-0)] transition-colors ${
                isSelected ? 'text-on-ember' : 'text-ink-3 hover:bg-surface/50'
              }`}
            >
              {g.grade}
            </button>
          );
        })}
      </div>
      <div
        key={active.id}
        role="region"
        aria-live="polite"
        className="mt-[var(--spacing-m)] grid grid-cols-1 gap-[var(--spacing-m)] md:grid-cols-[minmax(0,320px)_1fr] md:items-start"
      >
        <MediaFigure image={active.image} />
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <div className="flex items-center gap-[var(--spacing-s)]">
            <GradeChip grade={active.grade} label={tGrade('label')} />
            <h3 className="u-display text-[length:var(--step-2)] text-ink">{t(active.name)}</h3>
          </div>
          <p className="measure-block text-ink-2">{t(active.meaning)}</p>
          <p className="font-medium text-ink">{t(active.action)}</p>
        </div>
      </div>
    </div>
  );
}
