'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import type { CaseStudy, Locale } from '@/content/types';
import { useDirection } from '@/hooks/useDirection';
import { respectsReducedMotion } from '@/lib/ignition';
import { spikeInstrumentTrace } from '@/lib/instrumentTrace';
import { WorkFilmTile } from '@/components/work/WorkFilmTile';
import { CoachMark } from '@/components/ui/CoachMark';
import { useDiscoverabilityHint } from '@/hooks/useDiscoverabilityHint';

gsap.registerPlugin(Draggable, InertiaPlugin);

/**
 * "Drag Film Reel" — full replacement of the scroll-linked pinned conveyor
 * (creative-layout-replacement §3). The visitor's own hand/finger drives
 * exploration — a real gsap Draggable + InertiaPlugin drag with momentum,
 * not scroll position. One component for every viewport: native touch drag
 * already works through Draggable on mobile, so there's no separate
 * vertical-stack fallback to maintain (§3.5).
 *
 * Masonry rhythm: the first case study is noticeably larger (sizing lives
 * in WorkFilmTile) and every tile gets a small alternating vertical
 * offset, so the row reads as a considered arrangement rather than
 * identical tiles in an identical line.
 */
export function WorkFilmReel({ caseStudies, locale }: { caseStudies: CaseStudy[]; locale: Locale }) {
  const { dir } = useDirection();
  const tWork = useTranslations('work');
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const closestIdRef = useRef<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(respectsReducedMotion());
  }, []);

  const verticalOffsets = useMemo(
    () => caseStudies.map((_, i) => (i % 3 === 0 ? 0 : i % 3 === 1 ? 22 : -14)),
    [caseStudies],
  );

  // Nothing signalled a cover was clickable (reported directly: "the user
  // will not notice he should click on a project image"). Same fix as the
  // Team Cluster's identical problem, reused rather than reinvented: an
  // auto-cycling colour preview plus a one-time coach-mark (which also
  // covers the drag interaction in its caption, since that's the other
  // thing nothing here signals), both stopped permanently by the first
  // real drag/click/keyboard use.
  const { triggerRef: hintRef, previewIndex, showCoachMark, stop: stopHint } = useDiscoverabilityHint({
    sessionKey: 'miqyas:reel-hint-seen',
    itemCount: caseStudies.length,
    disabled: reduceMotion,
  });

  function computeBounds() {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return { minX: 0, maxX: 0 };
    const max = Math.max(0, track.scrollWidth - container.clientWidth);
    return dir === 'rtl' ? { minX: 0, maxX: max } : { minX: -max, maxX: 0 };
  }

  function findClosestId(): string | null {
    const container = containerRef.current;
    if (!container) return null;
    const tiles = Array.from(container.querySelectorAll<HTMLElement>('[data-tile-id]'));
    const center = window.innerWidth / 2;
    let closest: string | null = null;
    let closestDist = Infinity;
    for (const tile of tiles) {
      const rect = tile.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = tile.dataset.tileId ?? null;
      }
    }
    return closest;
  }

  function handleSettle() {
    const closest = findClosestId();
    if (closest && closest !== closestIdRef.current) {
      closestIdRef.current = closest;
      spikeInstrumentTrace(1);
    }
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const [instance] = Draggable.create(track, {
      type: 'x',
      inertia: !reduceMotion,
      bounds: computeBounds(),
      edgeResistance: 0.65,
      dragClickables: true, // grabbing directly on a tile still starts a drag
      allowNativeTouchScrolling: false,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress: stopHint,
      onDragEnd: reduceMotion ? handleSettle : undefined,
      onThrowComplete: !reduceMotion ? handleSettle : undefined,
    });
    draggableRef.current = instance;
    closestIdRef.current = findClosestId();

    function onResize() {
      instance.applyBounds(computeBounds());
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      instance.kill();
      draggableRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, caseStudies.length, reduceMotion]);

  // Expanding a tile changes the track's total width, so the drag bounds
  // (computed from track.scrollWidth) need to be recalculated — otherwise
  // the reel could be dragged past its real end, or refuse to reach a
  // newly-revealed edge.
  useEffect(() => {
    draggableRef.current?.applyBounds(computeBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedId]);

  function moveByOne(delta: number) {
    const track = trackRef.current;
    const container = containerRef.current;
    const draggable = draggableRef.current;
    if (!track || !container || !draggable) return;
    const tiles = Array.from(track.querySelectorAll<HTMLElement>('[data-tile-id]'));
    const step = (tiles[0]?.getBoundingClientRect().width ?? 300) + 24;
    const forward = dir === 'rtl' ? -delta : delta;
    const bounds = computeBounds();
    const nextX = gsap.utils.clamp(bounds.minX, bounds.maxX, draggable.x - forward * step);
    gsap.to(track, {
      x: nextX,
      duration: reduceMotion ? 0 : 0.5,
      ease: 'power2.out',
      onUpdate: () => draggable.update(),
      onComplete: handleSettle,
    });
  }

  function onTrackKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stopHint();
      moveByOne(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stopHint();
      moveByOne(-1);
    }
  }

  return (
    <div
      className="film-reel relative"
      ref={(el) => {
        hintRef.current = el;
      }}
    >
      {/* §3.6 — the track is also operable without a pointer: visible
          prev/next controls move by one tile, and the track itself
          accepts arrow keys while focused. */}
      {/* Glyphs point in the direction each button actually navigates, not
          a fixed left/right — in rtl "previous" is toward the physical
          right, so the chevrons swap rather than just the button order. */}
      <div className="frame mb-[var(--spacing-s)] flex items-center justify-between gap-[var(--spacing-2xs)]">
        {showCoachMark ? <CoachMark caption={tWork('reelCoachMark')} /> : <span />}
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          <button
            type="button"
            aria-label={tWork('reelPrev')}
            className="film-reel__nav"
            onClick={() => {
              stopHint();
              moveByOne(-1);
            }}
          >
            {dir === 'rtl' ? '›' : '‹'}
          </button>
          <button
            type="button"
            aria-label={tWork('reelNext')}
            className="film-reel__nav"
            onClick={() => {
              stopHint();
              moveByOne(1);
            }}
          >
            {dir === 'rtl' ? '‹' : '›'}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="film-reel__viewport bleed overflow-hidden"
        tabIndex={0}
        role="group"
        aria-label={tWork('title')}
        onKeyDown={onTrackKeyDown}
        onFocus={stopHint}
        onClick={(event) => {
          if (event.target === containerRef.current) setExpandedId(null);
        }}
      >
        <div ref={trackRef} className="film-reel__track flex w-max items-center gap-[var(--spacing-l)] px-[var(--spacing-page-pad)] py-[var(--spacing-l)]">
          {caseStudies.map((caseStudy, index) => (
            <WorkFilmTile
              key={caseStudy.id}
              caseStudy={caseStudy}
              locale={locale}
              featured={index === 0}
              expanded={expandedId === caseStudy.id}
              previewed={!expandedId && previewIndex === index}
              verticalOffset={verticalOffsets[index] ?? 0}
              onToggle={() => {
                stopHint();
                setExpandedId((current) => (current === caseStudy.id ? null : caseStudy.id));
                spikeInstrumentTrace(1);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
