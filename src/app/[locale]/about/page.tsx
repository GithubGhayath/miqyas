import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getFaq, getTeam } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { PageShell } from '@/components/layout/PageShell';
import { DimensionRule } from '@/components/ui/DimensionRule';
import { Accordion } from '@/components/ui/Accordion';
import { SpotlightMember } from '@/components/about/SpotlightMember';
import { KineticHeading } from '@/components/motion/KineticHeading';

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

      {/* Spotlight Roster — UI-OVERHAUL-V4 §7. A full-bleed section, not a
          card grid: every page needs at least one bleed moment (§4.2). */}
      <section aria-label={t('teamHeading')}>
        {team.map((member) => (
          <SpotlightMember key={member.id} member={member} />
        ))}
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
