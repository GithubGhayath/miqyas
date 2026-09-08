import type { Locale } from '@/content/types';

export function pick<T>(value: { ar: T; en: T }, locale: Locale): T {
  return value[locale];
}
