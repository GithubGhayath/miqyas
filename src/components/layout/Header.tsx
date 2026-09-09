'use client';

import { useTranslations } from 'next-intl';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { SiteConfig } from '@/content/types';
import { Wordmark } from '@/components/brand/Wordmark';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/controls/LocaleSwitcher';
import { ThemeToggle } from '@/components/controls/ThemeToggle';
import { MobileNav } from '@/components/controls/MobileNav';

const NAV_ROUTES = ['services', 'method', 'work', 'notes', 'about'] as const;

export function Header({ site }: { site: SiteConfig }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setCondensed(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const links = NAV_ROUTES.map((route) => ({ href: `/${route}`, label: t(route) }));

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <header
        className={`sticky top-0 z-40 border-b border-border bg-void/95 backdrop-blur-sm transition-[height] duration-[220ms] ease-[var(--ease-standard)] ${
          condensed ? 'h-14' : 'h-20'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[var(--spacing-page-max)] items-center justify-between px-[var(--spacing-page-pad)]">
          <Wordmark site={site} />
          <nav aria-label={t('primary')} className="hidden items-center gap-[var(--spacing-m)] md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`text-[length:var(--step-0)] hover:text-ink ${
                  pathname === link.href ? 'text-ink' : 'text-ink-2'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-[var(--spacing-2xs)]">
            <Suspense fallback={<span className="inline-block h-11 w-16" aria-hidden="true" />}>
              <LocaleSwitcher />
            </Suspense>
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden min-h-11 items-center rounded-control bg-ember px-[var(--spacing-m)] py-[var(--spacing-xs)] text-on-ember hover:bg-ember-text md:inline-flex"
            >
              {t('contact')}
            </Link>
            <MobileNav links={links} contactLabel={t('contact')} contactHref="/contact" />
          </div>
        </div>
      </header>
    </>
  );
}
