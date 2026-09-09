import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getCaseStudies } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { WorkIndexRow } from '@/components/work/WorkIndexRow';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'work' });
  return buildMetadata({ locale, pathname: '/work', title: t('title'), description: t('title') });
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, caseStudies] = await Promise.all([getTranslations('work'), getCaseStudies()]);

  return (
    <div>
      <div className="frame py-[var(--spacing-xl)]">
        <header>
          <KineticHeading as="h1" className="u-display text-[length:var(--step-4)] text-ink">
            {t('title')}
          </KineticHeading>
        </header>
      </div>

      {/* Full-bleed, full-viewport-height "slides" — UI-OVERHAUL-V4 §8 —
          not a grid of small cards. Gentle scroll-snap, not forced. */}
      <div className="bleed" style={{ scrollSnapType: 'y proximity' }}>
        {caseStudies.map((caseStudy) => (
          <WorkIndexRow key={caseStudy.id} caseStudy={caseStudy} locale={l} />
        ))}
      </div>
    </div>
  );
}
