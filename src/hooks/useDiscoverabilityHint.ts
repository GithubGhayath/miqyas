'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared discoverability pattern — first built for RailSelect
 * (FIX-AND-POLISH-V2 §4.2: "nothing currently signals to a first-time
 * visitor that X is interactive"), reused here rather than invented a
 * second time for the Team Cluster and the Work Film Reel, which turned
 * out to have the exact same problem once real people looked at them.
 *
 * Two mechanisms, both here so fixing them once fixes every consumer:
 *  - `previewIndex` cycles through `itemCount` items on a timer, so the
 *    interface visibly "shows itself off" until proven found — the same
 *    role RailSelect's autoplay plays.
 *  - A one-time-per-session coach-mark, gated on `sessionKey` +
 *    `sessionStorage`, shown once the trigger element scrolls into view.
 *
 * Both stop permanently the moment the consumer calls `stop()` — call it
 * from every real interaction (hover, click, focus, touch), exactly like
 * RailSelect's own `stopAutoplay`.
 */
export function useDiscoverabilityHint({
  sessionKey,
  itemCount,
  disabled = false,
  cycleMs = 3200,
}: {
  sessionKey: string;
  itemCount: number;
  /** Pass the caller's own reduced-motion flag — most consumers already
   *  compute this for their own reduced-motion branch, so this hook
   *  doesn't re-derive it a second time. */
  disabled?: boolean;
  cycleMs?: number;
}) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(true);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showCoachMark, setShowCoachMark] = useState(false);

  useEffect(() => {
    if (disabled || !active || itemCount === 0) return;
    const id = setInterval(() => {
      setPreviewIndex((current) => (current === null ? 0 : (current + 1) % itemCount));
    }, cycleMs);
    return () => clearInterval(id);
  }, [disabled, active, itemCount, cycleMs]);

  useEffect(() => {
    if (disabled) return;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(sessionKey) === '1';
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return;
    const el = triggerRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setShowCoachMark(true);
        try {
          sessionStorage.setItem(sessionKey, '1');
        } catch {
          /* private browsing — coach-mark may repeat next load, harmless */
        }
      },
    });
    return () => trigger.kill();
  }, [disabled, sessionKey]);

  useEffect(() => {
    if (!showCoachMark) return;
    const timeout = setTimeout(() => setShowCoachMark(false), 4000);
    return () => clearTimeout(timeout);
  }, [showCoachMark]);

  function stop() {
    setActive(false);
    setPreviewIndex(null);
    setShowCoachMark(false);
  }

  return { triggerRef, previewIndex, showCoachMark, stop };
}
