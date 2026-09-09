# MEDIA.md — Shot list

Every image on the site is currently a deterministic placeholder from `picsum.photos`, seeded so the same
frame reloads every time (registered in `next.config.ts` under `images.remotePatterns`). This file lists
every slot, where it lives, and what the real photograph should show once the team shoots it.

Video: none is used in the current build (the one optional video slot in the spec was skipped — none of the
content called for it, and adding one just to fill the slot would have been decoration without a reason).

---

## Hero

| Component | Seed | Dimensions | Real photograph |
|---|---|---|---|
| `src/components/interactive/SurveyHero.tsx` | `miqyas-hero-line` | 1600×1000 | Wide shot of a dormant production line from the head of the hall, framed so the four annotated points (conveyor, drive motor, boiler, control panel) are all visible in one frame — this is the shot the four survey pins are plotted against, so it should be reshot before the pin coordinates in `src/content/surveyPins.ts` are trusted. |

## Condition scale (`src/content/conditionScale.ts`)

| Grade | Seed | Dimensions | Real photograph |
|---|---|---|---|
| 1 — Excellent | `miqyas-grade-1` | 640×480 | A piece of equipment running or ready to run, clean, no visible wear — the reference "good" frame other grades are judged against. |
| 2 — Good | `miqyas-grade-2` | 640×480 | Light surface wear consistent with normal use — a scuffed housing or faded paint, nothing structural. |
| 3 — Fair | `miqyas-grade-3` | 640×480 | Visible corrosion or wear on a load-bearing part that still operates — e.g. a pitted shaft or a worn belt. |
| 4 — Poor | `miqyas-grade-4` | 640×480 | Structural damage close-up — a cracked weld, a misaligned bearing housing, something that reads as unsafe to run. |
| 5 — Critical | `miqyas-grade-5` | 640×480 | Equipment that has clearly failed — collapsed structure, seized rotor, a part that has visibly given way. |

## Case study — idle food-canning line, Rural Damascus (`src/content/caseStudies.ts`)

| Slot | Seed | Dimensions | Real photograph |
|---|---|---|---|
| Cover | `miqyas-case-canning-cover` | 1200×800 | Establishing shot of the canning hall from the entrance. |
| Before | `miqyas-case-canning-before` | 1200×800 | The line as found: dust, disorder, eight years of disuse visible. |
| After | `miqyas-case-canning-after` | 1200×800 | The same frame after the site clean-up that preceded the survey. |
| Gallery 1 | `miqyas-case-canning-1` | 900×600 | Close-up of the sterilisation boiler's nameplate. |
| Gallery 2 | `miqyas-case-canning-2` | 900×600 | The canning conveyor, full length. |

## Case study — partially damaged metal foundry, Aleppo

| Slot | Seed | Dimensions | Real photograph |
|---|---|---|---|
| Cover | `miqyas-case-foundry-cover` | 1200×800 | The foundry floor showing the overhead crane runway. |
| Gallery 1 | `miqyas-case-foundry-1` | 900×600 | Close-up of the crane runway misalignment referenced in the findings. |

## Case study — warehouse and material handling, Homs

| Slot | Seed | Dimensions | Real photograph |
|---|---|---|---|
| Cover | `miqyas-case-warehouse-cover` | 1200×800 | The warehouse interior with the idle conveyor system in frame. |
| Gallery 1 | `miqyas-case-warehouse-1` | 900×600 | Close-up of the worn conveyor idlers. |

## Field notes (`src/content/fieldNotes.ts`)

| Note | Seed | Dimensions | Real photograph |
|---|---|---|---|
| Reading a motor nameplate | `miqyas-note-nameplate` | 1200×700 | A macro shot of an actual weathered nameplate, legible enough to read the stamped values. |
| Surface rust vs. structural corrosion | `miqyas-note-rust` | 1200×700 | A side-by-side or single frame showing both a lightly rusted surface and a pitted, structurally corroded one for contrast. |
| Why we interview the caretaker | `miqyas-note-caretaker` | 1200×700 | A candid field photograph of an interview in progress — the engineer and the caretaker, not posed. |
| What a visual assessment excludes | `miqyas-note-exclusions` | 1200×700 | The scope-and-limitations page of an actual delivered report, photographed or scanned. |

## Team (`src/content/team.ts`)

| Member | Seed | Dimensions | Real photograph |
|---|---|---|---|
| Anas Diab | `miqyas-team-1` | 480×480 | A plain portrait, neutral background, no branding — matches the "no inflated titles" tone of the About page. |
| Rahaf Halabi | `miqyas-team-2` | 480×480 | Same treatment as above. |
| Karim Assaf | `miqyas-team-3` | 480×480 | Same treatment as above. |

---

Once real photography exists, replace the `src` values in the corresponding `src/content/*.ts` file —
components read `ImageRef.src` directly and need no other change.
