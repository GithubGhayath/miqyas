'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(ScrollTrigger);

/**
 * UI-OVERHAUL-V4 §5.6/§8 — a repeated-row reveal (the equipment register
 * table) uses a single ScrollTrigger.batch() rather than one instance per
 * row.
 */
export function BatchRevealRows({ children }: { children: ReactNode }) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (respectsReducedMotion()) return;
    // Deferred one frame — see the identical comment in CameraMoveSections
    // for why: mutating styles in the same tick this effect first fires can
    // race Next's dev-mode hydration-mismatch check on a fresh page load.
    let batch: ScrollTrigger[] = [];
    const raf = requestAnimationFrame(() => {
      const tbody = bodyRef.current;
      if (!tbody) return;
      const rows = Array.from(tbody.children) as HTMLElement[];
      if (rows.length === 0) return;
      gsap.set(rows, { opacity: 0, y: 12 });
      batch = ScrollTrigger.batch(rows, {
        start: 'top 90%',
        once: true,
        onEnter: (targets) =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }),
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      batch.forEach((trigger) => trigger.kill());
    };
  }, []);

  return <tbody ref={bodyRef}>{children}</tbody>;
}
