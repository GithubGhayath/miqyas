import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getFaq, getTeam } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { PageShell } from '@/components/layout/PageShell';
import { DimensionRule } from '@/components/ui/DimensionRule';
import { Accordion } from '@/components/ui/Accordion';
import { TeamCard } from '@/components/about/TeamCard';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { BatchRevealGrid } from '@/components/motion/BatchRevealGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildMetadata({ locale, pathname: '/about', title: t('title'), description: t('title') });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, team, faq] = await Promise.all([getTranslations('about'), getTeam(), getFaq()]);

  const principle = {
    ar: 'نحن فريق هندسي صغير في دمشق. ما يجمعنا ليس حجم الخبرة بل تقاطع نادر: هندسة ميكانيكية تعرف ما تنظر إليه في الميدان، وبرمجة تحوّل ما رأته إلى ملف رقمي يقرؤه طرف ثالث في أي مكان. القيمة ليست في الوصول إلى المصنع — بل في ترجمة ما فيه إلى لغة قرار.',
    en: 'We are a small engineering team in Damascus. What unites us is not years of experience but a rare intersection: mechanical engineering that knows what it is looking at in the field, and software that turns what it saw into a digital file a third party can read anywhere. The value is not in reaching the factory — it is in translating what is inside it into the language of a decision.',
  };

  return (
    <>
      <PageShell>
        <header>
          <KineticHeading as="h1" className="u-display text-[length:var(--step-4)] text-ink">
            {t('title')}
          </KineticHeading>
          <p className="mt-[var(--spacing-s)] measure-block text-[length:var(--step-1)] text-ink-2">
            {pick(principle, l)}
          </p>
        </header>
      </PageShell>

      {/* Team grid — full-bleed band (every page needs a bleed moment,
          §4.2), with the grid itself kept to the site's normal content
          width inside it. Each portrait tilts toward the cursor and
          resolves to colour under a cursor-tracked spotlight; the whole
          grid rises in staggered as it scrolls into view. */}
      <section className="bleed team-trace border-y border-border py-[var(--spacing-xl)]">
        <div className="mx-auto max-w-[var(--spacing-page-max)] px-[var(--spacing-page-pad)]">
          <KineticHeading as="h2" className="u-display text-[length:var(--step-2)] text-ink">
            {t('teamHeading')}
          </KineticHeading>
          <BatchRevealGrid
            className="mt-[var(--spacing-m)] grid grid-cols-1 gap-x-[var(--spacing-l)] gap-y-[var(--spacing-2xl)] sm:grid-cols-2 lg:grid-cols-3"
            rise={32}
          >
            {team.map((member) => (
              <TeamCard key={member.id} member={member} locale={l} />
            ))}
          </BatchRevealGrid>
        </div>
      </section>

      <PageShell>
        <section>
          <KineticHeading as="h2" className="u-display text-[length:var(--step-2)] text-ink">
            {t('unknownHeading')}
          </KineticHeading>
          <p className="mt-[var(--spacing-2xs)] measure-block text-ink-2">{t('unknownBody')}</p>
        </section>

        <DimensionRule />

        <section>
          <KineticHeading as="h2" className="u-display text-[length:var(--step-2)] text-ink">
            {t('faqHeading')}
          </KineticHeading>
          <div className="mt-[var(--spacing-m)]">
            <Accordion
              items={faq.map((item) => ({
                id: item.id,
                question: pick(item.question, l),
                answer: pick(item.answer, l),
              }))}
            />
          </div>
        </section>
      </PageShell>
    </>
  );
}
