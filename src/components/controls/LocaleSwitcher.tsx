'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('locale');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const other = locale === 'ar' ? 'en' : 'ar';
  const search = searchParams.toString();
  const href = search ? `${pathname}?${search}` : pathname;

  return (
    <button
      type="button"
      className="locale-switcher inline-flex h-11 items-center rounded-control px-[var(--spacing-s)] text-[length:var(--step--1)] text-ink hover:bg-surface"
      aria-label={t('label')}
      onClick={() => router.replace(href, { locale: other })}
    >
      {t('switch')}
    </button>
  );
}
