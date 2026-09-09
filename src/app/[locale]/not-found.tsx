import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/layout/PageShell';
import { DimensionRule } from '@/components/ui/DimensionRule';

const copy = {
  ar: { heading: 'الصفحة غير موجودة', body: 'الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.', cta: 'العودة إلى الرئيسية' },
  en: { heading: 'Page not found', body: 'The page you are looking for does not exist or has moved.', cta: 'Back to home' },
};

// Deliberately does not call any next-intl server API: like loading.tsx, this
// file has no access to the `locale` route param during the build's static
// fallback pass, and resolving translations without a known locale would
// read request headers, forcing every route into dynamic rendering. Shown in
// both languages, since the one moment locale can't be trusted is exactly
// when a URL didn't resolve.
export default function NotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-start gap-[var(--spacing-l)] py-[var(--spacing-2xl)]">
        <span className="font-mono text-[length:var(--step--1)] text-ink-3">404</span>
        {(['ar', 'en'] as const).map((locale, index) => (
          <div key={locale} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="flex flex-col gap-[var(--spacing-s)]">
            {index > 0 ? <DimensionRule /> : null}
            <h1 className="u-display text-[length:var(--step-3)] text-ink">{copy[locale].heading}</h1>
            <p className="measure-block text-ink-2">{copy[locale].body}</p>
            <Button href="/">{copy[locale].cta}</Button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
