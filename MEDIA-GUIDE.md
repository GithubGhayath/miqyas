# MIQYAS — Media Guide

Every image on the site was, until this pass, a `picsum.photos` placeholder with no relation to its subject. This guide records what replaced them: real, subject-appropriate stock photography (Pexels, free-to-use license, downloaded directly and committed under `public/images/`), organized so a real photographer can later replace each slot with an actual MIQYAS field photograph.

Each row lists: the file, the component that renders it, its declared dimensions, the placeholder source, and one instruction for what the real replacement photograph should show. Source URLs are archived in full (with numeric Pexels photo IDs) in the working scratchpad log used to compile this table.

**Honesty note before the table**: four slots below are *thematic* substitutes rather than literal subject matches — the exact scene described in the original task brief (an active canning line inside a "partially damaged" foundry that reads as damaged rather than operating; a genuine data-plate/nameplate closeup; a colour-consistent warehouse gallery shot) was not findable via text search on Pexels within scope. Each of those four rows is flagged inline with why, so the real photographer knows exactly what is still missing.

## Hero

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/hero/production-hall.jpg` | [SurveyHero.tsx](src/components/interactive/SurveyHero.tsx) | 1600×1000 (16:10 crop, `fill`) | pexels.com/photo/dark-empty-hall-of-old-building-with-columns-7216020 | An unlit MIQYAS client production hall shot from the entrance, wide enough to read as silent and unexamined — no people, no artificial lighting rigged for the photo. |

## Condition scale (5 grades)

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/grades/grade-1-excellent.jpg` | [ConditionScale.tsx](src/components/interactive/ConditionScale.tsx) | 640×480 | pexels.com/photo/industrial-factory-floor-with-machinery-31352672 | A real Grade-1 asset from an actual MIQYAS report: clean, well-lit, running within design spec, no visible wear. |
| `public/images/grades/grade-2-good.jpg` | ConditionScale.tsx | 640×480 | pexels.com/photo/machinery-in-factory-8973132 | A real Grade-2 asset: normal-use surface wear only, still fully functional. |
| `public/images/grades/grade-3-fair.jpg` | ConditionScale.tsx | 640×480 | pexels.com/photo/dirty-industrial-machinery-12951623 | A real Grade-3 asset: visible wear or grime that limits efficiency but doesn't stop current operation. |
| `public/images/grades/grade-4-poor.jpg` | ConditionScale.tsx | 640×480 | pexels.com/photo/rusted-heavy-machinery-7910072 | A real Grade-4 asset: substantial structural or functional damage, a genuine safety concern on continued use. |
| `public/images/grades/grade-5-critical.jpg` | ConditionScale.tsx | 640×480 | pexels.com/photo/abandoned-heavy-machinery-5503864 | A real Grade-5 asset: total loss of structural or functional integrity, unmistakably unsafe to operate. |

## Case study — idle canning line (Rural Damascus)

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/cases/canning-cover.jpg` | [WorkFilmTile.tsx](src/components/work/WorkFilmTile.tsx), [work/[slug]/page.tsx](<src/app/[locale]/work/[slug]/page.tsx>) via MediaFigure | 1200×800 | pexels.com/photo/cans-in-the-assembly-line-5532669 | The actual canning line at the rural-Damascus site, cover-shot quality, close enough to read as this specific line. |
| `public/images/cases/canning-before.jpg` | [BeforeAfter.tsx](src/components/interactive/BeforeAfter.tsx) | 1200×800 | pexels.com/photo/an-empty-warehouse-11667731 | The canning hall exactly as found on arrival, idle since 2012 — dust, stopped conveyors, no staging. |
| `public/images/cases/clean-line-reference.jpg` (used as the "after") | BeforeAfter.tsx | 1200×800 | pexels.com/photo/an-industrial-machine-in-a-factory-5953723 | **Placeholder note:** this is a *different, already-clean* line used only to represent the *visual outcome* of a site clean-up, not an actual before/after pair from the same facility. Replace with a genuine after-photo of the same rural-Damascus hall once it's been cleared. |
| `public/images/cases/canning-gallery-1.jpg` | work/[slug]/page.tsx via MediaFigure | 900×600 | pexels.com/photo/industrial-machinery-in-factory-8973680 | **Placeholder note:** originally slotted as a boiler-nameplate closeup; no such photo was findable via search, so this generic shop-floor shot fills the slot instead. Replace with an actual closeup of the sterilisation boiler's nameplate/data plate. |
| `public/images/cases/canning-gallery-2.jpg` | work/[slug]/page.tsx via MediaFigure | 900×600 | pexels.com/photo/a-conveyor-belt-with-cans-on-it-27623556 | The canning line's actual conveyor at the site, matching the equipment table's `eq-canning-1`. |

## Case study — partially damaged foundry (Aleppo)

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/cases/foundry-cover.jpg` | WorkFilmTile.tsx, work/[slug]/page.tsx via MediaFigure | 1200×800 | pexels.com/photo/melted-steel-in-a-cast-iron-container-6804260 | **Placeholder note:** this shows active, healthy metal-pouring — a thematic (foundry/molten-metal) match, not the actual "partially damaged" state of this specific site. Replace with a real cover shot of the Aleppo foundry showing its actual damage. |
| `public/images/cases/foundry-gallery-1.jpg` | work/[slug]/page.tsx via MediaFigure | 900×600 | pexels.com/photo/industrial-overhead-crane-hook-in-factory-setting-29224553 | The Aleppo foundry's actual overhead crane and its out-of-alignment runway, per `eq-foundry-1`. |

## Case study — warehouse & material handling (Homs)

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/cases/warehouse-cover.jpg` | WorkFilmTile.tsx, work/[slug]/page.tsx via MediaFigure | 1200×800 | pexels.com/photo/abandoned-industrial-warehouse-interior-view-34331633 | The actual Homs warehouse interior, empty racking and idle conveyor visible. |
| `public/images/cases/warehouse-gallery-1.jpg` | work/[slug]/page.tsx via MediaFigure | 900×600 | pexels.com/photo/conveyor-belt-buildings-of-the-old-mine-processing-plant-17057342 | **Placeholder note:** this source photo is black-and-white, which doesn't match the site's colour photography elsewhere — a stylistic mismatch, not just a subject one. Replace with a colour photo of the Homs warehouse's actual belt-conveyor system (`eq-warehouse-1`/`eq-warehouse-2`). |

## Team

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/team/team-1.jpg` | [TeamAssembly.tsx](src/components/about/TeamAssembly.tsx) | 480×480 | pexels.com/photo/engineer-in-industrial-factory-using-tablet-32845694 | M-01 (leads field inspection) actually inspecting or recording data on site. |
| `public/images/team/team-2.jpg` | TeamAssembly.tsx | 480×480 | pexels.com/photo/worker-with-white-helmet-in-factory-19895915 | **Placeholder note:** a third-party company logo ("VITAL ENERGi") is visible on the worker's vest. M-02's real photo should carry no other company's branding. |
| `public/images/team/team-3.jpg` | TeamAssembly.tsx | 480×480 | pexels.com/photo/a-woman-working-as-an-engineer-17843272 | **Placeholder note:** a third-party brand ("isbak") is visible on the hard hat. M-03's real photo should carry no other company's branding. |
| `public/images/team/team-4.jpg` | TeamAssembly.tsx | 480×480 | pexels.com/photo/man-in-the-construction-site-holding-a-clipboard-8961004 | M-04 (coordinates site visits) on an actual site visit with a client or field notes in hand. |
| `public/images/team/team-5.jpg` | TeamAssembly.tsx | 480×480 | pexels.com/photo/electrician-by-fuse-box-17842832 | M-05 (electrical engineer) actually inspecting an electrical panel or supply. |
| `public/images/team/team-6.jpg` | TeamAssembly.tsx | 480×480 | pexels.com/photo/a-man-in-a-yellow-vest-holding-a-hard-hat-28196526 | M-06 (founder) — a portrait consistent with the rest of the team's working-on-site style, not a posed studio headshot. |

All six team portraits above are working/inspecting shots rather than posed headshots, per the task brief; all are placeholders standing in for the real team's own photographs.

## Field notes (cover images)

| File | Used by | Dimensions | Placeholder source | Real photo should show |
|---|---|---|---|---|
| `public/images/notes/nameplate.jpg` | [MediaFigure.tsx](src/components/ui/MediaFigure.tsx), rendered from [notes/[slug]/page.tsx](<src/app/[locale]/notes/[slug]/page.tsx>) | 1200×700 | pexels.com/photo/old-fashioned-industrial-equipment-11828236 | **Placeholder note:** no literal motor-nameplate/data-plate photo was findable via search; this vintage-gear closeup is the nearest thematic substitute. Replace with an actual nameplate closeup — the note is specifically about reading one. |
| `public/images/notes/rust.jpg` | MediaFigure.tsx, notes/[slug]/page.tsx | 1200×700 | pexels.com/photo/metal-surface-covered-in-rust-26833846 | A macro shot distinguishing surface rust texture from pitted/structural corrosion, matching the note's actual subject. |
| `public/images/notes/caretaker.jpg` | MediaFigure.tsx, notes/[slug]/page.tsx | 1200×700 | pexels.com/photo/2-men-talking-on-a-warehouse-4480796 | A real MIQYAS team member interviewing an actual site caretaker, in conversation rather than posed. |
| `public/images/notes/exclusions.jpg` | MediaFigure.tsx, notes/[slug]/page.tsx | 1200×700 | pexels.com/photo/notebook-and-clipboard-with-papers-placed-on-desk-with-folders-and-pens-5668469 | The first page of an actual MIQYAS report open to its exclusions section, not a generic desk still life. |

## Summary of open gaps for the real photographer

1. **Canning gallery 1** — needs a genuine boiler/sterilisation-unit nameplate closeup.
2. **Foundry cover** — needs a photo of the Aleppo site's actual (damaged) state, not a generic active pour.
3. **Warehouse gallery 1** — needs a colour photo; current placeholder is black-and-white.
4. **Field-note nameplate cover** — same nameplate gap as (1), different slot.
5. **Team 2 and Team 3** — need re-shoots without third-party company branding visible.
6. **Canning "after" image** — is currently a different, unrelated clean line; needs the same rural-Damascus hall shot post clean-up.

## Deployment note

`next.config.ts` already sets `images.unoptimized: true` and the GitHub Pages workflow (`.github/workflows/deploy.yml`) already computes `basePath` and writes `.nojekyll` — all three prerequisites for these images to load on the deployed static export were already correctly in place before this pass; nothing needed fixing there. All `src` paths above are root-relative (e.g. `/images/hero/production-hall.jpg`) and rely on `next/image`'s automatic `basePath` prefixing, the same pattern already used for client-side routing elsewhere in this codebase (see [RootRedirect.tsx](src/components/RootRedirect.tsx)) — no manual `basePath` string concatenation was added.

These images have been verified locally (`npm run dev` and direct file inspection) but **not yet on the actual deployed GitHub Pages build**, since nothing has been pushed during this session. That check is still outstanding.
