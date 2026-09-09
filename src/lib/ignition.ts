// The site's signature "something switching on" motion beat —
// UI-OVERHAUL-V4 §5.5. Reused literally everywhere an ignition moment
// occurs: section header ignition, CTA hover, the case-study after-reveal,
// and the splash screen's completion flash. Do not re-author variants.
export const IGNITION_DURATION = 0.2;
export const IGNITION_EASE = 'power2.out';

/** Central gate for every GSAP/ScrollTrigger/SplitText animation on the
 *  site — UI-OVERHAUL-V4 §5.6. Call once per effect setup, not per frame. */
export function respectsReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
