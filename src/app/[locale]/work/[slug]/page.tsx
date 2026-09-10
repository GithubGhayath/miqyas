import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getCaseStudies, getCaseStudy } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { PageShell } from '@/components/layout/PageShell';
import { ReportFact, ReportSpread } from '@/components/layout/ReportSpread';
import { TitleBlock } from '@/components/ui/TitleBlock';
import { Prose } from '@/components/ui/Prose';
import { DimensionRule } from '@/components/ui/DimensionRule';
import { DataTable } from '@/components/ui/DataTable';
import { GradeChip } from '@/components/ui/GradeChip';
import { Measure } from '@/components/ui/Measure';
import { MediaFigure } from '@/components/ui/MediaFigure';
import { BeforeAfter } from '@/components/interactive/BeforeAfter';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { BatchRevealRows } from '@/components/motion/BatchRevealRows';

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return routing.locales.flatMap((locale) => caseStudies.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) return {};
  return buildMetadata({
    locale,
    pathname: `/work/${slug}`,
    title: pick(caseStudy.title, locale as Locale),
    description: pick(caseStudy.sector, locale as Locale),
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, caseStudy] = await Promise.all([getTranslations('work'), getCaseStudy(slug)]);
  if (!caseStudy) notFound();

  return (
    <>
      <PageShell>
        <TitleBlock
          cells={[
            { label: t('sector'), value: pick(caseStudy.sector, l) },
            { label: t('governorate'), value: pick(caseStudy.governorate, l) },
            { label: t('year'), value: String(caseStudy.year) },
            { label: 'REF', value: caseStudy.slug.slice(0, 12).toUpperCase() },
          ]}
        />

        <header>
          <span className="font-mono text-[length:var(--step--1)] text-ink-3">
            {caseStudy.status === 'pilot' ? t('pilotLabel') : t('deliveredLabel')}
          </span>
          <KineticHeading as="h1" className="mt-[var(--spacing-2xs)] u-display text-[length:var(--step-4)] text-ink">
            {pick(caseStudy.title, l)}
          </KineticHeading>
        </header>
      </PageShell>

      {/* Full-bleed, not frame-constrained (UI-OVERHAUL-V4 §11) — the same
          image the work index bled edge-to-edge, so the shared-element
          transition lands on a hero band rather than shrinking straight
          into a contained figure. */}
      <div className="bleed">
        <MediaFigure
          image={caseStudy.cover}
          priority
          viewTransitionName={`case-${caseStudy.slug}`}
          containerClassName="letterbox"
          useIntrinsicAspectRatio={false}
        />
      </div>

      <PageShell>
        <section>
          <h2 className="u-display text-[length:var(--step-2)] text-ink">{t('briefHeading')}</h2>
          <Prose paragraphs={pick(caseStudy.brief, l)} className="mt-[var(--spacing-2xs)]" />
        </section>

        <DimensionRule />

        <section>
          <ReportSpread
            facts={
              <>
                <ReportFact label={t('sector')} value={pick(caseStudy.sector, l)} />
                <ReportFact label={t('governorate')} value={pick(caseStudy.governorate, l)} />
                <ReportFact label={t('year')} value={<Measure value={caseStudy.year} />} />
              </>
            }
          >
            <h2 className="text-[length:var(--step-2)] font-medium text-ink">{t('findingsHeading')}</h2>
            <Prose paragraphs={pick(caseStudy.findings, l)} className="mt-[var(--spacing-2xs)]" />
            <h2 className="mt-[var(--spacing-m)] text-[length:var(--step-2)] font-medium text-ink">
              {t('decisionHeading')}
            </h2>
            <Prose paragraphs={pick(caseStudy.decisionEnabled, l)} className="mt-[var(--spacing-2xs)]" />
          </ReportSpread>
        </section>

        {caseStudy.beforeAfter ? (
          <section>
            <BeforeAfter before={caseStudy.beforeAfter.before} after={caseStudy.beforeAfter.after} />
          </section>
        ) : null}

        <section>
          <h2 className="u-display text-[length:var(--step-2)] text-ink">{t('equipmentHeading')}</h2>
          <div className="mt-[var(--spacing-m)]">
            <DataTable caption={t('equipmentHeading')}>
              <thead>
                <tr className="border-b border-border text-[length:var(--step--1)] text-ink-3">
                  <th scope="col" className="p-[var(--spacing-s)] text-start">
                    {l === 'ar' ? 'المعدّة' : 'Equipment'}
                  </th>
                  <th scope="col" className="p-[var(--spacing-s)] text-start">
                    {l === 'ar' ? 'القدرة' : 'Rating'}
                  </th>
                  <th scope="col" className="p-[var(--spacing-s)] text-start">
                    {l === 'ar' ? 'سنة التركيب' : 'Year installed'}
                  </th>
                  <th scope="col" className="p-[var(--spacing-s)] text-start">
                    {l === 'ar' ? 'الحالة' : 'Condition'}
                  </th>
                  <th scope="col" className="p-[var(--spacing-s)] text-start">
                    {l === 'ar' ? 'ملاحظة' : 'Note'}
                  </th>
                </tr>
              </thead>
              <BatchRevealRows>
                {caseStudy.equipment.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <th scope="row" className="p-[var(--spacing-s)] text-start font-medium text-ink">
                      {pick(row.name, l)}
                    </th>
                    <td className="p-[var(--spacing-s)] font-mono text-ink-2">
                      {row.rating ? <Measure value={row.rating} /> : '—'}
                    </td>
                    <td className="p-[var(--spacing-s)] font-mono text-ink-2">
                      {row.yearInstalled ? <Measure value={row.yearInstalled} /> : '—'}
                    </td>
                    <td className="p-[var(--spacing-s)]">
                      <GradeChip grade={row.grade} />
                    </td>
                    <td className="p-[var(--spacing-s)] text-ink-2">{pick(row.note, l)}</td>
                  </tr>
                ))}
              </BatchRevealRows>
            </DataTable>
          </div>
        </section>

        {caseStudy.gallery.length > 0 ? (
          <section>
            <div className="grid grid-cols-1 gap-[var(--spacing-m)] md:grid-cols-2">
              {caseStudy.gallery.map((image, index) => (
                <MediaFigure key={index} image={image} sizes="(min-width: 768px) 50vw, 100vw" />
              ))}
            </div>
          </section>
        ) : null}
      </PageShell>
    </>
  );
}
