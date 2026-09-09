import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/content/types';
import { getAssessmentTiers, getMethodPhases } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';
import { PageShell } from '@/components/layout/PageShell';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { MethodStepper } from '@/components/interactive/MethodStepper';
import { TierCompare } from '@/components/interactive/TierCompare';
import { DimensionRule } from '@/components/ui/DimensionRule';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'method' });
  return buildMetadata({ locale, pathname: '/method', title: t('title'), description: t('phasesHeading') });
}

export default async function MethodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, phases, tiers] = await Promise.all([
    getTranslations('method'),
    getMethodPhases(),
    getAssessmentTiers(),
  ]);

  return (
    <PageShell>
      <header>
        <KineticHeading as="h1" className="u-display text-[length:var(--step-4)] text-ink">{t('title')}</KineticHeading>
      </header>

      <section>
        <h2 className="u-display text-[length:var(--step-3)] text-ink">{t('phasesHeading')}</h2>
        <div className="mt-[var(--spacing-m)]">
          <MethodStepper phases={phases} />
        </div>
      </section>

      <DimensionRule />

      <section>
        <h2 className="u-display text-[length:var(--step-3)] text-ink">{t('tiersHeading')}</h2>
        <div className="mt-[var(--spacing-m)]">
          <TierCompare rows={tiers} />
        </div>
        <p className="mt-[var(--spacing-m)] measure-block text-ink-2">
          {l === 'ar'
            ? 'ما نسلّمه اليوم هو العمود الأيسر من هذا الجدول: تقييم أولي مبني على مسح بصري منهجي. هذا ليس تنازلًا عن الدقة، بل هو الخطوة الصحيحة أولًا — رأي مستقل يمكّنك من اتخاذ قرار المضي قبل تحمّل كلفة فحص كامل ومُجهّز.'
            : 'What we deliver today is the left column of this table: a preliminary assessment built on a systematic visual survey. That is not a compromise on rigour — it is the right first step, an independent opinion that lets you decide whether to proceed before taking on the cost of a full, instrumented inspection.'}
        </p>
      </section>

      <DimensionRule />

      <section>
        <h2 className="u-display text-[length:var(--step-2)] text-ink">{t('referencesHeading')}</h2>
        <p className="mt-[var(--spacing-2xs)] measure-block text-ink-2">{t('referencesBody')}</p>
      </section>
    </PageShell>
  );
}
