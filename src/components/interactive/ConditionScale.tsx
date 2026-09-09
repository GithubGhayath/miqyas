'use client';

import { useTranslations } from 'next-intl';
import { useId, useState, type KeyboardEvent } from 'react';
import type { ConditionGrade, Grade } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { useDirection } from '@/hooks/useDirection';
import { GradeChip } from '@/components/ui/GradeChip';
import { MediaFigure } from '@/components/ui/MediaFigure';

export function ConditionScale({ grades }: { grades: ConditionGrade[] }) {
  const { t } = useLocalized();
  const tGrade = useTranslations('grade');
  const { dir } = useDirection();
  const [selected, setSelected] = useState<Grade>(3);
  const groupId = useId();

  const active = grades.find((g) => g.grade === selected) ?? grades[0];

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
        role="radiogroup"
        aria-label={tGrade('label')}
        onKeyDown={onKeyDown}
        className="flex border-y border-s border-border"
      >
        {grades.map((g) => {
          const isSelected = g.grade === selected;
          return (
            <button
              key={g.id}
              id={`${groupId}-${g.grade}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${tGrade('label')} ${g.grade}: ${t(g.name)}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(g.grade)}
              className={`min-h-11 flex-1 border-e border-border py-[var(--spacing-s)] text-center font-mono text-[length:var(--step-0)] transition-colors ${
                isSelected ? 'bg-ember text-on-ember' : 'text-ink-3 hover:bg-surface/50'
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
