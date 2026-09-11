'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from '@/i18n/navigation';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section "focus fade" — every top-level <section> inside #main is
 * brightest and at full scale exactly when the viewport's own centre falls
 * within it, and fades/scales down the further that centre point is from
 * the section (in either direction: approaching from below, leaving off
 * the top). This replaced an earlier pairwise "outgoing dims / incoming
 * rises" version keyed to scroll position between consecutive sections —
 * that version used a fixed fraction of a viewport-height as its whole
 * transition band, which reads fine for sections roughly that tall but
 * left a *short* section's content visibly mid-fade while it was already
 * sitting in a normal reading position (reported directly: "the problem,
 * stated plainly" section on the home page). Measuring distance to the
 * viewport's actual centre — not a fixed scroll offset from a neighbour —
 * scales correctly for a section of any height: a section far taller than
 * the viewport reads at full brightness for the entire time the centre
 * point is anywhere inside it (distance 0), not just at one instant: a
 * short section only reaches full brightness right as it's centred, which
 * is also the moment a reader's eye naturally lands on it.
 *
 * Dims via `opacity`, not `filter: brightness()`: brightness scales every
 * RGB channel toward zero, so on the dark theme's already-near-black
 * background it darkens light text almost as much as the dark background,
 * collapsing the very contrast that makes a section readable while it's
 * fading. Opacity blends toward the page's actual background colour
 * instead, which reads correctly in both themes.
 */
export function CameraMoveSections() {
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (respectsReducedMotion()) return;
    let cancelled = false;

    function setup() {
      if (cancelled) return;
      const main = document.getElementById('main');
      if (!main) return;
      const sections = Array.from(main.querySelectorAll<HTMLElement>('section'));
      if (sections.length < 2) return;

      function focus(section: HTMLElement) {
        const rect = section.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const centre = viewportH / 2;
        let distance: number;
        if (centre >= rect.top && centre <= rect.bottom) {
          distance = 0;
        } else if (centre < rect.top) {
          distance = rect.top - centre;
        } else {
          distance = centre - rect.bottom;
        }
        const proximity = 1 - Math.min(1, distance / centre);
        gsap.set(section, { opacity: 0.35 + 0.65 * proximity, scale: 0.9 + 0.1 * proximity });
      }

      sections.forEach((section) => {
        section.style.willChange = 'transform, opacity';
      });

      const triggers = sections.map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: () => focus(section),
          onRefresh: () => focus(section),
        }),
      );

      cleanupRef.current = () => {
        triggers.forEach((trigger) => trigger.kill());
        sections.forEach((section) => {
          gsap.set(section, { clearProps: 'opacity,scale,transform' });
          section.style.willChange = '';
        });
      };
    }

    // Waiting for the window `load` event (all resources fetched, every
    // Suspense boundary settled), not just one requestAnimationFrame:
    // mutating these sections' styles too early can race Next's own
    // per-boundary hydration reveal for this page's content — which lives
    // in a *different* subtree than this component (a sibling under the
    // root layout, not a descendant of #main) and can hydrate on its own,
    // separate timeline. A single deferred frame isn't reliably late
    // enough to guarantee that reveal has already happened; `load` is.
    if (document.readyState === 'complete') {
      requestAnimationFrame(setup);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(setup), { once: true });
    }

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [pathname]);

  return null;
}
