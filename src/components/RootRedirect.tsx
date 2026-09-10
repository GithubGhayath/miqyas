'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/content/types';
import { routing } from '@/i18n/routing';

/**
 * Static export has no proxy/middleware (unsupported for `output: 'export'`
 * — see next.config.ts), so the root `/` can no longer inspect the
 * `Accept-Language` request header server-side to pick a locale. This is
 * the closest client-side equivalent: read the browser's own reported
 * language once on mount and replace straight to that locale's home page.
 * Uses next/navigation's router (not a raw `window.location` assignment) so
 * the target path is automatically prefixed with `basePath` when the site
 * is deployed under a GitHub Pages project path. The root page itself still
 * renders a static, no-JS fallback (a plain link to each locale plus a
 * `<meta http-equiv="refresh">`) for anyone who never gets this far.
 */
export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const preferred = navigator.language?.toLowerCase().startsWith('ar')
      ? ('ar' satisfies Locale)
      : routing.defaultLocale;
    router.replace(`/${preferred}`);
  }, [router]);

  return null;
}
