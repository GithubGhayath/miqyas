'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import type { Locale, TeamMember } from '@/content/types';
import { pick } from '@/lib/pick';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { springSnappy } from '@/lib/motion';
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  // Task 2.2 (creative-enhancement-pass) — a small perspective tilt on the
  // focused portrait, following cursor position within the node, as if it
  // were a physical object under the spotlight rather than a flat image.
  // Reuses SurveyHero's own hero-tilt mechanic exactly (`m.div` +
  // `animate={{ rotateX, rotateY }}` + the shared `springSnappy` token,
  // not a new damping curve) rather than inventing a parallel GSAP
  // version of the same idea. Desktop/fine-pointer only, disabled under
  // reduced motion.
  const MAX_TILT_DEG = 5;

  function onPortraitPointerMove(event: { currentTarget: HTMLElement; clientX: number; clientY: number }) {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 });
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

      {/* Desktop (≥1024px): the radiating assembly. A bounded sheet, not a
          diagram floating in open space — corner brackets and a faint
          measurement grid borrow the same frame language as the Work
          conveyor's carriages, so the two sections read as one system
          rather than two unrelated experiments. */}
      <div
        className="assembly assembly--framed relative hidden w-full border border-border lg:block"
        style={{ aspectRatio: '16 / 10', minBlockSize: '30rem' }}
      >
        <span className="assembly__corner assembly__corner--tl" aria-hidden="true" />
        <span className="assembly__corner assembly__corner--br" aria-hidden="true" />
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
              style={{
                insetInlineStart: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                perspective: 700,
              }}
              onMouseEnter={() => window.matchMedia('(pointer: fine)').matches && setActiveId(member.id)}
              onMouseLeave={() => {
                if (!window.matchMedia('(pointer: fine)').matches) return;
                setActiveId((current) => (current === member.id ? null : current));
                setTilt({ x: 0, y: 0 });
              }}
              onMouseMove={onPortraitPointerMove}
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
                <m.div
                  className={`duotone duotone-fade relative overflow-hidden rounded-full border-2 border-void shadow-[0_0_0_1px_var(--color-border)] transition-[inline-size,block-size] duration-[var(--duration-ignition)] ${
                    active ? 'is-revealed h-36 w-36 md:h-52 md:w-52' : 'h-24 w-24 md:h-32 md:w-32'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-ignition)' }}
                  animate={active && !reduceMotion ? { rotateX: tilt.x, rotateY: tilt.y } : { rotateX: 0, rotateY: 0 }}
                  transition={springSnappy}
                >
                  <Image
                    src={member.portrait.src}
                    alt=""
                    fill
                    priority
                    sizes={active ? '(min-width: 768px) 208px, 144px' : '(min-width: 768px) 128px, 96px'}
                    className="object-cover"
                  />
                </m.div>
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
