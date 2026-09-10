'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from '@/i18n/navigation';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(ScrollTrigger);

/**
 * UI-OVERHAUL-V4 §5.4 — section-to-section "camera moves". As the next
 * top-level <section> inside #main approaches, the outgoing one scales down
 * and fades while the incoming one rises and resolves to full opacity,
 * scrubbed directly to scroll position rather than firing once. Mounted
 * once near the document root; re-scans on every route change since each
 * page has different sections in the DOM.
 *
 * Dims via `opacity`, not `filter: brightness()` (an earlier version of
 * this effect used brightness): brightness scales every RGB channel toward
 * zero, so on the dark theme's already-near-black background it darkens
 * light text almost as much as the dark background, collapsing the very
 * contrast that makes the section readable while it's mid-transition.
 * Opacity blends the whole section toward the page's actual background
 * colour instead, which reads correctly in both themes.
 *
 * The transition resolves over a short band right at the seam (`top
 * bottom` → `top 60%`), not a full viewport height (`top bottom` → `top
 * top`, the original span): a long section's own top edge — its heading,
 * its opening line — stays inside the viewport for most of that full-height
 * scroll, so a full-height fade-in left it visibly ramping from faint to
 * legible while it was already being read. Confining the fade to the first
 * ~40% of the section's entrance keeps it fully readable well before the
 * reader's eye gets there, on every page regardless of section length.
 */
export function CameraMoveSections() {
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (respectsReducedMotion()) return;

    // Deferred one frame: mutating section styles in the same tick this
    // effect first fires can race React/Next's dev-mode hydration-mismatch
    // check on a fresh page load (it validates the server HTML shortly
    // after commit, not strictly before every effect has run), which then
    // misreports these later, legitimate, GSAP-driven style writes as a
    // hydration mismatch. Waiting a frame keeps the mutation itself
    // unchanged and pushes it safely past that check.
    const raf = requestAnimationFrame(() => {
      const main = document.getElementById('main');
      if (!main) return;
      const sections = Array.from(main.querySelectorAll<HTMLElement>('section'));
      if (sections.length < 2) return;

      const triggers = sections.slice(1).map((nextSection, index) => {
        const prevSection = sections[index];
        prevSection.style.willChange = 'transform, opacity';
        nextSection.style.willChange = 'transform, opacity';
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: nextSection,
            start: 'top bottom',
            end: 'top 60%',
            scrub: 0.6,
          },
        });
        timeline
          .to(prevSection, { scale: 0.9, opacity: 0.35, ease: 'none' }, 0)
          .from(nextSection, { yPercent: 14, opacity: 0.15, ease: 'none' }, 0);
        return timeline.scrollTrigger;
      });

      cleanupRef.current = () => {
        triggers.forEach((trigger) => trigger?.kill());
        sections.forEach((section) => {
          gsap.set(section, { clearProps: 'scale,opacity,transform' });
          section.style.willChange = '';
        });
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [pathname]);

  return null;
}
