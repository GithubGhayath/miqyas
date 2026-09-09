'use client';

import { useTranslations } from 'next-intl';
import { useId, useState, type KeyboardEvent } from 'react';
import type { MethodPhase } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { useDirection } from '@/hooks/useDirection';
import { Measure } from '@/components/ui/Measure';
import { Prose } from '@/components/ui/Prose';

export function MethodStepper({ phases }: { phases: MethodPhase[] }) {
  const { t } = useLocalized();
  const tMethod = useTranslations('method');
  const { dir } = useDirection();
  const [active, setActive] = useState(1);
  const baseId = useId();

  const activePhase = phases.find((p) => p.order === active) ?? phases[0];

  function focusTab(order: number) {
    requestAnimationFrame(() => document.getElementById(`${baseId}-tab-${order}`)?.focus());
  }

  function move(delta: number) {
    const next = Math.min(5, Math.max(1, active + delta));
    setActive(next);
    focusTab(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = dir === 'rtl' ? -1 : 1;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(forward);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-forward);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(1);
      focusTab(1);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(5);
      focusTab(5);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={tMethod('phasesHeading')}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col border-s border-border md:flex-row md:border-s-0 md:border-b"
      >
        {phases.map((phase) => {
          const isActive = phase.order === active;
          return (
            <button
              key={phase.id}
              id={`${baseId}-tab-${phase.order}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${phase.order}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(phase.order)}
              className={`flex min-h-11 flex-1 items-center gap-[var(--spacing-2xs)] border-b border-border px-[var(--spacing-s)] py-[var(--spacing-s)] text-start last:border-b-0 md:border-b-0 md:border-e md:last:border-e-0 ${
                isActive ? 'bg-surface text-ink' : 'text-ink-3 hover:bg-surface/50'
              }`}
            >
              <span className="font-mono text-[length:var(--step--1)]">{phase.order}</span>
              <span className="text-[length:var(--step--1)] font-medium">{t(phase.name)}</span>
            </button>
          );
        })}
      </div>
      <div
        key={activePhase.id}
        id={`${baseId}-panel-${activePhase.order}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activePhase.order}`}
        tabIndex={0}
        className="report-spread mt-[var(--spacing-m)]"
      >
        <div className="report-spread__facts">
          <div className="report-spread__fact">
            <span className="report-spread__fact-label">{tMethod('duration')}</span>
            <span className="report-spread__fact-value">
              <Measure value={`${activePhase.durationDays[0]}–${activePhase.durationDays[1]}`} unit={tMethod('days')} />
            </span>
          </div>
        </div>
        <div className="report-spread__prose flex flex-col gap-[var(--spacing-m)]">
          <Prose paragraphs={t(activePhase.whatHappens)} />
          <div>
            <h4 className="text-[length:var(--step--1)] text-ink-3">{tMethod('clientRole')}</h4>
            <p className="text-ink-2">{t(activePhase.clientRole)}</p>
          </div>
          <div>
            <h4 className="text-[length:var(--step--1)] text-ink-3">{tMethod('deliverables')}</h4>
            <ul className="mt-[var(--spacing-2xs)] flex flex-col gap-[var(--spacing-2xs)]">
              {activePhase.deliverables.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-[var(--spacing-s)] border-b border-border py-[var(--spacing-2xs)]">
                  <span className="text-ink">{t(d.name)}</span>
                  <span className="font-mono text-[length:var(--step--1)] text-ink-3">
                    {tMethod(`importance.${d.importance}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
