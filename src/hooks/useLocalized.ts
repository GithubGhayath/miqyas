import { useLocale } from 'next-intl';
import type { Locale } from '@/content/types';
import { pick } from '@/lib/pick';

export function useLocalized() {
  const locale = useLocale() as Locale;
  return {
    locale,
    t: <T,>(value: { ar: T; en: T }) => pick(value, locale),
  };
}
