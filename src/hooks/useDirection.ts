import { useLocale } from 'next-intl';

/** Returns 'rtl' | 'ltr' and the sign (-1 | 1) to apply to translateX so
 *  motion travels in the correct reading direction. */
export function useDirection() {
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return { dir, sign: dir === 'rtl' ? -1 : 1 } as const;
}
