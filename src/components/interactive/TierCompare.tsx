'use client';

import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import type { AssessmentTierRow } from '@/content/types';
import { useLocalized } from '@/hooks/useLocalized';

type Tier = 'preliminary' | 'full';

export function TierCompare({ rows }: { rows: AssessmentTierRow[] }) {
  const { t } = useLocalized();
  const tMethod = useTranslations('method');
  const [tier, setTier] = useState<Tier>('preliminary');
  const groupId = useId();

  return (
    <div>
      {/* Mobile: switch + two-column table with a cross-fading value column */}
      <div className="lg:hidden">
        <div
          role="radiogroup"
          aria-label={tMethod('tiersHeading')}
          className="mb-[var(--spacing-m)] flex border border-border"
        >
          {(['preliminary', 'full'] as const).map((option) => {
            const isSelected = tier === option;
            return (
              <button
                key={option}
                id={`${groupId}-${option}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTier(option)}
                className={`min-h-11 flex-1 py-[var(--spacing-xs)] text-center text-[length:var(--step-0)] ${
                  isSelected ? 'bg-surface text-ink' : 'text-ink-3'
                }`}
              >
                {option === 'preliminary' ? tMethod('tierPreliminary') : tMethod('tierFull')}
              </button>
            );
          })}
        </div>
        <div className="overflow-x-auto border border-border">
          <table className="w-full border-collapse text-start">
            <caption className="sr-only">{tMethod('tiersHeading')}</caption>
            <thead>
              <tr className="border-b border-border text-[length:var(--step--1)] text-ink-3">
                <th scope="col" className="p-[var(--spacing-s)] text-start" />
                <th scope="col" className="p-[var(--spacing-s)] text-start">
                  {tier === 'preliminary' ? tMethod('tierPreliminary') : tMethod('tierFull')}
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
                    <span key={tier} className="block">
                      {tier === 'preliminary' ? t(row.preliminary) : t(row.full)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desktop: both columns visible simultaneously */}
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
