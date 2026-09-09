'use client';

import { ViewTransitions } from 'next-view-transitions';
import type { ReactNode } from 'react';

// Wraps the app so `useTransitionRouter` (src/hooks/useTransitionLink.ts) can
// drive real browser View Transitions on navigation. React's own experimental
// `<ViewTransition>` component (UI-REFACTOR-PROMPT §3.1) isn't available on
// the stable React release this project is pinned to — see DECISIONS.md —
// so route-level transitions go through this package instead, which wraps
// the same underlying `document.startViewTransition` browser API.
export function ViewTransitionsProvider({ children }: { children: ReactNode }) {
  return <ViewTransitions>{children}</ViewTransitions>;
}
