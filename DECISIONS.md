# DECISIONS.md

## Session checkpoint — bug-fix pass, team redesign, static export for GitHub Pages

Three rounds of user-reported feedback after the UI-OVERHAUL-V4 pass below, plus prepping the repo to ship.
In order:

1. Splash screen inconsistent on refresh; camera-move effect hiding text in dark mode and on the Services
   page; content reading narrow on wide screens — see decisions 29–31.
2. The camera-move effect still not settling before content is read on some pages; team cards asked to be
   redesigned; splash transition asked to be smoother — see decisions 32–34.
3. A real hydration-mismatch console error, a `<script>` console notice (not a bug — Next's own documented
   JSON-LD pattern), a full mobile/RTL pass that found and fixed two more real defects, and converting the
   app to a static export for GitHub Pages — see decisions 35–39 and the new `.github/workflows/deploy.yml`.

**Two real, previously-undetected defects found during the mobile pass, both severe enough that they're
worth flagging up here rather than leaving buried in decision 38:**
- `max-w-xs` on the mobile nav drawer was silently resolving to `0.75rem` (12px), not Tailwind's built-in
  20rem, because this project's own `--spacing-xs` theme token happens to share the name Tailwind's default
  max-width scale uses for `xs`.
- The mobile nav's `fixed inset-0` overlay+drawer, nested inside `<header>`, was being clipped to the
  header's own ~80px height instead of spanning the viewport — `header`'s `backdrop-blur-sm` establishes a
  new containing block for `position: fixed` descendants (same rule as `filter`), so anything `fixed` inside
  a backdrop-blurred ancestor is positioned relative to *that ancestor*, not the viewport.

## Session checkpoint — UI-OVERHAUL-V4 pass completed

The prior checkpoint ("paused mid-UI-OVERHAUL-V4, resume here") was resumed and the pass finished. Kept
below for history; the "explicitly not started yet" list it ended on is now entirely done — see decisions
21–27 and `QA-REPORT.md` for what each item turned into and how it was verified. Summary of the resumed
work:

- §5.4 camera-move section transitions: implemented site-wide (decision 21).
- §5.5 DrawSVG hero pin connectors: implemented (decision 22).
- §5.5 Flip for a state change: implemented on the condition-scale grade selector (decision 23).
- §5.5 magnetic CTA / hero tilt: re-checked against the Signal palette — no changes needed, both are
  palette-agnostic (decision 24).
- §8 `ScrollTrigger.batch()` on the equipment-register table: implemented (decision 25).
- §11 QA pass: run; two real, previously-undetected defects found and fixed (decision 26); results and
  honest gaps written to `QA-REPORT.md`.
- A new browser-automation tooling caveat discovered while running the QA pass, distinct from the filter/
  `getComputedStyle` one below (decision 27).

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

---

## UI-OVERHAUL-V4 pass, resumed — remaining items from the checkpoint

21. **Camera-move section transitions (§5.4) are implemented as one layout-mounted component
    (`CameraMoveSections.tsx`), not per-page.** It mounts once in `[locale]/layout.tsx`, re-scans
    `#main`'s `<section>` elements on every route change (keyed off `usePathname()`), and wires a
    scroll-scrubbed `gsap.timeline` between every consecutive pair exactly per the spec's worked example
    (outgoing `scale: 0.96, filter: brightness(0.6)`, incoming `.from({yPercent: 8, filter: brightness(0.5)})`,
    `scrub: 0.6`). A single sitewide component was chosen over duplicating the wiring on every page — every
    page already reliably wraps its content in `<section>` elements, so scanning `#main` generically covers
    all of them for free and guarantees no page is accidentally skipped.

22. **The hero's pin connectors (§5.5) now render as real SVG `<line>` elements animated with
    `DrawSVGPlugin`, replacing the CSS-`scaleX` `<m.span>` from the earlier motion pass.** The overlay SVG's
    `viewBox` is deliberately set to `800×500` — the same aspect ratio as the hero's `aspect-[8/5]` container
    — so `preserveAspectRatio="none"` stretches it with zero distortion (a non-matching aspect ratio would
    have skewed the connector angles). RTL is handled by converting each pin's logical `xPct` to a physical
    x-coordinate (`dir === 'rtl' ? 100 - xPct : xPct`) before projecting into viewBox units, then applying
    the existing `useDirection().sign` to the connector's draw direction — the same sign convention already
    used elsewhere in this codebase for direction-aware transforms. Verified correct in both directions by
    screenshot (connectors point toward the button in the reading-forward direction in both LTR and RTL).

23. **Flip (§5.5 "for state changes") is applied to the condition-scale grade selector, not somewhere new.**
    The five grade buttons previously swapped an instant `bg-ember` class per-button on selection, which is
    exactly the kind of plain-class-swap the spec calls out. Replaced with a single shared highlight `<div>`
    positioned via measured `getBoundingClientRect()` deltas; on selection change, `Flip.getState()` captures
    the highlight's old box before it's repositioned, then `Flip.from()` animates the visual transform back
    to zero. A real bug was caught and fixed while building this: the mount-only resize listener closed over
    the *initial* `selected` value (`useLayoutEffect(..., [])`), so a browser resize after changing grades
    would have silently snapped the highlight back to grade 3 regardless of the actual selection — fixed by
    reading the current selection through a ref (`selectedRef`, kept current via a plain `useLayoutEffect`
    with no dependency array) instead of the effect's original closure.

24. **Magnetic CTA (`MagneticButton.tsx`) and the hero micro-tilt (`SurveyHero.tsx`'s `tiltRef`) needed no
    changes for the Signal palette re-check.** Both are purely structural/behavioural (pointer-offset state,
    `rotateX`/`rotateY` transforms) and carry no hardcoded colour of their own — `MagneticButton` just wraps
    whatever `Button` renders, and `Button`'s `primary`/`secondary` variants already read `bg-ember`/
    `text-signal-text` etc. Confirmed via code read rather than a palette-diff, since there was nothing here
    that could have drifted.

25. **The equipment-register table's row reveal (§5.6/§8) uses `ScrollTrigger.batch()` via a new
    `BatchRevealRows.tsx` client component wrapping `<tbody>`,** rather than converting the whole
    (server-rendered) case-study page to a client component. The page keeps mapping `caseStudy.equipment`
    to plain `<tr>` JSX exactly as before; only the `<tbody>` tag itself is swapped for the wrapper, which
    measures its own `<tr>` children after mount and batches their entrance instead of creating one
    `ScrollTrigger` per row.

26. **Two real, previously-undetected defects were found and fixed during the §11 QA pass** (not
    "you decide" calls — regressions from the palette rewrite that predate this resumed session):
    - `GradeChip.tsx` was still reading `--color-grade-1-ink` … `--color-grade-5-ink` (decision 18's
      per-grade contrast lookup from the *earlier* UI-REFACTOR-PROMPT pass). UI-OVERHAUL-V4 §3.3 replaced
      that lookup with a single uniform token, `--color-grade-chip-text`, and the per-grade `-ink` variables
      were removed from `globals.css` when that palette was written — but `GradeChip.tsx` itself was never
      updated to match, so every grade-chip numeral was rendering with an undefined CSS custom property
      (`var(--grade-ink)` resolving to nothing, falling through to an inherited colour rather than the
      mandated fixed numeral colour). Fixed by pointing `--grade-ink` at `--color-grade-chip-text` and
      deleting the stale per-grade lookup table. Confirmed fixed via `getComputedStyle`: `rgb(10, 12, 15)`
      (`#0A0C0F`) on every grade in dark theme, `rgb(255, 255, 255)` in light theme — exactly §3.3's rule.
    - The site's one ignition duration/ease pair (§5.5) was only ever a JS constant
      (`src/lib/ignition.ts`), so the two CSS-only places an ignition moment happens — the primary CTA's
      hover (`Button.tsx`) and the splash screen's completion-flash stroke/aperture transitions
      (`SplashScreen.tsx`, both plain inline `style.transition` strings) — had silently drifted to a
      hardcoded `120ms`/`200ms ease` instead of literally reusing it, which is exactly what §5.5 says not to
      do ("do not re-author four slightly different versions of 'something switching on'"). Fixed by adding
      `--duration-ignition: 200ms` and `--ease-ignition: cubic-bezier(0.25, 0.46, 0.45, 0.94)` (the standard
      `easeOutQuad` curve — the closest CSS `cubic-bezier` equivalent to GSAP's `power2.out`, which CSS has
      no native keyword for) to `globals.css`, and pointing all three CSS-only spots at them. The JS
      constants in `ignition.ts` are the source of truth; the CSS custom properties are a hand-kept mirror
      of the same two numbers, documented as such in a comment at the definition site, since Tailwind
      arbitrary values and inline `style` strings can't import a JS module.

27. **Three pages (Work detail, Notes detail) had their hero cover image pulled out of `PageShell` into a
    `.bleed` wrapper; three pages (Services, Method, Contact) were left untouched despite failing the same
    §11 checklist item.** The QA pass found that Services, Method, Contact, Notes index, Notes detail, and
    Work detail were *entirely* wrapped in one `PageShell` — 100% `.frame` content, not "roughly a third"
    per §11's threshold. Work detail and Notes detail both already had a natural, existing image (the case
    study cover / the note's cover) that could be promoted to full-bleed without inventing new content, so
    they were restructured: header/title content stays in a `PageShell`, the cover image sits in its own
    `.bleed` wrapper between two `PageShell`s, body content resumes inside `.frame`. (Work detail's cover
    already carried a `viewTransitionName` shared with the full-bleed image on the Work index row — bleeding
    it here also fixes a minor continuity issue where the shared-element transition used to shrink straight
    from full-bleed into a contained figure.) Services, Method, and Contact have no equivalent existing
    image or natural full-bleed moment — manufacturing one (a stock photo band, an invented full-width
    stat) would be decoration added to satisfy a checklist rather than structure carrying information, which
    the original README.md spec explicitly argues against. Left as a known, honestly-documented gap rather
    than a forced fix; see `QA-REPORT.md`.

28. **A new browser-automation tooling caveat, distinct from the filter/`getComputedStyle` one above.** In
    this environment, when the Browser pane tool reports itself hidden or minimized (`tabs_context` prints
    "The Browser pane is currently hidden"; `window.innerWidth` reads `0`; screenshots time out with
    "Claude's window is minimized or hidden"), `requestAnimationFrame` genuinely stops firing — confirmed
    by injecting a self-scheduling `requestAnimationFrame` counter and observing it stay at `0` after
    several real seconds. Every GSAP tween that depends on the ticker (Flip, `gsap.to`/`gsap.from`,
    `quickTo`) freezes at its very first frame — typically the *inverted*/"from" state — for as long as the
    pane stays hidden, then resumes and completes normally once it's visible again. This is **not** the same
    failure mode as the filter/`getComputedStyle` issue and doesn't affect **scroll-event-driven** updates
    (`ScrollTrigger`'s progress recalculation fires directly off the native `scroll` event, not off the
    ticker, so camera-move and batch-reveal triggers fire correctly regardless of pane visibility — only the
    *tween playback* after a trigger fires needs the ticker). When a tween looks "stuck," check
    `tabs_context` for pane visibility before assuming the code is broken; when the pane won't come forward,
    verify via DOM state instead of a live-animated screenshot — e.g. for Flip, confirm `Flip.getState()`
    captured the correct old box and that the inverted starting transform's pixel delta exactly matches the
    old-to-new position difference, which proves the setup is correct independent of whether the tween can
    be watched playing out in this tool.

---

## Bug-fix pass 1 — splash refresh, dark-mode camera-move, page width

29. **The splash's `sessionStorage` "already played" flag was removed outright, rather than fixed.** It was
    causing exactly the reported bug: `sessionStorage` survives a hard refresh in the same tab (it's only
    cleared when the tab closes), but the spec wants the splash to *replay* on a hard refresh and skip only
    on an internal client-side navigation. Those two cases turned out to need no flag to distinguish at all:
    `SplashScreen` mounts inside `[locale]/layout.tsx`, and Next.js already keeps a layout mounted across
    client-side navigation within the same route tree — so the component's effect (and thus the splash)
    structurally never re-runs on an internal `<Link>` navigation, regardless of any stored flag. It only
    ever mounts fresh on a genuine full page load, which is exactly when the splash should play.

30. **The camera-move dim/fade (§5.4) switched from `filter: brightness()` to `opacity`.** Reported as
    "hides content in dark mode": `brightness()` scales every RGB channel toward zero, so on the dark
    theme's near-black background it darkens light text almost as fast as the background, collapsing
    contrast — light mode has more headroom (dimming a light background is far more forgiving) so it wasn't
    as visible there. `opacity` blends toward the page's actual background colour instead, which holds up
    in both themes. Also made the effect more pronounced per the same feedback ("I like it, make it appear
    more") — scale delta widened from 0.96/8% to 0.9/14%, opacity dips to 0.35/0.15 instead of a gentler
    range — since the dark-mode contrast problem, not the effect's intensity, was the actual complaint.

31. **`.frame`'s max-width raised from 1680px to 2400px, and its default child span widened from
    `grid-column: 2 / 16` to the full `1 / 17`.** Reported as content still reading narrow. Two compounding
    causes: the 1680px cap itself, and every direct `.frame` child being inset by one extra grid column on
    each side by default — which duplicated the inset `padding-inline` already provides, on top of an
    already-capped container. `.frame-prose`/`.frame-facts`'s intentional asymmetric spans (`ReportSpread`'s
    facts/prose split) are unaffected — they're separate classes with equal selector specificity, resolved
    by simply being declared later in the stylesheet, unrelated to what the *default* span resolves to.

---

## Bug-fix pass 2 — short sections, team card redesign, splash smoothness

32. **The camera-move fade-in's resolve point moved from the incoming section's own `top top` to `top
    60%`.** Reported as unclear text while scrolling, worst on Services. The original span (`top bottom` →
    `top top`) is exactly one viewport height of scroll, regardless of how tall the section actually is.
    Services' sections are *shorter* than a viewport (~550px measured live), so the entrance's resolve point
    (when its top reaches the viewport's top) could arrive well after the section had already scrolled
    mostly past — meaning progress might never even reach 1 before the reader's eye got there. Resolving
    within the first ~40% of the entrance instead means it settles to full opacity while the section is
    still comfortably below the fold, confirmed live: a short section sat at ~93% opacity by the time it
    reached a natural reading position, instead of still ramping.

33. **The team section (`SpotlightMember.tsx`, the full-bleed cursor-spotlight cinematic treatment) was
    replaced with a new `TeamCard`/`TeamPortrait` grid**, per an explicit request for a "more creative,
    prettier" layout with new animation, rather than iterating on the existing one. Each card keeps the same
    underlying idiom (duotone at rest, a cursor-tracked radial mask resolving to colour, full reveal on
    keyboard focus) but scoped to one portrait instead of a full-bleed section, plus two new touches: a
    `perspective`/`rotateX`/`rotateY` tilt toward the cursor (the same `gsap.quickTo` inertia pattern as the
    mask, a second pair of quickTo functions rather than reusing the mask's), and a small corner-bracket +
    growing-underline accent on hover/focus (a viewfinder/technical-drawing register mark, not a decorative
    glow — kept in the site's existing engineering-document visual language rather than introducing a new
    one). The grid's scroll-entrance stagger uses a new, generic `BatchRevealGrid` (a `<div>`-based sibling
    of the existing table-only `BatchRevealRows`) rather than one-off wiring, since nothing about staggering
    a grid of cards is table-specific. The dead `.team-trace` CSS (a hairline motif left over from an even
    earlier, pre-Spotlight-Roster card-grid design, never removed when that pass replaced it) was revived
    as the new grid's background trace rather than writing an equivalent rule from scratch.

    A real, unrelated CSS bug was caught while building this: `.team-portrait__corner`'s colour was set via
    a separate `border-color: var(--color-signal)` declaration, then each corner's `border-block-start: 2px
    solid` / `border-inline-start: 2px solid` shorthand (declared after it, with no colour term) silently
    reset that side's colour back to `currentcolor` — a border shorthand always sets its colour sub-property
    even when omitted from the shorthand text, so a *separate* `border-color` line earlier in the same rule
    never wins. Fixed by putting the colour inside each shorthand directly
    (`border-block-start: 2px solid var(--color-signal)`), confirmed via `getComputedStyle` before and after.

34. **The splash's exit crossfade and internal progress easing were changed, not just to a longer
    duration.** Reported as wanting the splash and its transition into the page "smoother." Two real
    contributing issues, not just taste: the aperture's SVG `r` attribute had a CSS `transition` layered on
    top of a value that was *already* updating every frame from a GSAP-tweened `percent` state — animating
    an already-smoothly-interpolating value a second time reads as laggy/rubber-banding rather than smooth,
    so that transition was removed outright (kept only on the completion-flash's `stroke` colour swap, a
    genuinely discrete change that benefits from one). Separately, the exit crossfade used a flat CSS `ease`
    over 500ms; changed to the site's existing `--ease-standard` token (already used for every other
    reveal/dissolve moment sitewide) paired with a subtle `scale(1.03)`, at 650ms — a named constant
    (`HIDE_TRANSITION_MS`) shared between the CSS transition string and the `setTimeout` that unmounts the
    component after it, since those two numbers silently drifting apart would cut the fade off mid-flight.

---

## Bug-fix pass 3 — hydration mismatch, mobile/RTL pass, static export for GitHub Pages

35. **`CameraMoveSections`, `BatchRevealRows`, and `BatchRevealGrid` all defer their first DOM mutation by
    one `requestAnimationFrame`, rather than mutating synchronously the instant their effect fires.** Fixes
    a real console error: "A tree hydrated but some attributes of the server rendered HTML didn't match the
    client properties," naming the exact `style` attributes (`will-change`, `opacity`, `transform`) these
    three components write imperatively via refs. All three effects run correctly *after* React's hydration
    commit (they're the last things mounted in the tree, and `useEffect` never runs before the browser has
    already committed and painted), so this isn't a real mismatch between server and client output — it's
    Next/React's dev-mode hydration-mismatch check evidently sampling DOM state at a point that can still
    catch an imperative mutation from an effect that fired extremely early in the same task. This is a
    known, common class of false-positive for third-party DOM-mutating libraries (GSAP included) used
    inside React effects; deferring the mutation one frame is the standard, low-risk fix — it doesn't change
    *what* gets mutated, only pushes *when* by one paint, safely past whatever window that check runs in.

36. **The JSON-LD `<script type="application/ld+json">` in `[locale]/layout.tsx` was left as-is** (only
    hardening it with the docs' own recommended `<`-escaping, which hadn't been applied) rather than
    "fixing" the console notice about it. Confirmed via this exact Next.js version's own bundled docs
    (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`) that a native `<script>` tag — not
    `next/script` — is Next's own current, explicit recommendation for JSON-LD specifically, precisely
    because `next/script` is for executable code and this isn't any. React's dev console still logs a
    generic "script tag rendered by a component" notice for it regardless, because that check doesn't
    special-case `type="application/ld+json"` — but there's no alternative in Next's own guidance that
    avoids it, so this is expected, harmless noise from following the framework's documented pattern, not a
    defect to route around.

37. **Two real defects found during a full mobile/RTL pass — see the checkpoint summary at the top of this
    file for both; not re-explained here to avoid duplicating it.** Fixed in `MobileNav.tsx` (portal to
    `document.body` for the `backdrop-blur` containing-block bug; `max-w-[20rem]` instead of `max-w-xs` for
    the theme-token collision).

38. **Switched to a static export (`output: 'export'`) for GitHub Pages, per explicit user choice among
    three deploy-target options offered (CI-only / GitHub Pages / Vercel-via-Action).** This is a real
    architectural change, not a config toggle in isolation — proxy/middleware and dynamic route handlers are
    both explicitly unsupported for static export (confirmed against this Next.js version's own bundled
    `static-exports.md`), so:
    - `src/proxy.ts` is deleted. Its one job — picking a locale for a bare `/` request via the
      `Accept-Language` header — has no server-side equivalent without a server. Replaced with
      `src/app/page.tsx`, a root page (a *sibling* of `[locale]`, so — per `app/layout.tsx`'s own comment —
      it has to supply its own `<html>`/`<body>`, nothing upstream does it for this path) that does the
      closest client-side equivalent: read `navigator.language` once on mount and `router.replace()` to
      `/en` or `/ar`, plus a static `<meta http-equiv="refresh">` and a plain-link `<noscript>` fallback for
      anyone who never gets that far. All paths in that fallback are relative (`ar/`, not `/ar/`) so it
      still resolves correctly under a GitHub Pages *project* subpath, not just a domain root.
    - `opengraph-image.tsx` gained `generateStaticParams` (required — without per-locale params and no
      `dynamicParams` fallback, static export has nothing to prerender) and now always renders the English
      name/tagline regardless of locale, rather than the real bug this exposed: Satori (the renderer behind
      `ImageResponse`) has no Arabic text-shaping support without an embedded font covering it, and static
      export previously never hit this because the route was generated lazily, on request, in dev/SSR —
      switching to `output: 'export'` forces every locale variant to render at *build* time, which crashed
      on the `ar` variant (`lookupType: 5 - substFormat: 3 is not yet supported`, a Satori/OpenType
      limitation). Fetching a real Arabic font at build time was deliberately rejected as the fix: it would
      make a static export — which should build reproducibly offline — depend on a network call to Google
      Fonts succeeding, turning a config change into a new source of CI flakiness. Keeping the social-preview
      thumbnail in Latin script for both locales was judged the smaller cost; the actual page underneath is
      unaffected and fully localized either way.
    - `robots.ts` and `sitemap.ts` both gained `export const dynamic = 'force-static'` — required by static
      export even though neither ever reads per-request data.
    - `next.config.ts` gained `basePath` (read from a `NEXT_BASE_PATH` env var the deploy workflow sets,
      empty in local dev so `next dev`/the local static-preview script are unaffected) and
      `trailingSlash: true` (a route needs to be a real directory with an `index.html` — reached via
      `/en/` — for a server-less static host to resolve it, not a sibling `en.html` file).
    - `package.json`'s `start` script changed from `next start` (which does not work against an
      `output: 'export'` build — there's no server-rendered output left for it to serve) to
      `npx serve@latest out -l 3000`, a plain static file server pointed at the export's `out/` directory.
      Verified end-to-end with `curl` after this change: `/`, `/en/`, `/ar/`, `/en/services/`,
      `robots.txt`, and one `_next/static` JS asset all return 200, and the root page's meta-refresh points
      at `ar/` (the configured `defaultLocale`).
    - New `.github/workflows/deploy.yml`: a `build` job (install, lint, typecheck, build) runs on every push
      and pull request to catch breakage without deploying anything; a `deploy` job runs only on a push to
      `main`, computes the base path from the repository name (empty for a `<owner>.github.io` user/org
      repo, `/<repo-name>` otherwise — computed in the workflow itself since the actual repository name
      isn't known yet at the time this was written), rebuilds with that path baked in, adds a `.nojekyll`
      file to the export (without it, GitHub Pages' Jekyll processing silently drops every
      underscore-prefixed path, including the entire `_next/` assets directory), and publishes via
      `actions/upload-pages-artifact` + `actions/deploy-pages`.

39. **`src/lib/metadata.ts`'s `siteUrl` placeholder (`https://miqyas.example`) was left untouched.** It
    feeds canonical URLs and the sitemap/robots output; correcting it needs the real domain the site will
    actually launch on (or the GitHub Pages URL, if that's the permanent home), which isn't yet known and
    isn't a technical blocker for the export/deploy pipeline itself — worth revisiting the moment a real
    domain (or the confirmed permanent GitHub Pages URL) exists.
