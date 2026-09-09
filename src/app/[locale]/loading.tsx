import { PageShell } from '@/components/layout/PageShell';

// Deliberately does not call any next-intl server API: loading.tsx has no
// access to the `locale` route param, and resolving translations without a
// known locale falls back to reading request headers — a dynamic API that
// would drag every route's static generation into dynamic rendering.
export default function Loading() {
  return (
    <PageShell>
      <div className="flex flex-col gap-[var(--spacing-s)] py-[var(--spacing-2xl)]" role="status" aria-live="polite">
        <span className="sr-only" lang="ar">
          جارٍ التحميل
        </span>
        <span className="sr-only" lang="en">
          Loading
        </span>
        <div className="h-8 w-2/3 animate-pulse bg-surface" aria-hidden="true" />
        <div className="h-4 w-full animate-pulse bg-surface" aria-hidden="true" />
        <div className="h-4 w-5/6 animate-pulse bg-surface" aria-hidden="true" />
        <div className="mt-[var(--spacing-m)] h-40 w-full animate-pulse bg-surface" aria-hidden="true" />
      </div>
    </PageShell>
  );
}
