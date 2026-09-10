import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/metadata';

// Required for static export (output: 'export'): metadata file routes have
// no request to read, but Next still needs the mode stated explicitly.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
