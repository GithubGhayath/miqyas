'use client';

import { useState } from 'react';
import type { EquipmentRow, Locale } from '@/content/types';
import { pick } from '@/lib/pick';
import { DataTable } from '@/components/ui/DataTable';
import { GradeChip } from '@/components/ui/GradeChip';
import { Measure } from '@/components/ui/Measure';
import { RailSelect } from '@/components/ui/RailSelect';
import { BatchRevealRows } from '@/components/motion/BatchRevealRows';
import { EquipmentExplodedView } from '@/components/work/EquipmentExplodedView';

function EquipmentTable({ equipment, locale, heading }: { equipment: EquipmentRow[]; locale: Locale; heading: string }) {
  const l = locale;
  return (
    <DataTable caption={heading}>
      <thead>
        <tr className="border-b border-border text-[length:var(--step--1)] text-ink-3">
          <th scope="col" className="p-[var(--spacing-s)] text-start">
            {l === 'ar' ? 'المعدّة' : 'Equipment'}
          </th>
          <th scope="col" className="p-[var(--spacing-s)] text-start">
            {l === 'ar' ? 'القدرة' : 'Rating'}
          </th>
          <th scope="col" className="p-[var(--spacing-s)] text-start">
            {l === 'ar' ? 'سنة التركيب' : 'Year installed'}
          </th>
          <th scope="col" className="p-[var(--spacing-s)] text-start">
            {l === 'ar' ? 'الحالة' : 'Condition'}
          </th>
          <th scope="col" className="p-[var(--spacing-s)] text-start">
            {l === 'ar' ? 'ملاحظة' : 'Note'}
          </th>
        </tr>
      </thead>
      <BatchRevealRows>
        {equipment.map((row) => (
          <tr key={row.id} className="border-b border-border last:border-b-0">
            <th scope="row" className="p-[var(--spacing-s)] text-start font-medium text-ink">
              {pick(row.name, l)}
            </th>
            <td className="p-[var(--spacing-s)] font-mono text-ink-2">
              {row.rating ? <Measure value={row.rating} /> : '—'}
            </td>
            <td className="p-[var(--spacing-s)] font-mono text-ink-2">
              {row.yearInstalled ? <Measure value={row.yearInstalled} /> : '—'}
            </td>
            <td className="p-[var(--spacing-s)]">
              <GradeChip grade={row.grade} />
            </td>
            <td className="p-[var(--spacing-s)] text-ink-2">{pick(row.note, l)}</td>
          </tr>
        ))}
      </BatchRevealRows>
    </DataTable>
  );
}

/**
 * FIX-AND-POLISH-V1 §2.3 — the equipment register gets an alternate
 * "diagram" view alongside "table" on desktop, switched with the same
 * shared RailSelect control used for the method stepper / condition scale
 * / tier compare (§4), rather than a bespoke tab UI for just this one
 * case. Mobile keeps the plain table — the exploded-view diagram is a
 * desktop layout device, not a responsive one.
 */
export function EquipmentSection({ equipment, locale, heading }: { equipment: EquipmentRow[]; locale: Locale; heading: string }) {
  const [view, setView] = useState<'table' | 'diagram'>('table');
  const viewLabels = locale === 'ar' ? { table: 'جدول', diagram: 'رسم تفكيكي' } : { table: 'Table', diagram: 'Diagram' };
  const coachMarkCaption = locale === 'ar' ? 'انقر للتبديل بين الجدول والرسم التفكيكي' : 'Click to switch between table and diagram';

  return (
    <>
      <div className="lg:hidden">
        <EquipmentTable equipment={equipment} locale={locale} heading={heading} />
      </div>
      <div className="hidden lg:block">
        <RailSelect
          role="tablist"
          ariaLabel={heading}
          coachMarkCaption={coachMarkCaption}
          activeId={view}
          onChange={(id) => setView(id as 'table' | 'diagram')}
          options={[
            { id: 'table', tickLabel: viewLabels.table, ariaLabel: viewLabels.table },
            { id: 'diagram', tickLabel: viewLabels.diagram, ariaLabel: viewLabels.diagram },
          ]}
          renderPanel={(activeId) =>
            activeId === 'diagram' ? (
              <EquipmentExplodedView equipment={equipment} locale={locale} />
            ) : (
              <EquipmentTable equipment={equipment} locale={locale} heading={heading} />
            )
          }
        />
      </div>
    </>
  );
}
