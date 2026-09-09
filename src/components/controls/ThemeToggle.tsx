'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

// Circular reveal expanding from the toggle itself — UI-REFACTOR-PROMPT §3.2.
// This is a same-document state change, not a navigation, so it calls the
// browser's View Transitions API directly rather than going through the
// route-level transition system in src/i18n/routeTransitions.tsx.
async function revealTheme(nextTheme: 'light' | 'dark', setTheme: (t: string) => void, originEl: HTMLElement) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    setTheme(nextTheme);
    return;
  }

  const { top, left, width, height } = originEl.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const transition = document.startViewTransition(() => {
    flushSync(() => setTheme(nextTheme));
  });

  try {
    await transition.ready;
  } catch {
    return;
  }

  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
    { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('theme');
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-surface"
      aria-label={t('toggle')}
      onClick={() => {
        if (!buttonRef.current) return;
        revealTheme(resolvedTheme === 'dark' ? 'light' : 'dark', setTheme, buttonRef.current);
      }}
    >
      <Moon aria-hidden="true" size={20} className="hidden dark:block" />
      <Sun aria-hidden="true" size={20} className="block dark:hidden" />
    </button>
  );
}
