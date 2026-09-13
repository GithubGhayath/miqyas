'use client';

import Image from 'next/image';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'motion/react';
import gsap from 'gsap';
import type { Locale, TeamMember } from '@/content/types';
import { pick } from '@/lib/pick';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { springSettled, springSnappy } from '@/lib/motion';
import { TitleBlock } from '@/components/ui/TitleBlock';
import { CoachMark } from '@/components/ui/CoachMark';
import { useDiscoverabilityHint } from '@/hooks/useDiscoverabilityHint';

/**
 * "The Cluster" — full replacement of the hub-and-spoke Assembly
 * (creative-layout-replacement §2). Six portraits as a composed, irregular,
 * overlapping collage rather than a diagram: different sizes, different
 * implied depth, positioned so it reads as intentional rather than
 * scattered. `insetInlineStart` (not `left`) is what makes the whole
 * composition mirror correctly for `rtl` without a second hand-authored
 * layout — the browser does the mirroring, not us.
 *
 * Three independent animation layers, each on its own DOM node so they
 * never fight over the same `transform`:
 *  1. The slot (`.cluster-slot`) — idle drift (CSS keyframes, per-portrait
 *     phase/duration) and the rest<->focused position transition (a plain
 *     CSS transition on inset/size, driven by React state).
 *  2. The reactive wrapper (`.cluster-reactive`) — cursor-magnetism,
 *     GSAP `quickTo` on x/y, desktop fine-pointer only.
 *  3. The portrait itself — duotone-to-colour hover reveal (existing
 *     sitewide mechanic, unchanged) and the focus-mode scale/blur.
 */

interface ClusterSlot {
  x: number; // insetInlineStart, % of container width
  y: number; // top, % of container height
  w: number; // inline-size, % of container width
  depth: number; // 0 = front/closest, 1 = furthest back
}

// Deliberately irregular and overlapping — a considered collage, not a
// grid and not a random scatter. Mirrors automatically in rtl because
// every consumer of this array reads `x` as `insetInlineStart`.
const LAYOUT: ClusterSlot[] = [
  { x: 3, y: 6, w: 30, depth: 0 },
  { x: 39, y: 2, w: 18, depth: 0.7 },
  { x: 63, y: 12, w: 25, depth: 0.15 },
  { x: 8, y: 50, w: 20, depth: 0.45 },
  { x: 33, y: 44, w: 27, depth: 0 },
  { x: 66, y: 52, w: 21, depth: 0.55 },
];

const MAGNET_RADIUS = 160; // px — cursor influence radius
const MAGNET_STRENGTH = 18; // px — max displacement at the very centre

export function TeamAssembly({ team, locale }: { team: TeamMember[]; locale: Locale }) {
  const { dir } = useDirection();
  const tAbout = useTranslations('about');
  const baseId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const clusterRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reactiveRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const magnetSetters = useRef<Record<string, { setX: (v: number) => void; setY: (v: number) => void }>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(respectsReducedMotion());
  }, []);

  const nodes = useMemo(
    () => team.slice(0, 6).map((member, index) => ({ member, slot: LAYOUT[index] ?? LAYOUT[LAYOUT.length - 1] })),
    [team],
  );

  // Nothing signalled that a portrait was clickable (reported directly:
  // "the user will not notice he should click on a member"). Same fix as
  // RailSelect's own discoverability problem, reused rather than
  // reinvented: an auto-cycling preview (each portrait takes a turn
  // resolving to colour) plus a one-time coach-mark, both permanently
  // stopped by the first real hover/click/focus.
  const { triggerRef: hintRef, previewIndex, showCoachMark, stop: stopHint } = useDiscoverabilityHint({
    sessionKey: 'miqyas:cluster-hint-seen',
    itemCount: nodes.length,
    disabled: reduceMotion,
  });

  // §2.4 — magnetic cursor reactivity. One pointermove listener on the
  // whole cluster (not one per portrait) computes every portrait's
  // reactive-wrapper offset each move; quickTo per portrait is created
  // lazily so an untouched portrait never allocates a tween.
  useEffect(() => {
    if (reduceMotion || focusedId) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const cluster = clusterRef.current;
    if (!cluster) return;

    function getSetter(id: string) {
      let setter = magnetSetters.current[id];
      if (!setter) {
        const el = reactiveRefs.current[id];
        if (!el) return null;
        setter = {
          setX: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
          setY: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
        };
        magnetSetters.current[id] = setter;
      }
      return setter;
    }

    function onMove(event: PointerEvent) {
      for (const { member } of nodes) {
        const el = reactiveRefs.current[member.id];
        const setter = getSetter(member.id);
        if (!el || !setter) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - event.clientX;
        const dy = cy - event.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > MAGNET_RADIUS || dist === 0) {
          setter.setX(0);
          setter.setY(0);
          continue;
        }
        const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;
        setter.setX((dx / dist) * pull);
        setter.setY((dy / dist) * pull);
      }
    }

    function onLeave() {
      for (const { member } of nodes) {
        magnetSetters.current[member.id]?.setX(0);
        magnetSetters.current[member.id]?.setY(0);
      }
    }

    cluster.addEventListener('pointermove', onMove);
    cluster.addEventListener('pointerleave', onLeave);
    return () => {
      cluster.removeEventListener('pointermove', onMove);
      cluster.removeEventListener('pointerleave', onLeave);
    };
  }, [nodes, reduceMotion, focusedId]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = dir === 'rtl' ? -1 : 1;
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + forward + nodes.length) % nodes.length;
    else if (event.key === 'ArrowLeft') next = (index - forward + nodes.length) % nodes.length;
    else if (event.key === 'ArrowDown') next = (index + 1) % nodes.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + nodes.length) % nodes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = nodes.length - 1;
    else if (event.key === 'Escape' && focusedId) {
      setFocusedId(null);
      return;
    }
    if (next >= 0) {
      event.preventDefault();
      btnRefs.current[nodes[next].member.id]?.focus();
    }
  }

  function toggleFocus(id: string) {
    setFocusedId((current) => (current === id ? null : id));
  }

  const focusedMember = nodes.find((n) => n.member.id === focusedId)?.member ?? null;

  // Reduced motion: a static, fully-legible list — no drift, no magnetism,
  // no overlapping collage to navigate past. Click/tap still opens the
  // identical focus panel (just without the surrounding blur choreography).
  if (reduceMotion) {
    return (
      <div className="frame">
        <ul className="grid grid-cols-1 gap-[var(--spacing-m)] sm:grid-cols-2 lg:grid-cols-3" role="list">
          {nodes.map(({ member }) => (
            <li key={member.id} className="flex flex-col gap-[var(--spacing-2xs)] border border-border p-[var(--spacing-s)]">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border">
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
    <div
      className="frame"
      ref={(el) => {
        hintRef.current = el;
      }}
    >
      {/* Mobile / tablet (<1024px): a single column — the overlapping
          collage geometry is a desktop-only device (§2.6), not something
          to compress. Tap opens the identical focus interaction: the row
          expands with the detail content and every other row dims. */}
      <p className="measure-block mb-[var(--spacing-m)] text-ink-2 lg:hidden">{tAbout('teamIntro')}</p>
      {showCoachMark ? (
        <div className="mb-[var(--spacing-s)] lg:hidden">
          <CoachMark caption={tAbout('clusterCoachMark')} />
        </div>
      ) : null}
      <ul className="flex flex-col gap-[var(--spacing-s)] lg:hidden" role="list">
        {nodes.map(({ member }, index) => {
          const expanded = focusedId === member.id;
          const dimmed = focusedId !== null && !expanded;
          const previewed = !focusedId && previewIndex === index;
          return (
            <li
              key={member.id}
              className={`cluster-mobile-row border border-border p-[var(--spacing-s)] transition-[opacity,filter] duration-300 ${dimmed ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}
            >
              <button
                type="button"
                aria-expanded={expanded}
                className="flex w-full items-center gap-[var(--spacing-s)] text-start"
                onClick={() => {
                  stopHint();
                  toggleFocus(member.id);
                }}
              >
                <div
                  className={`duotone duotone-fade relative h-16 w-16 flex-none overflow-hidden rounded-md border-2 border-void${
                    expanded || previewed ? ' is-revealed' : ''
                  }`}
                >
                  <Image src={member.portrait.src} alt="" fill priority sizes="64px" className="object-cover" />
                </div>
                <TitleBlock cells={[{ label: pick(member.role, locale), value: pick(member.name, locale) }]} />
              </button>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <m.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={springSettled}
                    className="overflow-hidden ps-[calc(4rem+var(--spacing-s))] text-ink-2"
                  >
                    <span className="mt-[var(--spacing-2xs)] block">{pick(member.contribution, locale)}</span>
                  </m.p>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Desktop (≥1024px): the cluster. Wrapped in its own `relative` box
          so the coach-mark (positioned just above the cluster's own
          top edge) isn't clipped by `.cluster`'s own overflow-hidden. */}
      <div className="relative hidden lg:block">
        {showCoachMark ? (
          <div className="absolute -top-9 start-4 z-40">
            <CoachMark caption={tAbout('clusterCoachMark')} />
          </div>
        ) : null}
        <div
          ref={clusterRef}
          className="cluster relative w-full overflow-hidden border border-border"
          style={{ aspectRatio: '16 / 11', minBlockSize: '32rem' }}
          onMouseEnter={stopHint}
          onClick={(event) => {
            if (event.target === event.currentTarget) setFocusedId(null);
          }}
        >
          <span className="cluster__corner cluster__corner--tl" aria-hidden="true" />
          <span className="cluster__corner cluster__corner--br" aria-hidden="true" />

          {nodes.map(({ member, slot }, index) => {
            const focused = focusedId === member.id;
            const hovered = hoveredId === member.id && !focusedId;
            const previewed = !focusedId && !hovered && previewIndex === index;
            const dimmed = focusedId !== null && !focused;
            const panelId = `${baseId}-panel-${member.id}`;
          return (
            <div
              key={member.id}
              className={`cluster-slot absolute${reduceMotion || focusedId ? '' : ' cluster-slot--drift'}`}
              style={
                focused
                  ? {
                      insetInlineStart: '5%',
                      top: '8%',
                      insetBlockEnd: '8%',
                      inlineSize: 'min(34%, 22rem)',
                      zIndex: 20,
                    }
                  : {
                      insetInlineStart: `${slot.x}%`,
                      top: `${slot.y}%`,
                      inlineSize: `${slot.w}%`,
                      zIndex: Math.round((1 - slot.depth) * 10) + 1,
                      ['--drift-duration' as string]: `${8 + index * 1.6}s`,
                      ['--drift-delay' as string]: `${-index * 1.9}s`,
                      ['--drift-x' as string]: `${index % 2 === 0 ? 6 : -6}px`,
                      ['--drift-y' as string]: `${index % 3 === 0 ? -7 : 5}px`,
                    }
              }
            >
              <div
                ref={(el) => {
                  reactiveRefs.current[member.id] = el;
                }}
                className="cluster-reactive"
              >
                <button
                  ref={(el) => {
                    btnRefs.current[member.id] = el;
                  }}
                  type="button"
                  aria-expanded={focused}
                  aria-controls={panelId}
                  aria-label={`${pick(member.name, locale)} — ${pick(member.role, locale)}`}
                  className="cluster-portrait-btn group relative block w-full focus-visible:outline-2 focus-visible:outline-focus"
                  onKeyDown={(event) => onKeyDown(event, index)}
                  onMouseEnter={() => {
                    stopHint();
                    setHoveredId(member.id);
                  }}
                  onMouseLeave={() => setHoveredId((current) => (current === member.id ? null : current))}
                  onFocus={stopHint}
                  onClick={() => {
                    stopHint();
                    toggleFocus(member.id);
                  }}
                >
                  <div
                    className={`duotone duotone-fade cluster-portrait relative aspect-square w-full overflow-hidden rounded-md border-2 border-void transition-[filter] duration-300 ${
                      hovered || focused || previewed ? 'is-revealed' : ''
                    }`}
                    style={{
                      filter: dimmed ? 'blur(4px)' : !focused && !hovered ? `saturate(${1 - slot.depth * 0.5})` : undefined,
                      opacity: dimmed ? 0.5 : 1,
                    }}
                  >
                    <Image
                      src={member.portrait.src}
                      alt=""
                      fill
                      priority
                      sizes={focused ? '22rem' : `${slot.w}vw`}
                      className="object-cover"
                    />
                  </div>
                  <span className="cluster-portrait__tag pointer-events-none absolute bottom-0 start-0 translate-y-1/2 bg-void px-[var(--spacing-2xs)] font-mono text-[length:var(--step--2)] text-ink-3">
                    {pick(member.name, locale)}
                  </span>
                </button>
              </div>
            </div>
          );
        })}

        {/* §2.5 — the focus-mode detail panel, sliding in from the side
            opposite the focused portrait's stage position (inline-end,
            since the stage sits at inline-start). Real TeamMember content
            only: role, name, the one-sentence contribution. */}
        <AnimatePresence>
          {focusedMember ? (
            <m.div
              key={focusedMember.id}
              role="group"
              id={`${baseId}-panel-${focusedMember.id}`}
              className="cluster-panel absolute z-30 flex flex-col gap-[var(--spacing-xs)] border border-border bg-void p-[var(--spacing-m)]"
              style={{ insetInlineEnd: '6%', top: '18%', insetBlockEnd: '18%', inlineSize: 'min(36%, 22rem)' }}
              initial={{ opacity: 0, x: dir === 'rtl' ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? -24 : 24 }}
              transition={springSnappy}
            >
              <TitleBlock cells={[{ label: pick(focusedMember.role, locale), value: pick(focusedMember.name, locale) }]} />
              <p className="text-ink-2">{pick(focusedMember.contribution, locale)}</p>
              <button
                type="button"
                className="mt-auto self-start font-mono text-[length:var(--step--1)] text-ink-3 hover:text-ink"
                onClick={() => setFocusedId(null)}
              >
                {tAbout('closeFocus')}
              </button>
            </m.div>
          ) : null}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
