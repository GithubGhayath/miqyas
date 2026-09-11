'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { IGNITION_DURATION } from '@/lib/ignition';

// The site's two shared easing curves, hand-mirrored here from the CSS
// custom properties of the same name in globals.css (`--ease-standard`,
// `--ease-ignition`) — a WAAPI keyframe's `easing` can't reference a CSS
// variable, only a literal value, so this is the same "keep two
// definitions in sync by hand" trade-off already made for the ignition
// tokens elsewhere (see globals.css's own comment at their definition).
const EASE_STANDARD = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_IGNITION = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const TOTAL_DURATION_MS = 480;

/**
 * Circular reveal expanding from the toggle itself — UI-REFACTOR-PROMPT
 * §3.2, superseded by FIX-AND-POLISH-V1 §6: rather than a bespoke linear
 * clip-path wipe, the reveal now closes with the same ignition
 * duration/ease used everywhere else something switches on (the CTA
 * hover, the splash completion flash, the team assembly hover — this is
 * the fifth reuse of that token), and gets a brief brightness flash at
 * that same moment — the closest equivalent to the splash/assembly
 * aperture's glow that a `::view-transition-new(root)` pseudo-element's
 * limited animatable properties (clip-path/transform/opacity/filter) can
 * produce; a real DOM overlay can't render on top of it; the View
 * Transition tree paints in the browser's top layer, above all normal
 * DOM content regardless of z-index. This is a same-document state
 * change, not a navigation, so it calls the browser's View Transitions
 * API directly rather than going through the route-level transition
 * system in src/i18n/routeTransitions.tsx.
 */
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

  const ignitionMs = IGNITION_DURATION * 1000;
  const settleOffset = 1 - ignitionMs / TOTAL_DURATION_MS;

  document.documentElement.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)`, offset: 0, easing: EASE_STANDARD },
      { clipPath: `circle(${endRadius * 0.92}px at ${x}px ${y}px)`, offset: settleOffset, easing: EASE_IGNITION },
      { clipPath: `circle(${endRadius}px at ${x}px ${y}px)`, offset: 1 },
    ],
    { duration: TOTAL_DURATION_MS, pseudoElement: '::view-transition-new(root)' },
  );

  // The glow: a brightness flash confined to the ignition-duration tail of
  // the reveal, the same "something switching on" beat as the splash's
  // completion flash and the team assembly's hover ignite.
  document.documentElement.animate(
    [
      { filter: 'brightness(1)', offset: 0 },
      { filter: 'brightness(1)', offset: settleOffset },
      { filter: 'brightness(1.35)', offset: settleOffset + (1 - settleOffset) * 0.5 },
      { filter: 'brightness(1)', offset: 1 },
    ],
    { duration: TOTAL_DURATION_MS, easing: EASE_IGNITION, pseudoElement: '::view-transition-new(root)' },
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
