import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** The `.frame` working-content container (UI-OVERHAUL-V4 §4.2) — wide and
 *  inset, not the old centred 1240px column. Pair with a `.bleed` section
 *  somewhere on the page; a page of nothing but PageShell content regresses
 *  to the narrow-column problem this replaced. */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'frame py-[var(--spacing-xl)] md:py-[var(--spacing-2xl)] [&>*+*]:mt-[var(--spacing-xl)] md:[&>*+*]:mt-[var(--spacing-2xl)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
