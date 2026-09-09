// Spring presets — UI-REFACTOR-PROMPT §3.3.
// Tight damping (28–32) across all three on purpose: a loose, bouncy spring
// reads as playful/consumer-app, a tight, quickly-settling one reads as a
// well-machined mechanism finding its stop. That distinction is the
// engineering character this brand needs from its motion, not just its type.
export const springSnappy = { type: 'spring', stiffness: 420, damping: 32, mass: 0.9 } as const; // hover, press, toggles
export const springSettled = { type: 'spring', stiffness: 260, damping: 30, mass: 1 } as const; // panels, drawers, accordion
export const springDrag = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const; // before/after handle release
