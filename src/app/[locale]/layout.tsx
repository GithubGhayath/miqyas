import type { CSSProperties, ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/content/types';
import { getSite } from '@/lib/content';
import { pick } from '@/lib/pick';
import { siteUrl } from '@/lib/metadata';
import { displayAr, displayEn, mono, textAr, textEn } from '../fonts';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { ViewTransitionsProvider } from '@/components/motion/ViewTransitionsProvider';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SheetMargin } from '@/components/layout/SheetMargin';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const l = locale as Locale;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const [messages, t, site] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: 'nav' }),
    getSite(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: pick(site.name, l),
    description: pick(site.tagline, l),
    url: `${siteUrl}/${locale}`,
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: pick(site.location, l) },
    areaServed: 'SY',
  };

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${displayAr.variable} ${displayEn.variable} ${textAr.variable} ${textEn.variable} ${mono.variable}`}
    >
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="grain-overlay" aria-hidden="true" />
        {/* Dark is the primary/default theme (UI-OVERHAUL-V4 §2) — a new
            visitor sees dark regardless of OS preference; the toggle still
            switches to (and remembers) light. */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <MotionProvider>
            <ViewTransitionsProvider>
              <NextIntlClientProvider locale={l} messages={messages}>
                <SmoothScroll>
                  <a href="#main" className="skip-link">
                    {t('skipToContent')}
                  </a>
                  <SheetMargin />
                  <div style={{ viewTransitionName: 'site-header' } as CSSProperties}>
                    <Header site={site} />
                  </div>
                  <main id="main">{children}</main>
                  <Footer locale={l} />
                  <SplashScreen site={site} />
                </SmoothScroll>
              </NextIntlClientProvider>
            </ViewTransitionsProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
