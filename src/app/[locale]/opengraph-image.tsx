import { ImageResponse } from 'next/og';
import type { Locale } from '@/content/types';
import { getSite } from '@/lib/content';
import { pick } from '@/lib/pick';
import { routing } from '@/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Required for static export (output: 'export'): without an explicit
// per-locale param list, this route has no `dynamicParams` to fall back to
// and Next has nothing to prerender at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image() {
  const site = await getSite();
  // Always the English strings, regardless of locale, and a left-aligned
  // Latin layout to match: Satori (the renderer behind ImageResponse) has
  // no Arabic text-shaping support without an embedded font that covers
  // it, and fetching one at build time would make a static export — which
  // must build reproducibly offline — depend on a network call to Google
  // Fonts succeeding. The social-preview thumbnail staying in Latin script
  // for the `ar` build is the trade-off; the actual page underneath is
  // fully localized regardless.
  const name = pick(site.name, 'en' satisfies Locale);
  const tagline = pick(site.tagline, 'en' satisfies Locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#0F1513',
          color: '#E9EEEC',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: '0.04em' }}>{name}</div>
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            marginTop: 24,
            color: '#9AA8A3',
            maxWidth: 900,
            textAlign: 'left',
          }}
        >
          {tagline}
        </div>
        <div style={{ display: 'flex', marginTop: 48, width: 120, height: 2, background: '#55ABA1' }} />
      </div>
    ),
    { ...size },
  );
}
