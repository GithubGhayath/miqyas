'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { AssessmentTierRow } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';
import { RailSelect } from '@/components/ui/RailSelect';

type Tier = 'preliminary' | 'full';

export function TierCompare({ rows }: { rows: AssessmentTierRow[] }) {
  const { t } = useLocalized();
  const tMethod = useTranslations('method');
  const [tier, setTier] = useState<Tier>('preliminary');

  return (
    <div>
      {/* Mobile: RailSelect switch + two-column table with the value
          column swapped by the shared control's camera-move panel. */}
      <div className="lg:hidden">
        <RailSelect
          role="radiogroup"
          ariaLabel={tMethod('tiersHeading')}
          coachMarkCaption={tMethod('tiersCoachMark')}
          activeId={tier}
          onChange={(id) => setTier(id as Tier)}
          options={[
            { id: 'preliminary', tickLabel: tMethod('tierPreliminary'), ariaLabel: tMethod('tierPreliminary') },
            { id: 'full', tickLabel: tMethod('tierFull'), ariaLabel: tMethod('tierFull') },
          ]}
          renderPanel={(activeId) => {
            const activeTier = activeId as Tier;
            return (
              <div className="overflow-x-auto border border-border">
                <table className="w-full border-collapse text-start">
                  <caption className="sr-only">{tMethod('tiersHeading')}</caption>
                  <thead>
                    <tr className="border-b border-border text-[length:var(--step--1)] text-ink-3">
                      <th scope="col" className="p-[var(--spacing-s)] text-start" />
                      <th scope="col" className="p-[var(--spacing-s)] text-start">
                        {activeTier === 'preliminary' ? tMethod('tierPreliminary') : tMethod('tierFull')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-b-0">
                        <th scope="row" className="p-[var(--spacing-s)] text-start font-medium text-ink">
                          {t(row.aspect)}
                        </th>
                        <td className="p-[var(--spacing-s)] text-ink-2">
                          {activeTier === 'preliminary' ? t(row.preliminary) : t(row.full)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }}
        />
      </div>

      {/* Desktop: both columns visible simultaneously — no selector needed. */}
      <div className="hidden overflow-x-auto border border-border lg:block">
        <table className="w-full border-collapse text-start">
          <caption className="sr-only">{tMethod('tiersHeading')}</caption>
          <thead>
            <tr className="border-b border-border text-[length:var(--step--1)] text-ink-3">
              <th scope="col" className="p-[var(--spacing-s)] text-start" />
              <th scope="col" className="p-[var(--spacing-s)] text-start">
                {tMethod('tierPreliminary')}
              </th>
              <th scope="col" className="p-[var(--spacing-s)] text-start">
                {tMethod('tierFull')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0">
                <th scope="row" className="p-[var(--spacing-s)] text-start font-medium text-ink">
                  {t(row.aspect)}
                </th>
                <td className="p-[var(--spacing-s)] text-ink-2">{t(row.preliminary)}</td>
                <td className="p-[var(--spacing-s)] text-ink-2">{t(row.full)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
