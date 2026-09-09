import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getServices } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { PageShell } from '@/components/layout/PageShell';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { ReportFact, ReportSpread } from '@/components/layout/ReportSpread';
import { Prose } from '@/components/ui/Prose';
import { DimensionRule } from '@/components/ui/DimensionRule';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return buildMetadata({ locale, pathname: '/services', title: t('title'), description: t('intro') });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, services] = await Promise.all([getTranslations('services'), getServices()]);

  return (
    <PageShell>
      <header>
        <KineticHeading as="h1" className="u-display text-[length:var(--step-4)] text-ink">{t('title')}</KineticHeading>
        <p className="mt-[var(--spacing-s)] measure-block text-ink-2">{t('intro')}</p>
      </header>

      {services.map((service, index) => (
        <section key={service.id} id={service.slug} className="scroll-mt-24">
          {index > 0 ? <DimensionRule /> : null}
          <div className={index > 0 ? 'mt-[var(--spacing-m)]' : ''}>
            <ReportSpread facts={<ReportFact label={t('duration')} value={pick(service.duration, l)} />}>
              <h2 className="text-[length:var(--step-2)] font-medium text-ink">{pick(service.title, l)}</h2>
              <p className="mt-[var(--spacing-2xs)] text-ink-2">{pick(service.summary, l)}</p>
              <div className="mt-[var(--spacing-m)]">
                <h3 className="text-[length:var(--step--1)] text-ink-3">{t('whatItIs')}</h3>
                <Prose paragraphs={pick(service.whatItIs, l)} className="mt-[var(--spacing-2xs)]" />
              </div>
              <div className="mt-[var(--spacing-m)]">
                <h3 className="text-[length:var(--step--1)] text-ink-3">{t('whoAsks')}</h3>
                <p className="text-ink-2">{pick(service.whoAsks, l)}</p>
              </div>
              <div className="mt-[var(--spacing-m)]">
                <h3 className="text-[length:var(--step--1)] text-ink-3">{t('youReceive')}</h3>
                <ul className="mt-[var(--spacing-2xs)] flex flex-col gap-[var(--spacing-2xs)]">
                  {service.youReceive.map((item, i) => (
                    <li key={i} className="border-s-2 border-border ps-[var(--spacing-xs)] text-ink-2">
                      {pick(item, l)}
                    </li>
                  ))}
                </ul>
              </div>
            </ReportSpread>
          </div>
        </section>
      ))}

      <section className="border-t border-border pt-[var(--spacing-xl)]">
        <h2 className="u-display text-[length:var(--step-2)] text-ink">{t('exclusionsHeading')}</h2>
        <p className="mt-[var(--spacing-2xs)] measure-block text-ink-2">{t('exclusionsBody')}</p>
      </section>
    </PageShell>
  );
}
