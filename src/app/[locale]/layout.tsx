import type { CSSProperties, ReactNode } from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/content/types';
import { getSite } from '@/lib/content';
import { pick } from '@/lib/pick';
import { siteUrl } from '@/lib/metadata';
import { SPLASH_COOKIE_NAME, SPLASH_SKIP_ATTR } from '@/lib/splash-cookie';
import { displayAr, displayEn, mono, textAr, textEn } from '../fonts';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { ViewTransitionsProvider } from '@/components/motion/ViewTransitionsProvider';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { CameraMoveSections } from '@/components/motion/CameraMoveSections';
import { InstrumentTrace } from '@/components/motion/InstrumentTrace';
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
        {/* Blocking, synchronous, runs before anything below it paints —
            the same category of fix next-themes uses for flash-of-wrong-
            theme (FIX-AND-POLISH-V1 §1). The splash itself always defaults
            to visible (see SplashScreen.tsx) so there is never a frame with
            neither the splash nor this skip in effect; this script's only
            job is to flip that default to hidden, before first paint,
            when the visitor has already seen it this session.
            `next/script` with `strategy="beforeInteractive"` — not a plain
            `<script>` tag — is Next's own sanctioned way to run genuinely
            executable code before hydration (unlike the inert JSON-LD
            below, which explicitly calls for a plain tag instead); it also
            avoids React's generic "script tag rendered by a component"
            dev-mode notice, which a plain tag here would otherwise trip. */}
        <Script
          id="splash-skip-check"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(document.cookie.indexOf('${SPLASH_COOKIE_NAME}=1')!==-1){document.documentElement.setAttribute('${SPLASH_SKIP_ATTR}','')}}catch(e){}`,
          }}
        />
        {/* Next's own recommended JSON-LD pattern for the App Router (a
            native <script type="application/ld+json">, not next/script —
            see node_modules/next/dist/docs/01-app/02-guides/json-ld.md):
            React's dev-mode console still logs a generic "script tag
            rendered by a component" notice for it. That warning is about
            scripts meant to *execute*; this one is inert JSON read by
            crawlers, so there's nothing to fix — it's expected noise from
            following the framework's own guidance, not a bug. The `<`
            escape below is the same doc's recommended XSS hardening. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
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
                  <InstrumentTrace />
                  <div style={{ viewTransitionName: 'site-header' } as CSSProperties}>
                    <Header site={site} />
                  </div>
                  <main id="main">{children}</main>
                  <Footer locale={l} />
                  <SplashScreen site={site} />
                  <CameraMoveSections />
                </SmoothScroll>
              </NextIntlClientProvider>
            </ViewTransitionsProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
