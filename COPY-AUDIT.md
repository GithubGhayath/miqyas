# COPY-AUDIT.md

Every string in `messages/*.json` and every `Localized`/`LocalizedRich` field in `src/content/*.ts` was checked
against the UI-REFACTOR-PROMPT §6 rubric (cut hedges, concrete nouns, active voice, no unsupported
adjectives, one idea per sentence). The original build prompt's own banned-word list was already applied
when the content was first written, so this pass found one real violation — the same slip made in both
languages — and otherwise confirmed the existing copy holds up against the rubric.

## Changes

| File | Locale | Before | After | Why |
|---|---|---|---|---|
| `src/content/services.ts` (preliminary facility assessment, `whatItIs[0]`) | en | "A **comprehensive** visual survey of the facility covering the building envelope..." | "A **systematic** visual survey of the facility, covering the building envelope..." | "Comprehensive" is a banned content-free adjective (README.md §1); "systematic" is the term the site already uses elsewhere (e.g. the Method page) and describes what actually happens — a structured procedure, not a vague completeness claim. |
| `src/content/services.ts` (same field) | ar | "مسح بصري **شامل** للمنشأة..." | "مسح بصري **منهجي** للمنشأة..." | Same fix, independently edited in Arabic (per §6.3, not a translation of the English change) — "شامل" (comprehensive) carries the same unsupported-completeness problem; "منهجي" (systematic/methodical) matches the term already used in `src/content/method.ts`. |

## What was checked and passed without changes

- All four `services.ts` entries, all five `method.ts` phases, all five `conditionScale.ts` grades, all three
  `caseStudies.ts` entries, all four `fieldNotes.ts` entries, `team.ts`, `faq.ts`, and `site.ts` — no hedges
  ("might", "could", "try to", "generally", "usually", "a range of"), no banned adjectives ("cutting-edge",
  "world-class", "seamless", "extensive experience"), and no vague category words standing in for a concrete
  term the content layer already had available.
- `messages/en.json` and `messages/ar.json` — UI chrome strings are short by nature and already imperative
  ("Send request" / "أرسل الطلب", not "Submit"); none read as filler.
- The About page's opening principle paragraph and the Method page's "preliminary vs. full" trust paragraph
  (both hardcoded in their respective `page.tsx` files) — already written in the direct, fact-first voice the
  rubric asks for.

No other strings were rewritten in this first pass. This is an edit pass, not a rewrite — copy that already worked was left alone.

---

## UI-OVERHAUL-V4 §10 pass — voice recalibration

The rubric pass above fixes hedging, which is a different failure mode from the one this pass addresses:
copy that has no hedge and no banned adjective, but is still too safely-scoped for a site that now opens
with a 15vw headline and a dark, confident art direction. Applied the three worked examples from
UI-OVERHAUL-V4 §10.4 directly, plus the equivalent independent edit in Arabic (§10.5 — not a translation of
the English change).

| File / key | Locale | Before | After | Why |
|---|---|---|---|---|
| `messages/*.json` → `services.intro` | en | "Four services, matched to what you need: a whole facility, one production line, a single machine, or recurring site presence." | "Four services. Nothing vague between them." | The exact §10.4 worked example — a long, softly-scoped sentence undersells a page that opens with oversized display type; short and declarative matches the register the layout now sets. |
| same key | ar | "أربع خدمات، بحسب ما تحتاج إليه: منشأة كاملة، خط إنتاج واحد، آلة مفردة، أو حضور ميداني متكرر." | "أربع خدمات. لا غموض بينها." | Same recalibration, edited natively in Arabic rather than translated from the English line. |
| `messages/*.json` → `home.heroSecondary` | en | "See how we work" | "See exactly what happens on site" | This is the site's one generic secondary link (Home → Method); "exactly" and "on site" name a real, visitable thing instead of a vague invitation, per the §10.4 "Learn more about our process" example. |
| same key | ar | "كيف نعمل" | "شاهد ما يجري في الموقع بالضبط" | Same recalibration, independently worded in Arabic. |
| `messages/*.json` → `contact.successBody` | en | "Reference number: {reference}. We'll get back to you within {hours} hours." | "Received, reference {reference}. We reply within {hours} hours." | Recalibrated toward the terser "Received. We reply within one working day." register from §10.4's worked example — but the reference number and the actual hour count are real, useful facts (not filler), so they were kept rather than dropped; only the throat-clearing "get back to you" phrasing was tightened to "reply," and "Received" replaces the softer implied opener. Deliberately **not** a literal copy of the example text, which would have discarded real information — see §10.4's own instruction not to force boldness onto a line by cutting substance. |
| same key | ar | "الرقم المرجعي: {reference}. سنعاود التواصل معك خلال {hours} ساعة." | "تم الاستلام، الرقم المرجعي {reference}. نرد خلال {hours} ساعة." | Same recalibration, independently worded in Arabic; "سنعاود التواصل" (a longer, more formal "we will follow up") tightened to "نرد" (we reply). |

### Checked and left unchanged

- The hero headline and the About page's opening line — explicitly named in §10.4 as already correct and
  not to be touched.
- Every string already covered by the first-pass rubric audit above (still holds; the voice-recalibration
  pass is additive, not a re-litigation of it).
- Remaining secondary links (`servicesLink`, `workLink`, `notesLink` — "See all services" / "See all case
  studies" / "See all field notes") were reviewed against the same rubric and left as-is: each already names
  a specific, concrete destination rather than offering a vague invitation, so none of them fail the test
  this pass applies.
