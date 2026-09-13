import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getCaseStudies } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { WorkFilmReel } from '@/components/work/WorkFilmReel';

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

      {/* "Drag Film Reel" (creative-layout-replacement §3) — one
          click-and-drag/touch-drag track for every viewport size, no
          separate mobile fallback. Native touch drag already works
          through gsap Draggable, so there's nothing to branch on. */}
      <WorkFilmReel caseStudies={caseStudies} locale={l} />
    </div>
  );
}
