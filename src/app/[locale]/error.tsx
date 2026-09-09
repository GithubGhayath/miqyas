'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/layout/PageShell';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <div className="flex flex-col items-start gap-[var(--spacing-m)] py-[var(--spacing-2xl)]">
        <h1 className="u-display text-[length:var(--step-3)] text-ink">{t('heading')}</h1>
        <p className="measure-block text-ink-2">{t('body')}</p>
        <Button type="button" onClick={reset}>
          {t('retry')}
        </Button>
      </div>
    </PageShell>
  );
}
