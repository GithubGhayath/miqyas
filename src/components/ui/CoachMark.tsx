'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

/**
 * The one-time coach-mark visual — the exact hand-drawn arrow already used
 * by RailSelect (FIX-AND-POLISH-V2 §4.2), extracted so the Team Cluster and
 * the Work Film Reel can reuse it instead of each carrying their own copy.
 * Purely presentational: `useDiscoverabilityHint` owns the session-gating
 * and the show/hide timing, this just draws itself in whenever mounted.
 */
export function CoachMark({ caption, className = '' }: { caption: string; className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (path) gsap.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.out' });
  }, []);

  return (
    <div className={`coach-mark pointer-events-none flex items-center gap-[var(--spacing-2xs)] ${className}`} aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path ref={pathRef} d="M20 4 C14 4 6 8 4 20" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
      <span className="font-mono text-[length:var(--step--1)] text-signal-text">{caption}</span>
    </div>
  );
}
