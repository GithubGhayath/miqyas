import { ImageResponse } from 'next/og';
import type { Locale } from '@/content/types';
import { getSite } from '@/lib/content';
import { pick } from '@/lib/pick';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const site = await getSite();
  const name = pick(site.name, locale as Locale);
  const tagline = pick(site.tagline, locale as Locale);
  const isAr = locale === 'ar';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isAr ? 'flex-end' : 'flex-start',
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
            textAlign: isAr ? 'right' : 'left',
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
