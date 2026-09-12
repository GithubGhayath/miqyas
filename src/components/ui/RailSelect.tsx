'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

const COACH_MARK_SESSION_KEY = 'miqyas:railselect-coachmark-seen';

export interface RailSelectOption {
  id: string;
  tickLabel: ReactNode;
  ariaLabel: string;
}

/**
 * FIX-AND-POLISH-V1 §4 / FIX-AND-POLISH-V2 §4 — the shared control behind
 * the method stepper, the condition-scale explorer, and the tier-compare
 * switch: a row of mutually exclusive options living *on* a dimension
 * rule, with the active selection marked by a tick that travels along the
 * rail like a caliper needle finding a new reading. The panel below
 * re-uses the site's camera-move language, driven directly by GSAP on
 * selection change.
 *
 * V2 §4 adds two mechanisms, both here (not per-usage), so fixing them
 * once fixes all three call sites: autoplay cycles through every option
 * until the visitor proves they've found the control (any click, key, or
 * hover), and a one-time-per-session coach-mark (a drawn-in arrow + a
 * caption) makes the interaction explicit rather than relying on autoplay
 * alone to imply it.
 */
export function RailSelect({
  options,
  activeId,
  onChange,
  ariaLabel,
  role = 'radiogroup',
  renderPanel,
  autoplayMs = 4500,
  coachMarkCaption,
}: {
  options: RailSelectOption[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  role?: 'tablist' | 'radiogroup';
  renderPanel: (activeId: string) => ReactNode;
  autoplayMs?: number;
  coachMarkCaption: string;
}) {
  const { dir } = useDirection();
  const baseId = useId();
  const railRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mountedRef = useRef(false);
  const panelMountedRef = useRef(false);
  const [displayedId, setDisplayedId] = useState(activeId);
  const [autoplay, setAutoplay] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showCoachMark, setShowCoachMark] = useState(false);
  const coachMarkPathRef = useRef<SVGPathElement>(null);

  const activeIndex = Math.max(0, options.findIndex((o) => o.id === activeId));
  const optionRole = role === 'tablist' ? 'tab' : 'radio';

  function positionTick() {
    const rail = railRef.current;
    const tick = tickRef.current;
    const btn = btnRefs.current[options[activeIndex]?.id ?? ''];
    if (!rail || !tick || !btn) return;
    const railRect = rail.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const center = btnRect.left + btnRect.width / 2 - railRect.left;
    tick.style.left = `${center}px`;
  }

  useLayoutEffect(() => {
    positionTick();
    window.addEventListener('resize', positionTick);
    return () => window.removeEventListener('resize', positionTick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Both client-only checks (a stored "seen it" flag, a media query)
    // that this component's very first interactive behaviour depends on.
    const reduced = respectsReducedMotion();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(reduced);
    if (reduced) return;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(COACH_MARK_SESSION_KEY) === '1';
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return;
    const rail = railRef.current;
    if (!rail) return;
    const trigger = ScrollTrigger.create({
      trigger: rail,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setShowCoachMark(true);
        try {
          sessionStorage.setItem(COACH_MARK_SESSION_KEY, '1');
        } catch {
          /* private browsing — coach-mark may repeat next load, harmless */
        }
      },
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!showCoachMark) return;
    const path = coachMarkPathRef.current;
    if (path) gsap.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.out' });
    const timeout = setTimeout(() => setShowCoachMark(false), 4000);
    return () => clearTimeout(timeout);
  }, [showCoachMark]);

  function stopAutoplay() {
    setAutoplay(false);
    setShowCoachMark(false);
  }

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    const id = setTimeout(() => {
      const next = (activeIndex + 1) % options.length;
      const nextId = options[next]?.id;
      if (nextId) onChange(nextId);
    }, autoplayMs);
    return () => clearTimeout(id);
    // Re-arms one step at a time, keyed off the *current* index — this is
    // the correct way to self-schedule a repeating advance without a
    // stale closure over `activeIndex`, not a bug to be deduped away.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, reduceMotion, activeIndex, autoplayMs]);

  // Content correctness is never gated behind an animation: `displayedId`
  // updates synchronously the moment `activeId` changes, full stop. An
  // earlier version of this component set it from inside a GSAP timeline's
  // `.call()` step instead — which meant the panel stayed stuck on stale
  // content indefinitely any time the GSAP ticker didn't get a tick soon
  // after the click (a backgrounded/hidden tab suspends it by design).
  // Confirmed live: clicking a tick while the tab was backgrounded left
  // `aria-selected` correctly updated but the panel showing the *previous*
  // option's content until the tab regained focus — a real bug, not just a
  // test-environment quirk. The GSAP timeline below now runs purely as an
  // entrance flourish on content that is already correct.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setDisplayedId(activeId);
  }, [activeId]);

  useEffect(() => {
    if (!panelMountedRef.current) {
      panelMountedRef.current = true;
      return;
    }
    if (respectsReducedMotion()) {
      positionTick();
      return;
    }
    const tick = tickRef.current;
    if (tick) {
      const rail = railRef.current;
      const btn = btnRefs.current[displayedId];
      if (rail && btn) {
        const railRect = rail.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const center = btnRect.left + btnRect.width / 2 - railRect.left;
        gsap.to(tick, { left: center, duration: 0.5, ease: 'back.out(1.4)' });
      }
    }
    const panel = panelRef.current;
    if (panel) {
      gsap.fromTo(
        panel,
        { y: -10, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedId]);

  function move(delta: number) {
    stopAutoplay();
    const next = Math.min(options.length - 1, Math.max(0, activeIndex + delta));
    const nextId = options[next]?.id;
    if (nextId && nextId !== activeId) onChange(nextId);
    requestAnimationFrame(() => btnRefs.current[nextId ?? '']?.focus());
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = dir === 'rtl' ? -1 : 1;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(forward);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-forward);
    } else if (event.key === 'Home') {
      event.preventDefault();
      stopAutoplay();
      if (options[0]) {
        onChange(options[0].id);
        requestAnimationFrame(() => btnRefs.current[options[0].id]?.focus());
      }
    } else if (event.key === 'End') {
      event.preventDefault();
      stopAutoplay();
      const last = options[options.length - 1];
      if (last) {
        onChange(last.id);
        requestAnimationFrame(() => btnRefs.current[last.id]?.focus());
      }
    }
  }

  return (
    <div>
      <div className="relative">
        {!reduceMotion && showCoachMark ? (
          <div
            className="rail-select__coach-mark pointer-events-none absolute -top-8 start-0 flex items-center gap-[var(--spacing-2xs)]"
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                ref={coachMarkPathRef}
                d="M20 4 C14 4 6 8 4 20"
                stroke="var(--color-signal)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="font-mono text-[length:var(--step--1)] text-signal-text">{coachMarkCaption}</span>
          </div>
        ) : null}
        {reduceMotion ? (
          <p className="mb-[var(--spacing-2xs)] font-mono text-[length:var(--step--1)] text-ink-3">
            {coachMarkCaption}
          </p>
        ) : null}
        <div
          ref={railRef}
          role={role}
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          onMouseEnter={stopAutoplay}
          onPointerDown={stopAutoplay}
          className="relative flex items-center"
        >
          <span className="rail-select__line" aria-hidden="true" />
          <span ref={tickRef} className="rail-select__active-tick" aria-hidden="true" />
          {options.map((option) => {
            const isActive = option.id === activeId;
            return (
              <button
                key={option.id}
                id={`${baseId}-tick-${option.id}`}
                ref={(el) => {
                  btnRefs.current[option.id] = el;
                }}
                type="button"
                role={optionRole}
                aria-selected={role === 'tablist' ? isActive : undefined}
                aria-checked={role === 'radiogroup' ? isActive : undefined}
                aria-label={option.ariaLabel}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  stopAutoplay();
                  onChange(option.id);
                }}
                className="rail-select__tick relative z-10 flex flex-1 flex-col items-center gap-[var(--spacing-3xs)] py-[var(--spacing-xs)] focus-visible:outline-2 focus-visible:outline-focus"
              >
                <span className="rail-select__mark" aria-hidden="true" />
                <span
                  className={`font-mono text-[length:var(--step--1)] ${isActive ? 'text-ink' : 'text-ink-3'}`}
                >
                  {option.tickLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div
        ref={panelRef}
        id={`${baseId}-panel`}
        role={role === 'tablist' ? 'tabpanel' : undefined}
        aria-labelledby={role === 'tablist' ? `${baseId}-tick-${activeId}` : undefined}
        tabIndex={role === 'tablist' ? 0 : undefined}
        className="mt-[var(--spacing-m)]"
      >
        {renderPanel(displayedId)}
      </div>
    </div>
  );
}
