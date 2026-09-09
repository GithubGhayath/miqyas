import type { Grade } from '@/content/types';

const gradeColorVar: Record<Grade, string> = {
  1: 'var(--color-grade-1)',
  2: 'var(--color-grade-2)',
  3: 'var(--color-grade-3)',
  4: 'var(--color-grade-4)',
  5: 'var(--color-grade-5)',
};

// Fixed lookup, not a runtime contrast check — see UI-REFACTOR-PROMPT §2.3.
const gradeInkVar: Record<Grade, string> = {
  1: 'var(--color-grade-1-ink)',
  2: 'var(--color-grade-2-ink)',
  3: 'var(--color-grade-3-ink)',
  4: 'var(--color-grade-4-ink)',
  5: 'var(--color-grade-5-ink)',
};

export function GradeChip({ grade, label }: { grade: Grade; label?: string }) {
  return (
    <span
      className="grade-chip"
      style={
        {
          '--grade-color': gradeColorVar[grade],
          '--grade-ink': gradeInkVar[grade],
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
