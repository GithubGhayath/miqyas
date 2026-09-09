import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getSite } from '@/lib/content';
import { pick } from '@/lib/pick';
import { Wordmark } from '@/components/brand/Wordmark';
import { DimensionRule } from '@/components/ui/DimensionRule';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const site = await getSite();
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-border">
      <div className="mx-auto max-w-[var(--spacing-page-max)] px-[var(--spacing-page-pad)] py-[var(--spacing-l)]">
        <DimensionRule />
        <div className="mt-[var(--spacing-l)] grid grid-cols-1 gap-[var(--spacing-l)] md:grid-cols-3">
          <div>
            <Wordmark site={site} />
            <p className="mt-[var(--spacing-2xs)] max-w-[32ch] text-[length:var(--step--1)] text-ink-3">
              {pick(site.tagline, locale)}
            </p>
          </div>
          <div className="flex flex-col gap-[var(--spacing-3xs)] text-[length:var(--step--1)] text-ink-2">
            <span className="text-ink-3">{t('location')}</span>
            <span>{pick(site.location, locale)}</span>
          </div>
          <div className="flex flex-col gap-[var(--spacing-3xs)] text-[length:var(--step--1)] text-ink-2">
            <span className="text-ink-3">{t('email')}</span>
            <a href={`mailto:${site.email}`} className="hover:text-ink" dir="ltr">
              {site.email}
            </a>
          </div>
        </div>
        <p className="mt-[var(--spacing-l)] text-[length:var(--step--1)] text-ink-3">
          © {year} {pick(site.name, locale)} — {t('rights')}
        </p>
      </div>
    </footer>
  );
}
