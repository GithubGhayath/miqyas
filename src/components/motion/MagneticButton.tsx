'use client';

import { useRef, useState, type ReactNode } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { springSnappy } from '@/lib/motion';

/**
 * Magnetic pull on the primary CTA — UI-REFACTOR-PROMPT §3.4. Desktop,
 * pointer:fine only. Use on at most one button per page: if every button
 * pulls toward the cursor, none of them reads as "the important one."
 */
export function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const radius = Math.max(rect.width, rect.height) / 2 + 24;
    if (dist < radius && dist > 0) {
      const pull = Math.min(6, 6 * (1 - dist / radius));
      setOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={springSnappy}
      className="inline-block"
    >
      {children}
    </m.div>
  );
}
