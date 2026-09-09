import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getCaseStudies, getFieldNotes } from '@/lib/content';
import { siteUrl } from '@/lib/metadata';

const staticRoutes = ['', '/services', '/method', '/work', '/notes', '/about', '/contact'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, fieldNotes] = await Promise.all([getCaseStudies(), getFieldNotes()]);

  const dynamicRoutes = [
    ...caseStudies.map((c) => `/work/${c.slug}`),
    ...fieldNotes.map((n) => `/notes/${n.slug}`),
  ];

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  return allRoutes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}${route}`])),
      },
    })),
  );
}
