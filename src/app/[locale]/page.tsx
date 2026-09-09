import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import {
  getCaseStudies,
  getConditionScale,
  getFieldNotes,
  getServices,
  getSite,
  getSurveyPins,
} from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { formatIsoDate } from '@/lib/utils';
import { PageShell } from '@/components/layout/PageShell';
import { ReportFact, ReportSpread } from '@/components/layout/ReportSpread';
import { DimensionRule } from '@/components/ui/DimensionRule';
import { Button } from '@/components/ui/Button';
import { Measure } from '@/components/ui/Measure';
import { Prose } from '@/components/ui/Prose';
import { SurveyHero } from '@/components/interactive/SurveyHero';
import { ConditionScale } from '@/components/interactive/ConditionScale';
import { BeforeAfter } from '@/components/interactive/BeforeAfter';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getSite();
  return buildMetadata({
    locale,
    pathname: '',
    title: pick(site.name, locale as Locale),
    description: pick(site.tagline, locale as Locale),
    titleIsBrand: true,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, pins, services, caseStudies, fieldNotes, conditionScale] = await Promise.all([
    getTranslations('home'),
    getSurveyPins(),
    getServices(),
    getCaseStudies(),
    getFieldNotes(),
    getConditionScale(),
  ]);

  const latestCase = caseStudies[0];
  const latestNotes = fieldNotes.slice(0, 2);

  const heroTitle = {
    ar: 'نُخرِج المنشأة الصناعية من العتمة إلى ملف يمكن اتخاذ قرار بناءً عليه',
    en: 'We turn a silent factory into a file you can make a decision on',
  };
  const heroSub = {
    ar: 'توثيق وتقييم فني مستقل لخطوط الإنتاج والمنشآت الصناعية في سوريا — لمن يملك الأصل ولا يستطيع الوقوف أمامه.',
    en: 'Independent technical assessment and documentation of industrial facilities in Syria — for owners and investors who cannot stand in front of the asset themselves.',
  };

  return (
    <>
      <section>
        <SurveyHero pins={pins} />
        <PageShell className="pt-[var(--spacing-l)]!">
          <div className="max-w-[60ch]">
            <KineticHeading as="h1" className="u-display text-[length:var(--step-5)] text-ink">
              {pick(heroTitle, l)}
            </KineticHeading>
            <p className="mt-[var(--spacing-m)] measure-block text-[length:var(--step-1)] text-ink-2">
              {pick(heroSub, l)}
            </p>
            <div className="mt-[var(--spacing-l)] flex flex-wrap items-center gap-[var(--spacing-m)]">
              <MagneticButton>
                <Button href="/contact">{t('heroPrimary')}</Button>
              </MagneticButton>
              <Button href="/method" variant="secondary">
                {t('heroSecondary')}
              </Button>
            </div>
          </div>
          <DimensionRule />
          <div className="flex flex-wrap justify-between gap-[var(--spacing-m)] font-mono text-[length:var(--step--1)] text-ink-2">
            <span>
              {t('factsVisit')}: <Measure value="2–3" unit={l === 'ar' ? 'أيام' : 'days'} />
            </span>
            <span>
              {t('factsDelivery')}: <Measure value="7–10" unit={l === 'ar' ? 'أيام' : 'days'} />
            </span>
            <span>
              {t('factsReceive')}: {t('factsReceiveValue')}
            </span>
          </div>
        </PageShell>
      </section>

      <PageShell>
        <section>
          <KineticHeading as="h2" className="u-display text-[length:var(--step-3)] text-ink">{t('problemHeading')}</KineticHeading>
          <div className="mt-[var(--spacing-m)]">
            <ReportSpread
              facts={
                <>
                  <ReportFact
                    label={l === 'ar' ? 'خارج البلاد' : 'Outside the country'}
                    value={<Measure value={l === 'ar' ? '٨' : '8'} unit={l === 'ar' ? 'ملايين سوري' : 'million Syrians'} />}
                  />
                  <ReportFact
                    label={l === 'ar' ? 'كلفة إعادة الإعمار المقدَّرة' : 'Estimated reconstruction cost'}
                    value={<Measure value="216" unit={l === 'ar' ? 'مليار دولار' : 'billion USD'} />}
                  />
                  <ReportFact
                    label={l === 'ar' ? 'تغطية ميدانية دولية مستقرة' : 'Stable international field coverage'}
                    value={<Measure value="0" />}
                  />
                </>
              }
            >
              <Prose
                paragraphs={
                  l === 'ar'
                    ? [
                        'من يملك المال لا يستطيع الوصول إلى الأصل، ومن يستطيع الوصول إليه لا يستطيع تحويل ما يراه إلى ملف يفهمه ممول أو بنك. هذه الفجوة هي كل ما نعمل عليه.',
                        'قريبك يستطيع أن يصوّر لك المصنع. لا يستطيع أن يخبرك كم بقي من عمر المحرك، ولا أن يوقّع على رأي مستقل تعرضه على شريك.',
                      ]
                    : [
                        'The person with the capital cannot reach the asset. The person who can reach it cannot turn what they see into something a lender will read. That gap is the whole of our work.',
                        'A relative can send you photographs of the plant. They cannot tell you how much service life the drive motor has left, and they cannot sign an independent opinion you can put in front of a partner.',
                      ]
                }
              />
            </ReportSpread>
          </div>
        </section>

        <section>
          <KineticHeading as="h2" className="u-display text-[length:var(--step-3)] text-ink">{t('scaleHeading')}</KineticHeading>
          <div className="mt-[var(--spacing-m)]">
            <ConditionScale grades={conditionScale} />
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <KineticHeading as="h2" className="u-display text-[length:var(--step-3)] text-ink">{t('servicesHeading')}</KineticHeading>
            <Link href="/services" className="text-[length:var(--step--1)] text-signal-text hover:underline">
              {t('servicesLink')}
            </Link>
          </div>
          <div className="mt-[var(--spacing-m)] divide-y divide-border border-y border-border">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.slug}`}
                className="flex flex-col gap-[var(--spacing-2xs)] py-[var(--spacing-m)] hover:bg-surface/60 md:flex-row md:items-baseline md:justify-between md:gap-[var(--spacing-m)]"
              >
                <span className="text-[length:var(--step-1)] font-medium text-ink">{pick(service.title, l)}</span>
                <span className="measure-block text-[length:var(--step-0)] text-ink-3">{pick(service.summary, l)}</span>
              </Link>
            ))}
          </div>
        </section>

        {latestCase ? (
          <section>
            <div className="flex items-baseline justify-between">
              <KineticHeading as="h2" className="u-display text-[length:var(--step-3)] text-ink">{t('workHeading')}</KineticHeading>
              <Link href="/work" className="text-[length:var(--step--1)] text-signal-text hover:underline">
                {t('workLink')}
              </Link>
            </div>
            <div className="mt-[var(--spacing-m)]">
              <ReportSpread
                facts={
                  <>
                    <ReportFact label={l === 'ar' ? 'القطاع' : 'Sector'} value={pick(latestCase.sector, l)} />
                    <ReportFact
                      label={l === 'ar' ? 'المحافظة' : 'Governorate'}
                      value={pick(latestCase.governorate, l)}
                    />
                    <ReportFact label={l === 'ar' ? 'السنة' : 'Year'} value={<Measure value={latestCase.year} />} />
                  </>
                }
              >
                <h3 className="text-[length:var(--step-1)] font-medium text-ink">{pick(latestCase.title, l)}</h3>
                <Prose paragraphs={pick(latestCase.brief, l)} className="mt-[var(--spacing-2xs)]" />
                {latestCase.beforeAfter ? (
                  <div className="mt-[var(--spacing-m)]">
                    <BeforeAfter before={latestCase.beforeAfter.before} after={latestCase.beforeAfter.after} />
                  </div>
                ) : null}
                <div className="mt-[var(--spacing-m)]">
                  <Button href={`/work/${latestCase.slug}`} variant="secondary">
                    {pick(latestCase.title, l)}
                  </Button>
                </div>
              </ReportSpread>
            </div>
          </section>
        ) : null}

        <section>
          <div className="flex items-baseline justify-between">
            <KineticHeading as="h2" className="u-display text-[length:var(--step-3)] text-ink">{t('notesHeading')}</KineticHeading>
            <Link href="/notes" className="text-[length:var(--step--1)] text-signal-text hover:underline">
              {t('notesLink')}
            </Link>
          </div>
          <div className="mt-[var(--spacing-m)] grid grid-cols-1 gap-[var(--spacing-m)] md:grid-cols-2">
            {latestNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="flex flex-col gap-[var(--spacing-2xs)] border border-border p-[var(--spacing-m)] hover:bg-surface/60"
              >
                <span className="font-mono text-[length:var(--step--1)] text-ink-3">
                  {formatIsoDate(note.publishedAt, l)}
                </span>
                <span className="text-[length:var(--step-1)] font-medium text-ink">{pick(note.title, l)}</span>
                <span className="text-ink-3">{pick(note.standfirst, l)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-[var(--spacing-s)] border-t border-border pt-[var(--spacing-xl)]">
          {/* Deliberate oversized moment — UI-OVERHAUL-V4 §4.3: a short
              phrase earns the display-scale step; a full sentence wouldn't. */}
          <KineticHeading as="h2" className="u-display text-[length:var(--step-6)] text-ink">
            {t('closingHeading')}
          </KineticHeading>
          <p className="measure-block text-ink-2">{t('closingBody')}</p>
          <Button href="/contact">{t('heroPrimary')}</Button>
        </section>
      </PageShell>
    </>
  );
}
