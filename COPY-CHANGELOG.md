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
