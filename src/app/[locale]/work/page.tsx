import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getCaseStudies } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { WorkIndexRow } from '@/components/work/WorkIndexRow';
import { WorkConveyor } from '@/components/work/WorkConveyor';

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

      {/* Desktop (≥1024px): the conveyor — FIX-AND-POLISH-V1 §2.3, a
          horizontally-pinned rail of carriages, replacing the generic
          cinematic vertical stack with something unmistakably mechanical.
          Below 1024px the horizontal-pin mechanic fights native touch
          scroll, so it isn't rendered at all there — a deliberate,
          documented breakpoint behaviour, not a compromise. */}
      <WorkConveyor caseStudies={caseStudies} locale={l} />

      {/* Mobile (<1024px) fallback: the previous full-bleed, full-viewport
          vertical stack, unchanged. */}
      <div className="bleed lg:hidden" style={{ scrollSnapType: 'y proximity' }}>
        {caseStudies.map((caseStudy) => (
          <WorkIndexRow key={caseStudy.id} caseStudy={caseStudy} locale={l} />
        ))}
      </div>
    </div>
  );
}
