'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ConditionGrade } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { spikeInstrumentTrace } from '@/lib/instrumentTrace';
import { GradeChip } from '@/components/ui/GradeChip';
import { MediaFigure } from '@/components/ui/MediaFigure';
import { RailSelect } from '@/components/ui/RailSelect';

export function ConditionScale({ grades }: { grades: ConditionGrade[] }) {
  const { t } = useLocalized();
  const tGrade = useTranslations('grade');
  const [activeId, setActiveId] = useState(String(grades.find((g) => g.grade === 3)?.grade ?? grades[0]?.grade ?? 3));

  return (
    <RailSelect
      role="radiogroup"
      ariaLabel={tGrade('label')}
      coachMarkCaption={tGrade('coachMark')}
      activeId={activeId}
      onChange={(id) => {
        // A grade chip "resolving" on a new reading (FIX-AND-POLISH-V3
        // §5.3) — the instrument trace spikes at this moment.
        spikeInstrumentTrace(1);
        setActiveId(id);
      }}
      options={grades.map((g) => ({
        id: String(g.grade),
        tickLabel: g.grade,
        ariaLabel: `${tGrade('label')} ${g.grade}: ${t(g.name)}`,
      }))}
      renderPanel={(activeId) => {
        const active = grades.find((g) => String(g.grade) === activeId) ?? grades[0];
        if (!active) return null;
        return (
          <div className="grid grid-cols-1 gap-[var(--spacing-m)] md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
            {/* priority: this panel remounts on every RailSelect selection
                change (including autoplay) — see BeforeAfter.tsx for the
                broader native-lazy-loading issue this avoids. */}
            <MediaFigure image={active.image} priority sizes="(min-width: 768px) 320px, 100vw" />
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <div className="flex items-center gap-[var(--spacing-s)]">
                <GradeChip grade={active.grade} label={tGrade('label')} />
                <h3 className="u-display text-[length:var(--step-2)] text-ink">{t(active.name)}</h3>
              </div>
              <p className="measure-block text-ink-2">{t(active.meaning)}</p>
              <p className="font-medium text-ink">{t(active.action)}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
