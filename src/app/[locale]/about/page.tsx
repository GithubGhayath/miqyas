import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getFaq, getTeam } from '@/lib/content';
import { pick } from '@/lib/pick';
import { buildMetadata } from '@/lib/metadata';
import { PageShell } from '@/components/layout/PageShell';
import { DimensionRule } from '@/components/ui/DimensionRule';
import { Accordion } from '@/components/ui/Accordion';
import { TeamAssembly } from '@/components/about/TeamAssembly';
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

  // FIX-AND-POLISH-V1 §3.3 — this replaces (not paraphrases) the earlier
  // opening, which incorrectly framed the team as mechanical-plus-software
  // in a way that overstated how many people actually code.
  const principle = {
    ar: 'فريقنا مهندسون متخصصون في تصميم خطوط الإنتاج الميكانيكية، إلى جانب خبرة كهربائية داخل الفريق. الخيط الجديد الوحيد فيه هو قدرة برمجية تحوّل ما نراه في الميدان إلى ملف رقمي يقرؤه من لم يزر الموقع.',
    en: 'Our team is mechanical design engineers specialised in production lines, with electrical engineering expertise alongside them. The one new thread running through it is a programming capability that turns what we see on site into a digital file for someone who was never there.',
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

      {/* "The Assembly" (FIX-AND-POLISH-V1 §3.2) — deliberately a `.frame`
          composition, not `.bleed`: a parts-diagram benefits from defined
          structure, not edge-to-edge bleed. This section trades away the
          page's one bleed moment (§4.2) for that reason; About no longer
          has one, which is an accepted, explicit trade-off of this
          redesign rather than an oversight. */}
      <section className="border-y border-border py-[var(--spacing-xl)]">
        <div className="frame">
          <KineticHeading as="h2" className="u-display text-[length:var(--step-2)] text-ink">
            {t('teamHeading')}
          </KineticHeading>
        </div>
        <div className="mt-[var(--spacing-m)]">
          <TeamAssembly team={team} locale={l} />
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
