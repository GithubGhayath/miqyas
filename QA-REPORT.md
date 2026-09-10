# QA-REPORT.md

This is the first time this file has actually been produced (README.md §17 called for it at the end of the
original build; UI-REFACTOR-PROMPT §7 and UI-OVERHAUL-V4 §11 both said to rewrite/extend it — in practice it
was never written until this pass). It covers all three specs' QA sections against the codebase as it
stands after the completed UI-OVERHAUL-V4 pass, and is honest about what was verified how, per this
project's own repeated instruction not to mark something "pass" to close the checklist out.

**A note on method, read before the checklists below.** This session's browser-automation tool
intermittently reports its pane as hidden/minimized (`tabs_context` prints "The Browser pane is currently
hidden"; screenshots time out with "Claude's window is minimized or hidden"; `window.innerWidth` reads `0`).
While in that state, screenshots cannot be trusted and `requestAnimationFrame`-driven animations (GSAP
tweens) freeze mid-flight (see DECISIONS.md #28) even though the underlying code and DOM state are correct.
Per README.md §17.3's own instruction — "if your environment cannot take screenshots, say so explicitly and
perform and document the interaction and code-level checks in full instead" — that is what was done here:
every item below states whether it was confirmed by a live screenshot, by DOM/computed-style inspection, or
by code review, rather than being marked "pass" uniformly.

---

## Part 1 — UI-OVERHAUL-V4 §11 (this pass, verified in most depth)

- [x] **Freeze test (§1).** Not confirmed by a live reduced-motion screenshot this session (see method
  note). Confirmed by code review instead: every GSAP/ScrollTrigger/SplitText/Flip/Lenis-touching component
  in `src/components` (`CameraMoveSections`, `SurveyHero`, `WorkIndexRow`, `SpotlightMember`,
  `ConditionScale`, `BatchRevealRows`, `KineticHeading`, `SmoothScroll`, `SplashScreen` — 9 files, grepped
  exhaustively) gates on `respectsReducedMotion()`/`useReducedMotion()` before doing anything time-based.
  With motion off, the home hero renders as: a static annotated photograph, four pins with fully-drawn
  (not animated) connector lines, headline and facts fully visible with no stagger. This is a legible,
  deliberate layout on its own — the oversized display type, the `.frame`-vs-full-bleed contrast, and the
  survey-pin device all read as intentional without any motion. Not re-verified with an actual forced
  `prefers-reduced-motion: reduce` + screenshot this session; recommend doing so before shipping.

- [ ] **Throttle test (§5.6).** **Not measured.** This session's tooling does not expose CPU/network
  throttling controls, and the intermittent hidden-pane state (above) makes frame-timing measurements
  unreliable even if it did. This is a real gap, not a "pass" — a manual DevTools pass (CPU 4×, Fast 3G, on
  Home including the splash and one Work detail page, recording actual fps) still needs to happen before
  this is signed off.

- [x] **Splash — real progress, not a clock.** Confirmed by code read of `SplashScreen.tsx`: progress comes
  from `trackCriticalAssets()` resolving against `document.fonts.ready` and `img[data-critical="true"]`
  elements, raced against a hard `MAX_TIMEOUT_MS` — not a fixed-duration tween. Not re-confirmed by an actual
  Slow-3G-throttled run this session (no throttle control available, see above); the code path that would
  make this true is in place and was exercised (untethered) on an earlier pass this session with a
  successful, correctly-sequenced load.

- [x] **Splash — guardrails.** Confirmed by code read: `MIN_DISPLAY_MS = 900` is enforced via
  `setTimeout(complete, Math.max(0, 900 - elapsed))`, independent of how fast assets actually resolved, so a
  fully cached load still holds the floor. `MAX_TIMEOUT_MS = 4500` is enforced via
  `Promise.race([trackCriticalAssets(bump), timeout])`, so a blocked asset can't hang the splash past 4.5s.
  Not exercised with an artificially-blocked DevTools request this session.

- [x] **Splash — session behaviour.** Confirmed by code read and one live check: `sessionStorage` gates
  `shouldRender` on mount (`SESSION_KEY = 'miqyas:first-light-played'`, set inside `complete()`). Because
  `SplashScreen` is mounted in `[locale]/layout.tsx`, an internal client-side navigation to another route
  under the same locale doesn't even remount the component (App Router layout persistence), so the splash
  correctly never replays on internal nav within a tab regardless; a fresh tab or hard refresh gets a clean
  `sessionStorage` and replays it. Confirmed live: navigating to the same URL in a fresh browser tab replayed
  the splash; a second `sessionStorage` check in the same tab after completion returned `'1'`.

- [x] **Splash — reduced motion.** Confirmed by code read: under `reduceMotion`, `setDisplayPercent` sets
  `percent` directly with no `gsap.to` tween; `aperturePct` is a constant `100` (fully resolved, no widening
  animation); the wordmark swap-in has no `SplitText` reveal in either mode (see the honest note directly
  below); the percentage readout is the same plain-text `<Measure>` element in both modes. This satisfies
  "static wordmark, plain-text percentage, no aperture/DrawSVG/SplitText motion" — though see the note that
  the wordmark's *lack* of a SplitText reveal in the motion-on case is a scope simplification from an
  earlier pass, not a deliberate reduced-motion design choice (recorded in the resumed-checkpoint history).

- [x] **Splash — screen reader.** Confirmed by code read: the container is `role="status" aria-live="polite"`;
  a separate visually-hidden `aria-live="polite"` span announces `t('announce', {percent})` only at
  `roundToStep(percent)` boundaries (steps of 20 — so 0/20/40/60/80/100, not every frame); `#main` gets
  `inert` set on mount and removed in `complete()`, confirmed by reading the attribute directly rather than
  by any visual check.

- [x] **Splash — shared constant.** `IGNITION_DURATION` is imported from `src/lib/ignition.ts` and used
  directly in the completion-flash delay math. **A real gap was found and fixed here**: the two *CSS-only*
  ignition moments (the splash's stroke/aperture transitions, and separately the primary CTA's hover) had
  drifted to hardcoded `200ms ease` / `120ms` instead of literally sharing the constant, because a plain
  inline `style.transition` string and a Tailwind class can't import a JS module. Fixed by adding
  `--duration-ignition: 200ms` and `--ease-ignition: cubic-bezier(0.25, 0.46, 0.45, 0.94)` (the CSS
  `easeOutQuad` curve, the standard equivalent of GSAP's `power2.out`, which CSS has no keyword for) to
  `globals.css`, and pointing both CSS-only spots at them — see DECISIONS.md #26.

- [ ] **Transition audit** (every adjacent section-pair boundary, every page). **Partially verified.**
  Confirmed via DOM/computed-style inspection (not screenshot, per the method note) that the camera-move
  timeline correctly reaches its scaled/dimmed and risen/brightened end states on the home page across two
  consecutive section boundaries. Not walked page-by-page for every boundary on every route this session —
  a genuine remaining task, though the mechanism (`CameraMoveSections`) is applied uniformly by scanning
  every `<section>` inside `#main` on every route, so it is structurally present everywhere, not just where
  spot-checked.

- [ ] **No page more than ~a third `.frame`-only.** **A real, sizeable gap was found.** Six of nine routes
  (Services, Method, Contact, Notes index, Notes detail, Work detail) were **entirely** wrapped in one
  `PageShell` — 100% frame content, not just over the one-third threshold. Two of those (Work detail, Notes
  detail) had an existing cover image that could be promoted to a genuine `.bleed` moment without inventing
  content, and were fixed this pass (see DECISIONS.md #27). **Services, Method, and Contact were
  deliberately left unfixed** — manufacturing a full-bleed image or stat band on those pages purely to pass
  this checklist item would be decoration added for its own sake, which both the original README.md and
  every subsequent overhaul explicitly argue against. This is an honest, open gap for a future pass, not a
  false "pass."

- [x] **Team keyboard traversal.** Confirmed by code read of `SpotlightMember.tsx`: each member has an
  invisible, full-cover `<button>` with `onFocus={() => setLit(true)}`, which sets `maskImage: 'none'` —
  fully removing the spotlight mask and fully lighting the portrait on keyboard focus alone, no pointer
  needed. The name/role/contribution text block sits in a separate `z-10` layer outside the mask entirely,
  so it's always visible regardless of `lit` state — tabbing to a member's button lights the portrait; the
  text was legible the whole time. Not re-confirmed with a live Tab-key walkthrough + screenshot this
  session (see method note); the code guarantees this independent of a visual check.

- [x] **Grade-chip numeral colour.** **A real, previously-undetected defect was found and fixed here** — see
  DECISIONS.md #26. `GradeChip.tsx` was still reading five now-deleted per-grade `--color-grade-N-ink`
  custom properties from an earlier (UI-REFACTOR-PROMPT-era) contrast lookup; UI-OVERHAUL-V4 §3.3 replaced
  that with one uniform `--color-grade-chip-text` token but the component was never updated, so every grade
  numeral was resolving an undefined CSS variable. Fixed and confirmed via `getComputedStyle` on live grade
  chips (grades 2 and 3, both themes): `rgb(10, 12, 15)` (`#0A0C0F`) in dark theme, `rgb(255, 255, 255)` in
  light theme — matching §3.3's rule exactly, with no per-grade exception.

- [x] **Every heading's SplitText reveal fires once, on first scroll entry — Services, Method, Work, Notes,
  About, Contact.** Confirmed structurally: `KineticHeading` (the `SplitText` wrapper, `scrollTrigger:
  {trigger: el, start: 'top 80%', once: true}`) is imported and used in all nine `app/[locale]/**/page.tsx`
  route files, confirmed by grep. Not re-confirmed by watching each one fire live this session.

- [x] **Reduced motion, site-wide.** Confirmed by the same exhaustive grep as the freeze test above: every
  file that imports `gsap`/`ScrollTrigger`/`SplitText`/`Flip`/`Lenis`/`quickTo` (9 files) also imports and
  checks `respectsReducedMotion()` or `useReducedMotion()`. `SmoothScroll.tsx` specifically never constructs
  a `Lenis` instance at all when reduced motion is on (`if (matches) return;` before `new Lenis(...)`), so
  native scroll applies untouched rather than merely disabling the smoothing after the fact.

- [x] **Copy changelog exists and is non-empty, both locales, real before/after pairs.** `COPY-AUDIT.md`
  exists, covers a first-pass rubric audit (one real fix, in both locales, with reasoning) and a second
  UI-OVERHAUL-V4 §10 voice-recalibration pass (three strings, both locales, full before/after/why table),
  plus an explicit "checked and left unchanged" list — not a note claiming the pass happened.

- [ ] **§3.3 contrast pairs re-checked against actual rendered pixels with overlay/duotone/blend effects
  active.** **Partially verified.** The grade-chip fix above was confirmed against real rendered pixels via
  `getComputedStyle`, which is the highest-stakes case (a fixed-token contrast rule with "no exceptions").
  Caption text over duotone/blend-mode photography (e.g. the before/after slider's "Before"/"After" labels)
  sits on an opaque `bg-ink/70` box rather than directly on blended pixels, so it isn't exposed to the same
  risk — reasoned through rather than pixel-sampled this session. A full pixel-sampling pass across every
  overlay/spotlight/duotone combination was not performed.

## Part 2 — README.md §17 (original build, largely covered by decisions logged earlier in DECISIONS.md)

This section was never written as its own pass at the time (decisions #1–11 cover the original build, but
no `QA-REPORT.md` was produced then). Re-verifying all four `{ar,en} × {light,dark}` combinations at 1440px
plus four pages at 375px, fresh, was out of scope for this session given the throttle-test gap above and the
hidden-pane limitation — the summary below is a code-level and cumulative-evidence check, not a fresh
screenshot inventory, and should be treated as a lighter-confidence pass than Part 1.

- **Direction (RTL):** confirmed by code review — every directional value in the codebase (`useDirection()`'s
  `dir`/`sign`, `insetInlineStart`/`ms-`/`me-`/`ps-`/`pe-` logical properties throughout, the before/after
  slider's `sign`-flipped drag math, the hero's DrawSVG connectors' RTL coordinate flip added this pass) is
  written with logical properties or an explicit direction check, not hardcoded physical left/right. Live
  confirmed this pass for the hero connectors specifically (screenshotted in both `en` and `ar`, correct in
  both). Not re-screenshotted page-by-page this session.
- **Type (Arabic display/body fonts, diacritic clipping, line length):** unchanged since the original build;
  not re-audited this session. `--font-mono` usage is unchanged (measured values only, per `Measure.tsx`).
- **Colour and theme:** dark is the default/only-until-toggled theme per `ThemeProvider` config; confirmed
  no flash-of-wrong-theme code path was touched this session. Grade-chip greyscale distinguishability relies
  on the 5-segment bar (`.grade-chip__bar`), unchanged and unaffected by the numeral-colour fix above.
- **Layout (no horizontal scroll at 360–1920):** not re-checked this session; the two full-bleed
  restructures added this pass (`.bleed` divs on Work detail and Notes detail) use `width: 100%` of an
  already-unconstrained parent, the same mechanism already proven not to cause overflow on the Work index
  and About pages.
- **Interaction (keyboard, forms, print):** not re-walked this session beyond the Spotlight Roster
  (confirmed above) and the condition-scale Flip highlight (confirmed via `Flip.getState()`/transform-delta
  math, see DECISIONS.md #23) — both newly-touched components. Contact form, mobile nav, accordion, and
  print preview are unchanged since earlier passes and were not re-tested here.
- **Character audit (banned patterns, five engineering devices):** unchanged since the original build's
  audit; not re-read against §8.4's list this session.

## Part 3 — UI-REFACTOR-PROMPT §7

`UI-REFACTOR-PROMPT.md` is no longer present in the working directory to re-read verbatim (it was supplied
inline in an earlier turn and, unlike the other two specs, was never saved to disk). Its checks are covered
here via what's already recorded in DECISIONS.md #12–20 from when that pass was originally done, plus this
session's re-verification of the two things UI-OVERHAUL-V4 explicitly asked to re-check against it
(magnetic CTA and hero tilt, DECISIONS.md #24). Nothing from that pass was found broken this session.

---

## Honest summary

**Fixed this pass, confirmed correct:**
1. Grade-chip numeral colour (`GradeChip.tsx`) — was silently broken (undefined CSS variable) since the
   §3.3 palette rewrite; now uses the uniform token and matches the spec's rule exactly in both themes.
2. Ignition duration/ease drift on the CTA hover and splash completion flash — now shares the same two
   values as the JS `IGNITION_DURATION`/`IGNITION_EASE` constants via a hand-kept CSS mirror.
3. `ConditionScale`'s resize-listener stale-closure bug, caught while building the Flip highlight (would
   have snapped the highlight back to grade 3 on any window resize, regardless of actual selection).

**Implemented and structurally verified, not stress-tested under real throttling:**
- §5.4 camera-move section transitions (sitewide).
- §5.5 DrawSVG hero connectors (screenshotted, both directions).
- §5.5 Flip on the condition-scale selector.
- §5.6/§8 `ScrollTrigger.batch()` equipment-table reveal (confirmed firing and completing via DOM markers
  during debugging, then the debug instrumentation was removed).

**Known, open gaps — not silently marked "pass":**
- No real CPU/network-throttled performance numbers were recorded (§5.6 throttle test). Needs a manual
  DevTools pass before shipping.
- Services, Method, and Contact are still 100% `.frame` content with no `.bleed` moment. Deliberately left
  this way rather than adding decoration to close a checklist item — needs a real design pass, not a QA fix.
- A full `{ar,en} × {light,dark}` screenshot inventory at 1440px/375px (README.md §17.1) was not re-shot
  this session; Part 2 above is a code-level/cumulative-evidence check, not a fresh visual sweep.
- Section-transition boundaries were spot-checked, not walked exhaustively page-by-page.
