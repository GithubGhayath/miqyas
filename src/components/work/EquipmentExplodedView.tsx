import type { EquipmentRow, Locale } from '@/content/types';
import { pick } from '@/lib/pick';
import { GradeChip } from '@/components/ui/GradeChip';

/**
 * The "diagram" view of the equipment register (FIX-AND-POLISH-V1 §2.3) —
 * the classic mechanical-drafting exploded-view convention: each part
 * offset along the assembly axis from the last, connected by a thin
 * dimension line to its grade and note. This is how a mechanical engineer
 * would already draw an equipment list, not a decorative flourish added on
 * top of one.
 */
export function EquipmentExplodedView({ equipment, locale }: { equipment: EquipmentRow[]; locale: Locale }) {
  return (
    <ol className="flex flex-col gap-[var(--spacing-m)]">
      {equipment.map((row, index) => (
        <li
          key={row.id}
          className="exploded-row flex flex-wrap items-center gap-[var(--spacing-2xs)]"
          style={{ marginInlineStart: `${Math.min(index, 6) * 1.5}rem` }}
        >
          <span className="border border-border bg-surface px-[var(--spacing-s)] py-[var(--spacing-2xs)] font-mono text-[length:var(--step--1)] text-ink">
            {pick(row.name, locale)}
          </span>
          <span className="exploded-row__line" aria-hidden="true" />
          <GradeChip grade={row.grade} />
          <span className="exploded-row__line" aria-hidden="true" />
          <span className="text-[length:var(--step--1)] text-ink-2">{pick(row.note, locale)}</span>
        </li>
      ))}
    </ol>
  );
}
