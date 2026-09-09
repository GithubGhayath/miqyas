export const fieldInputClass =
  'w-full rounded-control border border-border bg-void px-[var(--spacing-s)] py-[var(--spacing-xs)] text-[length:var(--step-0)] text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-focus aria-[invalid=true]:border-grade-5';

export function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-3xs)]">
      <label htmlFor={id} className="text-[length:var(--step--1)] text-ink-2">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[length:var(--step--1)] text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[length:var(--step--1)] text-grade-5">
          {error}
        </p>
      ) : null}
    </div>
  );
}
