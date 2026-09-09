# DECISIONS.md

## Session checkpoint — paused mid-UI-OVERHAUL-V4, resume here

Work stopped mid-pass at the user's request ("save your progress, we will complete the other time"), not
at a natural end point. State of play, so a future session can pick this up without re-deriving it:

**Done and verified working (build + lint clean, checked live in-browser):**
- Full "Signal" colour system (§3) — dark-by-default, `.light` override, old `--paper`/`--blueprint`/
  `--dawn`/`--patina` tokens fully retired and renamed everywhere.
- `.bleed`/`.frame` layout primitives (§4), `PageShell` rebuilt on `.frame`, oversized `--step-6`/`--step-7`
  type tokens in place and used (home hero, home closing statement, Work index rows).
- GSAP + Lenis wired globally (`SmoothScroll.tsx`), `KineticHeading` (SplitText reveal, §5.3) applied to
  every page's `<h1>` and to the home page's `<h2>`s.
- Splash screen (`SplashScreen.tsx`, §6) — real-progress tracking, min/max guardrails, session-skip,
  reduced-motion variant, ignition completion flash. Built and compiling; **not yet watched end-to-end live**
  (only confirmed it doesn't crash the app and the rest of the page renders under it).
- Spotlight Roster (`SpotlightMember.tsx`, §7) replacing the old team-card grid — cursor-spotlight mask,
  touch sweep, keyboard-focus reveal. Confirmed rendering correctly (duotone tint visible, portraits present,
  title-block-style name/role/contribution content all in the DOM).
- Work index rebuilt as full-bleed scroll-snap rows (`WorkIndexRow.tsx`, §8) — **just fixed a real bug**
  before pausing: the cover image was collapsing to ~1.6×1.6px because it was built on top of `MediaFigure`,
  whose container hard-codes the `relative` Tailwind class; passing `absolute` alongside it does **not**
  override `relative`, because Tailwind emits `.relative{}` after `.absolute{}` in this build's compiled
  CSS, so `.relative` wins the cascade regardless of which one a caller intends to win. Fixed by not routing
  full-bleed background images through `MediaFigure` at all (it renders a `<figure>` with no explicit
  height, which was the other half of the collapse) — `WorkIndexRow` now renders `next/image` directly.
  **Rebuilt and re-verified visually after the fix — confirmed correct in the browser.**
- Copy pass (§10) — the three exact worked examples applied in both locales, changelog written to
  `COPY-AUDIT.md`.

**Confirmed NOT a bug, just a tooling quirk (documented so it isn't re-investigated from scratch):**
`getComputedStyle(el).filter` and, separately, page screenshots in this session's browser-automation tool
have repeatedly returned stale/incorrect results for elements using `filter`/`mask-image`/blend-mode
effects specifically — confirmed by injecting a plain fixed-position red test box that also failed to
appear in a screenshot where the real page content was independently verified correct via DOM inspection.
Trust `elementFromPoint`, computed layout rects, `naturalWidth`, and — best of all — an actual fresh-tab
screenshot taken *before* any scrolling, over a screenshot taken deep into a scrolled/interacted session.

**Explicitly not started yet:**
- §5.4 section-to-section scroll-scrubbed "camera move" timelines (dim-outgoing/brighten-incoming) — not
  implemented anywhere.
- §5.5's DrawSVG treatment for the hero pin connectors (currently still the plain scaleX line-draw from the
  earlier motion pass, not DrawSVGPlugin) and Flip for state changes — not implemented.
- §5.5 magnetic CTA / micro-tilt exist from the *previous* (UI-REFACTOR-PROMPT) pass on the home hero, not
  re-verified against the new Signal palette/layout, and not extended anywhere new.
- §8's `ScrollTrigger.batch()` reveal on the equipment-register table rows inside a Work detail page.
- The full §11 QA checklist has not been run as a formal pass — only ad hoc spot checks during this session
  (build, lint, and the live-browser checks logged above). No throttled-performance numbers have been
  recorded. `QA-REPORT.md` has not yet been written/updated for this v4 pass.
- Deliverable §12 items 9 (this file, in progress) and 10 (`QA-REPORT.md`) are incomplete.

**To resume:** re-run `npm run build` first to confirm nothing regressed since this checkpoint, then work
through the "explicitly not started yet" list above in order, finishing with the full §11 QA pass and
`QA-REPORT.md`.

Every place the build prompt said "you decide," recorded here with the reasoning.

1. **`app/layout.tsx` is a pass-through; the `<html>` shell lives in `app/[locale]/layout.tsx`.**
   Reading the locale via `getLocale()` in a layout outside the `[locale]` segment relies on a
   request-time header, which forces the entire route tree to render dynamically. Reading it from the
   `[locale]` segment's own route param is available at build time via `generateStaticParams`, so every
   page stays statically generable. This is next-intl's own documented pattern for the App Router.

2. **The proxy/middleware file is named `src/proxy.ts`, not `src/middleware.ts` as the build prompt's
   file structure (§9) specifies.** Next.js 16 renamed the `middleware` file convention to `proxy`
   (confirmed against the framework's own bundled docs in `node_modules/next/dist/docs`) and prints a
   build-time deprecation warning for the old name; the content is unchanged, only the filename and the
   fact that it's registered as the default export Next now calls "Proxy" rather than "Middleware".

3. **The hero headline, sub-head, and CTAs sit directly below the full-bleed annotated photograph,
   not overlaid on top of it.** Overlaying text on the photo would either collide with the four
   interactive survey pins or need a legibility scrim, and a scrim reads close to the banned
   gradient-wash decoration (§8.4.4). Stacking headline under figure matches the "figure with caption"
   idiom already used for case studies and field notes.

4. **`TitleBlock` (§7.2) is used only on Work case-study detail pages.** It is the one place subject,
   sector, date, and a reference number genuinely exist together. Services and Method have no such 4-up
   metadata, so forcing the device there would be decoration, not structure.

5. **The fluid type-scale variables keep the spec's literal names** (`--step--1` … `--step-5`) as plain
   CSS custom properties rather than being remapped into Tailwind v4's `--text-*` theme namespace, and are
   consumed via arbitrary values (`text-[length:var(--step-1)]`). This avoids inventing a second naming
   scheme for the same tokens.

6. **The npm package is named `miqyas`, not the folder name.** `create-next-app` rejected the working
   directory's name outright (`Industrial Documentation website` — spaces and capitals aren't valid npm
   package names), so the app was scaffolded into a temp folder as `miqyas-tmp` and moved into place; the
   package name was then corrected to `miqyas` to match the brand.

7. **`opengraph-image.tsx` renders with the system sans-serif stack, not a fetched Arabic font file.**
   Satori (the engine behind `next/og`) needs font bytes supplied explicitly to shape Arabic glyphs
   correctly; fetching a specific Google Fonts static asset reliably needs a pinned CDN URL this
   environment couldn't resolve. The Arabic OG image is legible but not typeset in Noto Kufi Arabic —
   worth revisiting once real brand assets exist.

8. **The Contact page's payment note is a plain sentence next to the facts, not another `ReportFact`.**
   It isn't a label/value pair like response time or working hours, so forcing it into that shape would
   misuse the component.

9. **No video is used anywhere on the site**, even though §15 allows one. Nothing in the actual content
   needs one, and adding a stock clip purely to occupy the optional slot would be decoration without a
   reason — which is exactly what §7's "structure carries information, not decoration" argues against.

10. **`hooks/useDirection.ts` and `i18n/navigation.ts` exist even though they aren't named in §9's file
    tree.** Both are necessary plumbing the spec's prose calls for without listing the file: RTL-aware
    transform signs (§11.3) and next-intl v4's typed `Link`/`useRouter`/`usePathname` (used throughout
    navigation and locale switching).

11. **Added one UI string, `nav.primary`, not in the spec's message list.** The primary navigation
    landmark needs an accessible name (`aria-label`) distinct from any single nav-item label; there was no
    existing key that fit.

---

## UI-REFACTOR-PROMPT pass

12. **Route-level transitions use the `next-view-transitions` package, not React's `<ViewTransition>`
    component.** §3.1 anticipates exactly this fallback. `ViewTransition` is only exported from React's
    experimental/canary build; this project is pinned to stable `react@19.2.8` (confirmed: `'ViewTransition'
    in React` is `false` on the installed package). Switching the whole app to a canary React release to get
    one feature was judged too risky this late in the build. `next-view-transitions` wraps the same
    underlying `document.startViewTransition` browser API, so the CSS side of §3.1 (the RTL-aware directional
    keyframes, the shutter wipe, the morph) is implemented exactly as specified — only the JS trigger differs.
    See `src/components/motion/ViewTransitionsProvider.tsx` and `src/components/motion/TransitionLink.tsx`.

13. **The shared-element morph (§3.1a) is wired via `viewTransitionName` set directly on the Work cover
    image's container** (`case-${slug}`, in both the index card and the detail hero), rather than through a
    `share="morph"` prop — that prop belongs to React's `<ViewTransition>` component, unavailable per #12.
    Because exactly three case studies exist, `::view-transition-group()`/`::view-transition-image-pair()`
    in `globals.css` list their three slugs explicitly rather than matching a wildcard class — CSS has no
    wildcard `view-transition-name` selector, and the newer `view-transition-class` property that would allow
    grouping isn't reliably supported across browsers yet.

14. **The "timecode-style reference readout" from §5.2 (`YEAR · REF CS-00N`) was not added as a separate
    element.** The middle-dot join it specifies conflicts with README.md §8.4 item 6 (banned meta-string
    format), which UI-REFACTOR-PROMPT §0 says stays in force. The same information — year and a reference
    code — already exists as two cells in the Work detail page's `TitleBlock`, which is the established
    device for exactly this kind of metadata; adding a second, differently-formatted readout for the same
    two facts would be redundant rather than additive.

15. **The "date + reading time" and equivalent meta strings across the site still avoid the middle-dot
    join** (stacked spans with a gap, not `A · B`) for the same reason as #14 — this predates the refactor
    pass but is reaffirmed here since the refactor introduced new metadata-adjacent copy (the personnel
    reference codes, the case-study timecode idea) that could easily have reintroduced it.

16. **Scroll-pinned method stepper (§3.4) and odometer-settle on numeral changes (§3.4) were not
    implemented.** Both are real, scoped ideas, but given the size of this pass (a full colour system,
    three new route-transition mechanisms, a rebuilt About page, and a cinematic Work treatment, all in one
    session) they were prioritised behind the changes that touch more of the site or carry more accessibility
    risk if done hastily. Revisit if there's a follow-up pass — the `MethodStepper` and `TierCompare`
    components are the two places they'd attach.

17. **The magnetic-pull effect (§3.4) is applied to exactly one button sitewide** — the home page hero's
    "Request a preliminary assessment" CTA — via a new `MagneticButton` wrapper, not baked into the shared
    `Button` component. Baking it into `Button` would put it on every CTA on the site, which the spec's own
    rule ("one button per page maximum... if every button does this it stops meaning 'this is the important
    one'") explicitly rules out.

18. **Grade-chip numerals now render on a filled circular badge** (grade colour as fill, a fixed ink colour
    per the §2.3 lookup table as text) instead of the previous plain coloured numeral. This follows the
    palette reference image supplied with the refactor brief, which shows grade badges this way, and reuses
    the exact fixed-lookup table §2.3 defines. The 5-segment bar from README.md §7.4 is kept unchanged
    alongside the badge — the grade must still survive greyscale, and the segment count is what carries
    that, not the badge's fill colour.

19. **A found-and-fixed defect, not a "you decide" call, noted here because it affected several
    already-built components:** `AnimatePresence` with a single child whose `key` changes (the pattern used
    for the condition-scale panel, the method-stepper panel, and the tier-compare mobile cell) did not
    complete its enter/exit cycle correctly in this environment — the outgoing element stayed rendered at
    its `animate` value and the incoming element stayed stuck at its `initial` value, so the panel visually
    never updated even though the underlying state had changed correctly (confirmed via direct DOM
    inspection, not just screenshots). Neither an always-defined `exit` prop nor dropping `mode="wait"` fixed
    it. Those three panels now render as plain, unanimated `div`s with a `key`, which is instant but always
    correct — content updates were prioritised over a crossfade transition once the crossfade turned out to
    be unreliable in this Next.js 16 / Turbopack / Motion combination. `AnimatePresence` on a
    conditionally-*mounted* child (the Accordion panel, the MobileNav drawer, the hero pin popover) was
    tested separately and works correctly — the defect is specific to the key-swap-on-a-persistent-child
    pattern.

20. **Two more found-and-fixed defects in the new `.duotone` treatment (§4.2/§5.2), both confirmed by
    screenshot rather than by `getComputedStyle` — see the tooling caveat below.** First, the colour
    overlay was originally a `::before` pseudo-element on the wrapper; a `::before` paints *behind* a later
    DOM sibling in stacking order, so with an opaque `<img>` painted on top of it, the overlay was
    completely hidden and `mix-blend-mode: color` had nothing above it to blend onto — the portraits and
    case-study "before" images rendered plain grayscale with no blueprint/dawn tint at all. Changed to
    `::after`, which paints on top of the `<img>` sibling and blends with it correctly (confirmed visually:
    the tint is now clearly visible, cool in the shadows, warm in the highlights). Second, the reveal state
    originally reset the filter with `grayscale(0) contrast(1)`; changed to the equivalent `filter: none`
    while chasing what looked like the reveal not firing at all — that turned out to be a red herring (see
    below), but `none` is simpler regardless and was kept.

    **Tooling caveat for anyone continuing this QA:** in this environment, `getComputedStyle(el).filter`
    reported the *pre-transition* value even seconds after a class change that a screenshot confirms took
    effect, including once with the new rule marked `!important`. Don't trust `getComputedStyle` for
    `filter` here — verify filter-driven effects (this duotone treatment, any future blur/brightness work)
    by screenshot, the same way the AnimatePresence defect above was confirmed by DOM inspection rather
    than by screenshot. Different properties, different unreliable tool — check each kind of claim against
    the method that actually verifies it.
