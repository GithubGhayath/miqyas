import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://miqyas.example'),
  title: { default: 'MIQYAS', template: '%s — MIQYAS' },
};

// The <html> shell lives in app/[locale]/layout.tsx: it needs the `locale`
// route param to set lang/dir, and reading that only via a route param (not
// a request-time API like getLocale()) keeps every page statically generable.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
