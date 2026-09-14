# Copy audit — FIX-AND-POLISH-V3 §1.3

## Method

Every string in `messages/ar.json` and `messages/en.json`, and every
`Localized`/`LocalizedRich` field in `src/content/*.ts` (`site.ts`,
`services.ts`, `method.ts`, `faq.ts`, `team.ts`, `fieldNotes.ts`,
`caseStudies.ts`, `conditionScale.ts`, `assessmentTiers.ts`,
`surveyPins.ts`), was read in full — not sampled — and checked against
this rubric:

1. Cut hedges ("we try to", "in most cases", "may help").
2. Prefer the concrete named thing over a vague category word.
3. Active voice, one actor per sentence.
4. Delete unsupported adjectives ("comprehensive", "world-class").
5. Recalibrate flat/generic lines to the site's confident, declarative
   register.

A `grep -riE` pass for the standard marketing-hedge vocabulary
(`we try to`, `in most cases`, `may help`, `comprehensive`,
`world-class`, `state-of-the-art`, `cutting-edge`, `best-in-class`,
`a range of`, `a variety of`, `innovative`, `holistic`, `robust
solution`, `leading provider`, `committed to`, `passion`, `striving`,
`our goal is to`, `trusted by`, `excellence`, `unparalleled`,
`unmatched`, `top-notch`, `first-class`, and their Arabic equivalents
`نحاول` / `قد يساعد` / `في معظم الحالات` / `شامل` / `عالمي المستوى`)
was run across `src/content/` and `messages/` as a second, independent
check.

## Result

**Zero violations found. Zero strings changed.**

The `grep` pass returned no matches. The manual read confirms why: every
line already states what actually happens, in the active voice, with a
named concrete thing where a category word would otherwise sit —
e.g. `services.ts`'s `svc-preliminary.whatItIs` names "the building
envelope, infrastructure, and principal production lines" rather than
"our facilities," and `home.closingBody` commits to "within two working
days" rather than "as soon as possible." `services.intro` ("Four
services. Nothing vague between them." / "أربع خدمات. لا غموض بينها.")
is already the exact register this rubric asks new copy to be
recalibrated toward, not an outlier that needs recalibrating.

Two lines were reviewed closely as the nearest candidates for a hedge
and kept as-is, with the reasoning:

- `method.referencesBody` — "recognised vibration and
  condition-monitoring standards (such as the ISO 10816 / 20816
  series)": "recognised" modifies a standard that is then named
  explicitly in the same clause. It is not standing in for a missing
  specific, so it is not the hedge pattern rule 1 targets.
- `notFound.body` / `error.body` — plain, short system-utility copy
  ("The page you are looking for does not exist or has moved."). This
  register is deliberately neutral rather than declarative because it
  is a system message, not site voice; recalibrating it to the display
  register would be out of place next to a 404.

No entries are listed below because none of the audited copy required a
before/after change.

## Second pass — Content Correctness, Typography, Imagery & Verification Pass (Task 1.11)

Re-ran both checks (full manual read of `messages/ar.json` / `messages/en.json`
and every `Localized`/`LocalizedRich` field in `src/content/*.ts`, plus the
independent `grep -riE` hedge-vocabulary sweep) after this pass's Phase 1
factual fixes and Phase 3 image work, since both added new copy that the
first pass never saw:

- The reworked homepage stats block (`src/app/[locale]/page.tsx`): the new
  "Expected response time" fact, the World Bank attribution/range caption
  under the $216bn figure, and the "No international assessment firm
  maintains a permanent field presence in Syria" sentence (Tasks 1.3–1.5).
- 25 new bilingual image `alt` strings written for the real photography
  that replaced every `picsum.photos` placeholder (Task 3.2, see
  [MEDIA-GUIDE.md](MEDIA-GUIDE.md)).

The `grep` sweep still returns zero matches. The manual read found no rule
violations in either the reworked stats block or the new alt text — the
stats block states a sourced range and a measured figure rather than a bare
claim, and the alt strings name the concrete subject of each photograph
(hard hat colour, machine condition, specific action) rather than a generic
label like "team photo" or "industrial equipment."

**Zero further violations found. Zero strings changed in this pass.**
