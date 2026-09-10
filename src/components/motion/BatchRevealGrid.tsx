'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(ScrollTrigger);

/**
 * Generic sibling of `BatchRevealRows` for a plain grid/list of direct
 * children (rather than table rows) — a single `ScrollTrigger.batch()`
 * staggers each child in as it scrolls into view, instead of one
 * ScrollTrigger per item (UI-OVERHAUL-V4 §5.6).
 */
export function BatchRevealGrid({
  children,
  className,
  rise = 24,
}: {
  children: ReactNode;
  className?: string;
  rise?: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (respectsReducedMotion()) return;
    // Deferred one frame — see the identical comment in CameraMoveSections
    // for why: mutating styles in the same tick this effect first fires can
    // race Next's dev-mode hydration-mismatch check on a fresh page load.
    let batch: ScrollTrigger[] = [];
    const raf = requestAnimationFrame(() => {
      const grid = gridRef.current;
      if (!grid) return;
      const items = Array.from(grid.children) as HTMLElement[];
      if (items.length === 0) return;
      gsap.set(items, { opacity: 0, y: rise });
      batch = ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (targets) =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }),
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      batch.forEach((trigger) => trigger.kill());
    };
  }, [rise]);

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  );
}
