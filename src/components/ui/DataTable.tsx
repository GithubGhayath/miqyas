import type { ReactNode } from 'react';

export function DataTable({
  caption,
  children,
  scrollHint,
}: {
  caption: string;
  children: ReactNode;
  scrollHint?: string;
}) {
  return (
    <div>
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] border-collapse text-start text-[length:var(--step-0)]">
          <caption className="sr-only">{caption}</caption>
          {children}
        </table>
      </div>
      {scrollHint ? (
        <p className="mt-[var(--spacing-2xs)] text-[length:var(--step--1)] text-ink-3 md:hidden">{scrollHint}</p>
      ) : null}
    </div>
  );
}
