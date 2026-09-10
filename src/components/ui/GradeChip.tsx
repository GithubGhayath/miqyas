import type { Grade } from '@/content/types';

const gradeColorVar: Record<Grade, string> = {
  1: 'var(--color-grade-1)',
  2: 'var(--color-grade-2)',
  3: 'var(--color-grade-3)',
  4: 'var(--color-grade-4)',
  5: 'var(--color-grade-5)',
};

export function GradeChip({ grade, label }: { grade: Grade; label?: string }) {
  return (
    <span
      className="grade-chip"
      style={
        {
          '--grade-color': gradeColorVar[grade],
          // Uniform fixed numeral colour, no per-grade exceptions — the
          // rendered fills were chosen specifically to make this collapse
          // to a single rule (UI-OVERHAUL-V4 §3.3), replacing the earlier
          // per-grade contrast lookup this component used before that pass.
          '--grade-ink': 'var(--color-grade-chip-text)',
        } as React.CSSProperties
      }
      aria-label={label ? `${label}: ${grade}/5` : `${grade}/5`}
    >
      <span className="grade-chip__badge" aria-hidden="true">
        {grade}
      </span>
      <span className="grade-chip__bar" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((seg) => (
          <span
            key={seg}
            className={`grade-chip__seg${seg <= grade ? ' grade-chip__seg--filled' : ''}`}
          />
        ))}
      </span>
    </span>
  );
}
