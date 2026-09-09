'use client';

import { useTransitionRouter } from 'next-view-transitions';
import { useLocale } from 'next-intl';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type RouteTransitionClass = 'nav-forward' | 'nav-back' | 'case-reveal';

const TRANSITION_CLASSES: RouteTransitionClass[] = ['nav-forward', 'nav-back', 'case-reveal'];

/**
 * A locale-aware Link that drives a specific named View Transition (see the
 * `::view-transition-*` rules in globals.css) instead of the browser's
 * default cross-fade. UI-REFACTOR-PROMPT §3.1(b)/(d).
 */
export function TransitionLink({
  href,
  transition,
  children,
  className,
  onClick,
  ...rest
}: {
  href: string;
  transition: RouteTransitionClass;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const locale = useLocale();
  const router = useTransitionRouter();
  const localizedHref = `/${locale}${href}`;

  return (
    <a
      href={localizedHref}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove(...TRANSITION_CLASSES);
          document.documentElement.classList.add(transition);
        }
        router.push(localizedHref);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
