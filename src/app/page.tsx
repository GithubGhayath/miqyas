import { RootRedirect } from '@/components/RootRedirect';
import { routing } from '@/i18n/routing';

// This file exists only because static export (output: 'export' in
// next.config.ts) can't run the proxy/middleware that otherwise picks a
// locale for a bare `/` request — see src/i18n/routing.ts and the removed
// src/proxy.ts. It's a sibling of `[locale]`, not a child of it, so — per
// app/layout.tsx's own comment — nothing upstream renders an <html> shell
// for it; it has to supply its own. Relative paths throughout (`ar/`, not
// `/ar/`) so this still resolves correctly if the site is deployed under a
// GitHub Pages project subpath rather than a domain root.
export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${routing.defaultLocale}/`} />
      </head>
      <body style={{ margin: 0, background: '#0a0c0f', color: '#f2f4f7', fontFamily: 'system-ui, sans-serif' }}>
        <RootRedirect />
        <noscript>
          <p style={{ padding: '2rem' }}>
            <a href="en/" style={{ color: '#7ccbff' }}>
              English
            </a>
            {' / '}
            <a href="ar/" style={{ color: '#7ccbff' }}>
              العربية
            </a>
          </p>
        </noscript>
      </body>
    </html>
  );
}
