'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale } from 'next-intl';
import { respectsReducedMotion } from '@/lib/ignition';

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * Kinetic heading reveal — UI-OVERHAUL-V4 §5.3. Splits into characters (or,
 * for Arabic, words only — character-level splitting breaks letter joining)
 * and stagger-reveals once on scroll entry. Stagger stays under 25ms/char
 * and total duration under ~900ms even for a long heading.
 */
export function KineticHeading({
  as: Tag = 'h2',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const el = ref.current;
    if (!el || respectsReducedMotion()) return;

    const isArabic = locale === 'ar';
    const split = SplitText.create(el, { type: isArabic ? 'words' : 'chars, words' });
    const targets = isArabic ? split.words : split.chars;
    const stagger = Math.min(0.025, 0.9 / Math.max(targets.length, 1));

    const tween = gsap.from(targets, {
      yPercent: 110,
      opacity: 0,
      stagger,
      duration: 0.7,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [locale, children]);

  const Component = Tag as ElementType;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
