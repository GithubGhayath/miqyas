'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { Locale, TeamMember } from '@/content/types';
import { pick } from '@/lib/pick';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { TitleBlock } from '@/components/ui/TitleBlock';

/**
 * "The Assembly" — FIX-AND-POLISH-V1 §3.2, replacing the Spotlight Roster
 * concept entirely (not tuning it). Six members as six parts of one
 * assembly: a shared-methodology hub with a thin dimension-rule line
 * radiating out to each member, positioned asymmetrically rather than as a
 * symmetric wheel. Recomposes three mechanics that already exist elsewhere
 * on the site (ignition, duotone-to-colour, line-draw) instead of
 * inventing a fourth.
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
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
                <Image src={member.portrait.src} alt="" fill sizes="64px" className="object-cover" />
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
      <div className="assembly relative w-full" style={{ aspectRatio: '16 / 10', minBlockSize: '22rem' }}>
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
              style={{ insetInlineStart: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
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
                onMouseEnter={() => window.matchMedia('(pointer: fine)').matches && setActiveId(member.id)}
                onMouseLeave={() =>
                  window.matchMedia('(pointer: fine)').matches &&
                  setActiveId((current) => (current === member.id ? null : current))
                }
                onClick={() => {
                  if (window.matchMedia('(pointer: fine)').matches) return;
                  setActiveId((current) => (current === member.id ? null : member.id));
                }}
              >
                <div
                  className={`duotone duotone-fade relative overflow-hidden rounded-full border-2 border-void transition-[inline-size,block-size] duration-[var(--duration-ignition)] ${
                    active ? 'is-revealed h-20 w-20' : 'h-12 w-12'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-ignition)' }}
                >
                  <Image src={member.portrait.src} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <span className="pointer-events-none font-mono text-[length:var(--step--1)] text-ink-3">
                  {pick(member.name, locale)}
                </span>
              </button>

              {active ? (
                <div
                  id={panelId}
                  role="group"
                  className="assembly-panel absolute z-10 w-56 border border-border bg-void p-[var(--spacing-s)] text-start"
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
