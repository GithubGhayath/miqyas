'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { MethodPhase } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { Measure } from '@/components/ui/Measure';
import { Prose } from '@/components/ui/Prose';
import { RailSelect } from '@/components/ui/RailSelect';

export function MethodStepper({ phases }: { phases: MethodPhase[] }) {
  const { t } = useLocalized();
  const tMethod = useTranslations('method');
  const [active, setActive] = useState(String(phases[0]?.order ?? 1));

  return (
    <RailSelect
      role="tablist"
      ariaLabel={tMethod('phasesHeading')}
      coachMarkCaption={tMethod('phasesCoachMark')}
      activeId={active}
      onChange={setActive}
      options={phases.map((phase) => ({
        id: String(phase.order),
        tickLabel: phase.order,
        ariaLabel: t(phase.name),
      }))}
      renderPanel={(activeId) => {
        const activePhase = phases.find((p) => String(p.order) === activeId) ?? phases[0];
        if (!activePhase) return null;
        return (
          <div className="report-spread">
            <div className="report-spread__facts">
              <div className="report-spread__fact">
                <span className="report-spread__fact-label">{tMethod('duration')}</span>
                <span className="report-spread__fact-value">
                  <Measure
                    value={`${activePhase.durationDays[0]}–${activePhase.durationDays[1]}`}
                    unit={tMethod('days')}
                  />
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
                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-[var(--spacing-s)] border-b border-border py-[var(--spacing-2xs)]"
                    >
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
        );
      }}
    />
  );
}
