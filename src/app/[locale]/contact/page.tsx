import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getSite } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { PageShell } from '@/components/layout/PageShell';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { ReportFact, ReportSpread } from '@/components/layout/ReportSpread';
import { ContactForm } from '@/components/forms/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildMetadata({ locale, pathname: '/contact', title: t('title'), description: t('title') });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, site] = await Promise.all([getTranslations('contact'), getSite()]);

  return (
    <PageShell>
      <header>
        <KineticHeading as="h1" className="u-display text-[length:var(--step-4)] text-ink">{t('title')}</KineticHeading>
      </header>

      <ReportSpread
        facts={
          <>
            <ReportFact
              label={t('factsResponseTime')}
              value={t('factsHours', { hours: site.responseTimeHours })}
            />
            <ReportFact label={t('factsWorkingHours')} value={pick(site.workingHours, l)} />
            <ReportFact label={t('factsLanguages')} value={pick(site.languages, l)} />
            <p className="max-w-[22ch] font-sans text-[length:var(--step--1)] text-ink-3">
              {t('factsPaymentNote')}
            </p>
          </>
        }
      >
        <ContactForm site={site} />
      </ReportSpread>
    </PageShell>
  );
}
