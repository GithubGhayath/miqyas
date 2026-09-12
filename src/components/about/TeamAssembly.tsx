'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import type { Locale, TeamMember } from '@/content/types';
import { pick } from '@/lib/pick';
import { useDirection } from '@/hooks/useDirection';
import { IGNITION_DURATION, IGNITION_EASE, respectsReducedMotion } from '@/lib/ignition';
import { TitleBlock } from '@/components/ui/TitleBlock';

/**
 * "The Assembly" — FIX-AND-POLISH-V1 §3.2, replacing the Spotlight Roster
 * concept entirely (not tuning it). Six members as six parts of one
 * assembly: a shared-methodology hub with a thin dimension-rule line
 * radiating out to each member, positioned asymmetrically rather than as a
 * symmetric wheel. Recomposes three mechanics that already exist elsewhere
 * on the site (ignition, duotone-to-colour, line-draw) instead of
 * inventing a fourth.
 *
 * FIX-AND-POLISH-V2 §2: the radiating hub-and-spoke geometry is desktop-
 * only (≥1024px) — below that it renders as a plain vertical column with
 * no attempt to preserve the geometry (§2.3). The hover-triggered
 * expand/collapse flicker from round 1 was the textbook cause: the
 * `:hover`/`mouseenter` target was the button that *itself* grows on
 * hover (a flex column sized to its now-larger portrait child), so the
 * pointer could end up outside the grown button, firing `mouseleave`,
 * shrinking it back under the pointer, re-firing `mouseenter` — a loop.
 * The hover trigger now lives on the outer `data-assembly-node` wrapper,
 * which is absolutely positioned at a fixed point and never itself
 * changes size; only its children animate.
 */

// Deliberately irregular — not evenly spaced around the hub (§4's
// broken-grid principle). Percent-of-container coordinates; the container
// keeps a fixed aspect ratio so this scatter never re-collides at a
// different viewport width, only shrinks uniformly.
const HUB = { x: 38, y: 46 };
const POSITIONS: { x: number; y: number }[] = [
  { x: 74, y: 16 },
  { x: 90, y: 44 },
  { x: 76, y: 76 },
  { x: 46, y: 90 },
  { x: 13, y: 68 },
  { x: 10, y: 20 },
];

// Task 2.1 (creative-enhancement-pass) — the spark burst at a node's
// activation point. Four fixed radial offsets (not random — random would
// make the burst look slightly different every time, which reads as
// noise rather than a single consistent "something switched on" beat, the
// same reasoning behind the ignition token being one shared constant).
// Small viewBox units (the assembly SVG is 0–100).
const SPARK_OFFSETS = [
  { dx: 2.2, dy: -1.4 },
  { dx: -1.8, dy: -1.8 },
  { dx: 1.2, dy: 2.1 },
  { dx: -2, dy: 1 },
];

function quadrant(pos: { x: number; y: number }) {
  const dx = pos.x - HUB.x;
  const dy = pos.y - HUB.y;
  return {
    // "start"/"end" rather than left/right so the callout opens toward
    // reading-outward in both LTR and RTL, not a fixed physical side.
    horizontal: dx >= 0 ? ('end' as const) : ('start' as const),
    vertical: dy >= 0 ? ('bottom' as const) : ('top' as const),
  };
}

export function TeamAssembly({ team, locale }: { team: TeamMember[]; locale: Locale }) {
  const { dir } = useDirection();
  const tAbout = useTranslations('about');
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileActiveId, setMobileActiveId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sparkRefs = useRef<Record<string, SVGCircleElement[]>>({});

  useEffect(() => {
    // Whether the whole diagram collapses to a static list is client-only
    // (a media query) information the render genuinely depends on.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(respectsReducedMotion());
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    function onDocClick(event: MouseEvent) {
      if (window.matchMedia('(pointer: fine)').matches) return;
      const target = event.target as HTMLElement;
      if (!target.closest('[data-assembly-node]')) setActiveId(null);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [reduceMotion]);

  // Task 2.1 (creative-enhancement-pass) — a one-shot spark burst at the
  // node's own point, the instant its connecting line ignites. Reuses
  // IGNITION_DURATION/IGNITION_EASE and the signal colour already applied
  // to `.assembly-line--active` — no new timing or colour value. `fromTo`
  // (not `to`) so every activation starts clean regardless of whether a
  // previous burst on the same node was interrupted mid-fade.
  useEffect(() => {
    if (reduceMotion || !activeId) return;
    const circles = sparkRefs.current[activeId];
    if (!circles || circles.length === 0) return;
    const tween = gsap.fromTo(
      circles,
      { attr: { r: 1.1 }, opacity: 1, transformOrigin: 'center' },
      { attr: { r: 0.15 }, opacity: 0, duration: IGNITION_DURATION, ease: IGNITION_EASE, overwrite: true },
    );
    return () => {
      tween.kill();
    };
  }, [activeId, reduceMotion]);

  const nodes = team.slice(0, 6).map((member, index) => ({
    member,
    pos: POSITIONS[index] ?? POSITIONS[POSITIONS.length - 1],
  }));

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = dir === 'rtl' ? -1 : 1;
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + forward + nodes.length) % nodes.length;
    else if (event.key === 'ArrowLeft') next = (index - forward + nodes.length) % nodes.length;
    else if (event.key === 'ArrowDown') next = (index + 1) % nodes.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + nodes.length) % nodes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = nodes.length - 1;
    if (next >= 0) {
      event.preventDefault();
      btnRefs.current[nodes[next].member.id]?.focus();
    }
  }

  // Reduced motion: a static, readable list rather than six permanently-
  // expanded, overlapping callouts crowded into the same scattered
  // coordinates — the spec's own requirement is "all six fully visible,
  // nothing to trigger," which a list satisfies more legibly than forcing
  // the interactive layout's positions into a non-interactive state.
  if (reduceMotion) {
    return (
      <div className="frame">
        <ul className="grid grid-cols-1 gap-[var(--spacing-m)] sm:grid-cols-2 lg:grid-cols-3" role="list">
          {nodes.map(({ member }) => (
            <li key={member.id} className="flex flex-col gap-[var(--spacing-2xs)] border border-border p-[var(--spacing-s)]">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border">
                {/* priority: native lazy-loading never fires its
                    intersection check for a `fill` image nested this many
                    `absolute`/`relative` layers deep — see BeforeAfter.tsx
                    for how this was confirmed. */}
                <Image src={member.portrait.src} alt="" fill priority sizes="80px" className="object-cover" />
              </div>
              <TitleBlock cells={[{ label: pick(member.role, locale), value: pick(member.name, locale) }]} />
              <p className="text-ink-2">{pick(member.contribution, locale)}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="frame">
      {/* Mobile / tablet (<1024px): a plain vertical column — the
          radiating hub-and-spoke geometry is a desktop-only device with no
          sensible small-screen equivalent (§2.3), not something to scale
          down. Duotone-to-colour still applies; tap replaces hover. */}
      <div className="flex flex-col gap-[var(--spacing-l)] lg:hidden">
        <p className="measure-block text-ink-2">{tAbout('teamIntro')}</p>
        {nodes.map(({ member }, index) => {
          const expanded = mobileActiveId === member.id;
          return (
            <div key={member.id}>
              {/* A short vertical tick between stacked members, not the
                  angled radiating lines — the dimension-rule visual
                  language, scaled to what a single column can carry. */}
              {index > 0 ? <span className="assembly-mobile-tick" aria-hidden="true" /> : null}
              <button
                type="button"
                aria-expanded={expanded}
                className="flex w-full items-center gap-[var(--spacing-s)] text-start"
                onClick={() => setMobileActiveId((current) => (current === member.id ? null : member.id))}
              >
                <div
                  className={`duotone duotone-fade relative h-16 w-16 flex-none overflow-hidden rounded-full border-2 border-void${
                    expanded ? ' is-revealed' : ''
                  }`}
                >
                  <Image src={member.portrait.src} alt="" fill priority sizes="64px" className="object-cover" />
                </div>
                <TitleBlock cells={[{ label: pick(member.role, locale), value: pick(member.name, locale) }]} />
              </button>
              {expanded ? (
                <p className="mt-[var(--spacing-2xs)] ps-[calc(4rem+var(--spacing-s))] text-ink-2">
                  {pick(member.contribution, locale)}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Desktop (≥1024px): the radiating assembly. */}
      <div className="assembly relative hidden w-full lg:block" style={{ aspectRatio: '16 / 10', minBlockSize: '30rem' }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {nodes.map(({ member, pos }) => {
            const active = activeId === member.id;
            const x1 = dir === 'rtl' ? 100 - HUB.x : HUB.x;
            const x2 = dir === 'rtl' ? 100 - pos.x : pos.x;
            return (
              <line
                key={member.id}
                x1={x1}
                y1={HUB.y}
                x2={x2}
                y2={pos.y}
                vectorEffect="non-scaling-stroke"
                className={`assembly-line${active ? ' assembly-line--active' : ''}`}
              />
            );
          })}
          {/* Task 2.1 — spark burst circles, one group per node, sitting
              at the exact point the line meets the node (x2, y2 above).
              Hidden (opacity 0) until the activation effect fires them. */}
          {nodes.map(({ member, pos }) => {
            const x2 = dir === 'rtl' ? 100 - pos.x : pos.x;
            return (
              <g key={`${member.id}-spark`} transform={`translate(${x2}, ${pos.y})`} aria-hidden="true">
                {SPARK_OFFSETS.map((offset, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      const list = sparkRefs.current[member.id] ?? [];
                      list[i] = el as SVGCircleElement;
                      sparkRefs.current[member.id] = list;
                    }}
                    cx={offset.dx}
                    cy={offset.dy}
                    r={0.15}
                    opacity={0}
                    fill="var(--color-signal)"
                  />
                ))}
              </g>
            );
          })}
        </svg>

        <div
          className="assembly-hub absolute"
          style={{ insetInlineStart: `${HUB.x}%`, top: `${HUB.y}%` }}
          aria-hidden="true"
        />

        {nodes.map(({ member, pos }, index) => {
          const active = activeId === member.id;
          const { horizontal, vertical } = quadrant(pos);
          const panelId = `${baseId}-panel-${member.id}`;
          return (
            <div
              key={member.id}
              data-assembly-node
              className="absolute"
              style={{ insetInlineStart: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => window.matchMedia('(pointer: fine)').matches && setActiveId(member.id)}
              onMouseLeave={() =>
                window.matchMedia('(pointer: fine)').matches &&
                setActiveId((current) => (current === member.id ? null : current))
              }
            >
              <button
                ref={(el) => {
                  btnRefs.current[member.id] = el;
                }}
                type="button"
                aria-expanded={active}
                aria-controls={panelId}
                aria-label={`${pick(member.name, locale)} — ${pick(member.role, locale)}`}
                className="assembly-node relative flex flex-col items-center gap-[var(--spacing-3xs)] focus-visible:outline-2 focus-visible:outline-focus"
                onKeyDown={(event) => onKeyDown(event, index)}
                onFocus={() => setActiveId(member.id)}
                onBlur={() => setActiveId((current) => (current === member.id ? null : current))}
                onClick={() => {
                  if (window.matchMedia('(pointer: fine)').matches) return;
                  setActiveId((current) => (current === member.id ? null : member.id));
                }}
              >
                <div
                  className={`duotone duotone-fade relative overflow-hidden rounded-full border-2 border-void transition-[inline-size,block-size] duration-[var(--duration-ignition)] ${
                    active ? 'is-revealed h-28 w-28 md:h-44 md:w-44' : 'h-16 w-16 md:h-24 md:w-24'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-ignition)' }}
                >
                  <Image
                    src={member.portrait.src}
                    alt=""
                    fill
                    priority
                    sizes={active ? '(min-width: 768px) 176px, 112px' : '(min-width: 768px) 96px, 64px'}
                    className="object-cover"
                  />
                </div>
                <span className="pointer-events-none font-mono text-[length:var(--step--1)] text-ink-3">
                  {pick(member.name, locale)}
                </span>
              </button>

              {active ? (
                <div
                  id={panelId}
                  role="group"
                  className="assembly-panel pointer-events-none absolute z-10 w-56 border border-border bg-void p-[var(--spacing-s)] text-start"
                  style={
                    {
                      [horizontal === 'end' ? 'insetInlineStart' : 'insetInlineEnd']: 'calc(100% + var(--spacing-s))',
                      [vertical === 'bottom' ? 'top' : 'bottom']: '0',
                    } as CSSProperties
                  }
                >
                  <TitleBlock cells={[{ label: pick(member.role, locale), value: pick(member.name, locale) }]} />
                  <p className="mt-[var(--spacing-2xs)] text-[length:var(--step--1)] text-ink-2">
                    {pick(member.contribution, locale)}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
