import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const siteUrl = 'https://miqyas.example';

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  titleIsBrand = false,
}: {
  locale: string;
  pathname: string;
  title: string;
  description: string;
  /** Set on the home page: `title` already IS the brand name, so it must not
   *  also get the root layout's "%s — MIQYAS" template applied on top of it. */
  titleIsBrand?: boolean;
}): Metadata {
  const canonical = `${siteUrl}/${locale}${pathname}`;
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${siteUrl}/${loc}${pathname}`;
  }

  return {
    title: titleIsBrand ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      siteName: 'MIQYAS',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
