'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale, SiteConfig } from '@/content/types';
import { pick } from '@/lib/pick';
import { IGNITION_DURATION, respectsReducedMotion } from '@/lib/ignition';
import { trackCriticalAssets } from '@/lib/loading-progress';
import { SPLASH_COOKIE_MAX_AGE_S, SPLASH_COOKIE_NAME, SPLASH_SKIP_ATTR } from '@/lib/splash-cookie';
import { Measure } from '@/components/ui/Measure';

const MIN_DISPLAY_MS = 900;
const MAX_TIMEOUT_MS = 4500;
const ANNOUNCE_STEP = 20;
const HIDE_TRANSITION_MS = 650; // must match the CSS transition duration below

function roundToStep(value: number): number {
  return Math.floor(value / ANNOUNCE_STEP) * ANNOUNCE_STEP;
}

/**
 * "First Light" splash — UI-OVERHAUL-V4 §6. The real page (hero, fonts,
 * first images) mounts and renders normally underneath this overlay the
 * entire time (§6.5) — this is a curtain over content that already exists,
 * not a theatrical delay in front of an empty page.
 *
 * `shouldRender` defaults to `true` — on both the server-rendered HTML and
 * the client's first render, before any effect runs — so the splash is
 * literally the first thing painted. The previous version defaulted this
 * to an unknown/`null` state that rendered nothing until an effect flipped
 * it, which let the real page flash unmasked for one frame first
 * (FIX-AND-POLISH-V1 §1 — the exact "flash before hydration" failure mode
 * Next's own guide describes). The "already saw it this session" skip is
 * handled by a synchronous inline script in the root layout that stamps
 * `data-splash-skip` on `<html>` *before* this component ever renders —
 * this effect only needs to check that same attribute to decide whether to
 * run the real sequence below, never to decide initial visibility.
 */
export function SplashScreen({ site }: { site: SiteConfig }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [hiding, setHiding] = useState(false);
  const [igniting, setIgniting] = useState(false);
  const [percent, setPercent] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const t = useTranslations('splash');
  const locale = useLocale() as Locale;
  const displayRef = useRef({ value: 0 });

  useEffect(() => {
    if (document.documentElement.hasAttribute(SPLASH_SKIP_ATTR)) {
      // The inline script already hid this instantly via CSS — nothing
      // flashed. Just drop it from the DOM; no inert, no progress tracking.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(false);
      return;
    }

    const main = document.getElementById('main');
    main?.setAttribute('inert', '');

    const reduceMotion = respectsReducedMotion();
    setReduceMotion(reduceMotion);
    const startTime = performance.now();
    let cancelled = false;

    function setDisplayPercent(target: number) {
      const targetPct = Math.round(target * 100);
      if (reduceMotion) {
        setPercent(targetPct);
        return;
      }
      gsap.to(displayRef.current, {
        value: targetPct,
        duration: 0.6,
        ease: 'power3.out',
        onUpdate: () => setPercent(Math.round(displayRef.current.value)),
      });
    }

    let resolved = 0;
    let total = 1;

    function bump() {
      resolved += 1;
      setDisplayPercent(Math.min(1, resolved / total));
    }

    async function run() {
      const criticalImages = document.querySelectorAll('img[data-critical="true"]');
      total = criticalImages.length + 1;

      const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_TIMEOUT_MS));
      await Promise.race([trackCriticalAssets(bump), timeout]);
      if (cancelled) return;

      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(complete, remaining);
    }

    function complete() {
      if (cancelled) return;
      setDisplayPercent(1);
      try {
        document.cookie = `${SPLASH_COOKIE_NAME}=1; path=/; max-age=${SPLASH_COOKIE_MAX_AGE_S}; samesite=lax`;
      } catch {
        /* cookies disabled — replay next load, harmless */
      }
      main?.removeAttribute('inert');
      setIgniting(true);
      const flashDelay = reduceMotion ? 0 : IGNITION_DURATION * 1000 + 300;
      setTimeout(() => {
        if (cancelled) return;
        setHiding(true);
        setTimeout(() => setShouldRender(false), reduceMotion ? 0 : HIDE_TRANSITION_MS);
      }, flashDelay);
    }

    run();

    return () => {
      cancelled = true;
      main?.removeAttribute('inert');
    };
  }, []);

  if (!shouldRender) return null;

  const announcedPercent = roundToStep(percent);
  const aperturePct = reduceMotion ? 100 : Math.min(100, percent);
  const sketchColor = igniting ? 'var(--color-ember)' : 'var(--color-signal)';

  return (
    <div
      className="splash-screen fixed inset-0 z-[999] flex flex-col items-center justify-center bg-void"
      style={{
        opacity: hiding ? 0 : 1,
        transform: hiding ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: hiding ? 'none' : 'auto',
        transition: reduceMotion
          ? 'none'
          : `opacity ${HIDE_TRANSITION_MS}ms var(--ease-standard), transform ${HIDE_TRANSITION_MS}ms var(--ease-standard)`,
      }}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{t('label')}</span>
      <span className="sr-only" aria-live="polite">
        {announcedPercent > 0 ? t('announce', { percent: announcedPercent }) : null}
      </span>

      <svg viewBox="0 0 320 200" width="280" height="175" aria-hidden="true" className="max-w-[70vw]">
        <defs>
          <radialGradient id="splash-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={sketchColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={sketchColor} stopOpacity="0" />
          </radialGradient>
          <clipPath id="splash-aperture">
            {/* No CSS transition on `r`: its value already updates every
                animation frame from a GSAP-tweened percent (below), so a
                second transition layered on top would smooth an already-
                smooth value and read as laggy/rubbery instead of crisp. */}
            <circle cx="160" cy="100" r={(aperturePct / 100) * 260} />
          </clipPath>
        </defs>

        {/* Unlit sketch — always visible, present but not yet legible. */}
        <g stroke="var(--color-surface-3)" strokeWidth="1" fill="none" opacity="0.15">
          <rect x="60" y="40" width="200" height="120" />
          <line x1="60" y1="30" x2="60" y2="20" />
          <line x1="260" y1="30" x2="260" y2="20" />
          <line x1="60" y1="25" x2="260" y2="25" />
          <circle cx="110" cy="100" r="4" />
          <circle cx="210" cy="70" r="4" />
          <line x1="110" y1="100" x2="210" y2="70" />
        </g>

        {/* Lit sketch — revealed by the widening aperture clip. */}
        <g clipPath="url(#splash-aperture)">
          <circle cx="160" cy="100" r="90" fill="url(#splash-glow)" opacity="0.5" />
          <g
            stroke={sketchColor}
            strokeWidth="1.25"
            fill="none"
            style={{ transition: 'stroke var(--duration-ignition) var(--ease-ignition)' }}
          >
            <rect x="60" y="40" width="200" height="120" />
            <line x1="60" y1="30" x2="60" y2="20" />
            <line x1="260" y1="30" x2="260" y2="20" />
            <line x1="60" y1="25" x2="260" y2="25" />
            <circle cx="110" cy="100" r="4" fill={sketchColor} />
            <circle cx="210" cy="70" r="4" fill={sketchColor} />
            <line x1="110" y1="100" x2="210" y2="70" />
          </g>
        </g>
      </svg>

      {!igniting ? (
        <div className="mt-[var(--spacing-m)] font-mono text-[length:var(--step--1)] text-ink-2">
          <Measure value={percent} unit="%" />
        </div>
      ) : (
        <div className="u-display mt-[var(--spacing-m)] text-[length:var(--step-2)] tracking-[0.04em] text-ink">
          {pick(site.name, locale)}
        </div>
      )}
    </div>
  );
}
