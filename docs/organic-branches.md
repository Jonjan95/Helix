# Organic Branches

## Design question

Can the three Selected Projects feel structurally connected to the Helix
without making the chapter busier, more diagrammatic, or harder to read?

The desired result is belonging rather than decoration: the projects should
read as evidence growing from the journey, while the Helix remains the primary
spine and the project content remains the visitor's focus.

## Review boundary

- Reviewed baseline: merged PR #22 at
  `d95da1dcd52eef6cd37421d5e6824ab59d203045`.
- Selected Projects composition, project-to-Helix connectors, directly related
  CSS and decorative markup are inside the review.
- Project copy, status, repository links, chapter order, pacing, rail geometry,
  Living Helix depth, and every other chapter are outside it.
- Branches must remain decorative, non-focusable, and hidden from assistive
  technology.
- No new motion owner, per-project ScrollTrigger, dependency, runtime asset,
  canvas, WebGL, or Three.js use is permitted on `/`.

## Baseline findings

### Current layout and hierarchy

Selected Projects is one left-side chapter attached to the shared path through
one Projects node and one horizontal connector. Its semantic content is a
single `ProjectShowcase`: AI-Powered Test Engineer appears first as the
featured article, followed by CortexGrid and Helix as two supporting articles
stacked in document order.

The featured article already reads as primary. It uses the largest `h3`, cyan
metadata, a two-column narrative and evidence rhythm where width permits, and
the most breathing room. Supporting articles use smaller headings and neutral
metadata. Their stacked separators keep them distinct; they do not visually
merge into one card or compete with the featured project.

### Content width and whitespace

The chapter occupies the left content column of the three-column journey grid.
The central column is reserved for the Helix, node, and existing connector.
Project prose remains within editorial measure, and the open space between the
content edge and central path keeps the dense evidence legible.

That whitespace is also the missing relationship. The existing connector
establishes that the chapter belongs to the Projects node, but it resolves at
the chapter level. Each project begins with a full-width separator and reads
primarily as content positioned beside the Helix rather than evidence emerging
from it.

### Responsive baseline

- Desktop preserves the strongest hierarchy and generous central whitespace.
- Compact desktop keeps the same composition, with less room for any added
  geometry.
- At 1024px the featured evidence collapses to one column before becoming
  cramped.
- Tablet and mobile use the established single-column reading order beside the
  simplified vertical path.
- Mobile already prioritises semantic order and touch-safe repository links;
  a full tree treatment would compete with that clarity.

### Baseline conclusion

The chapter is already strong and does not need a card redesign, new pacing,
or stronger visual emphasis. The focused opportunity is to use the existing
central whitespace for one quiet decorative branch relationship per project.
The branch treatment should not reduce content width, cross copy, or weaken
the featured/supporting hierarchy.

Baseline screenshots, metrics, and forward/reverse evidence are stored in
[`docs/media/organic-branches/baseline`](media/organic-branches/baseline).

## Branch architecture

Each existing project article owns one decorative `span` containing one
shallow SVG path. The path begins at the article's top separator and extends
only through the open strip toward the shared spine. Markup stays local to
`ProjectShowcase`; no branch enters `HelixPath`, and no project receives a
journey node or state.

The three spans use stable `data-project-branch` hooks for evidence and
outcome-based testing. They are `aria-hidden`, their SVGs are non-focusable,
and they contain no text, links, or controls. Semantic project order remains
the order of the three articles.

## Branch origin

The existing Projects node remains the sole chapter origin. The chapter's
existing connector still establishes node ownership. Each new curve occupies
the remaining content-to-spine space at its article separator, creating three
local offshoots without a shared vertical trunk, arrow, or second timeline.

The spine-side end has no new node marker. A small open anchor at the article
edge makes the visual attachment precise without competing with the real
Projects node.

## Featured branch treatment

AI-Powered Test Engineer receives the longest, clearest relationship: a
restrained cyan path, slightly stronger stroke, and slightly clearer article
anchor. Its geometry stays shallow and does not cross the heading, summary, or
evidence.

## Supporting branch treatment

CortexGrid and Helix use the same curve vocabulary with lower-opacity warm
neutral strokes and smaller anchors. They remain easy to locate but do not
compete with the featured branch or active chapter node. Their existing
stacked separators continue to distinguish the two supporting articles.

## Candidate 1 — static branches

All three connections are present whenever Projects is visible. The candidate
adds no animation, state transition, or delayed information. Forward and
reverse travel therefore preserve the same project-to-spine relationship,
while the existing chapter opacity and node state continue to communicate
journey ownership.

The static result improved belonging without asking the visitor to notice a
new event. It remained subordinate to headings and evidence at desktop,
compact desktop, tablet, and mobile.

## Candidate 2 — restrained chapter reveal

Candidate 2 uses the identical markup and geometry. A CSS-only evidence mode
reads the existing Projects `data-journey-state`: branches begin shortened and
quiet, extend while approaching, and reach their full static state when the
chapter is active. The relationship reverses through the same chapter state.

It adds no local JavaScript, ScrollTrigger, timeline, event listener, or motion
owner. Reduced motion overrides the candidate to the complete static state.

The reveal was visually controlled, but it did not clarify ownership beyond
the already-active Projects node and connector. It added another state change
at the chapter with the highest information density, making the implementation
less silent without improving the evidence.

## Motion decision

**Candidate 1, static branches, is the production result.** Candidate 2 is
retained only as a reproducible evidence mode. Static geometry communicates
the relationship immediately, costs no motion budget, works identically in
both scroll directions, and matches the Living Helix decision to prefer useful
depth over ambient performance.

## Responsive behaviour

- Desktop uses the full shallow curve inside the content-to-spine strip.
- Compact desktop preserves the same relationship without reducing content
  width.
- At 1024px and tablet widths, branch reach and contrast reduce before the
  evidence column becomes cramped.
- Mobile moves a very short static stub to the left of each article, between
  the existing vertical path and semantic content. It does not reproduce a
  desktop tree beside the narrow reading column.
- Project order, heading hierarchy, repository links, and native scrolling are
  unchanged at every width.

## Reduced motion

All three branches are immediately visible as static geometry. Transitions and
transforms are removed, no content is hidden, and no pin or branch-specific
motion is created. The existing complete static journey remains the source of
truth.

## Forced colors

Branch strokes map to `CanvasText`, and the small article anchors use `Canvas`
for their interior. If color hierarchy flattens, semantic project order and
the existing featured heading hierarchy still communicate priority.

## Accessibility

The project articles, `h3` headings, evidence lists, and repository links are
unchanged. Branch spans are `aria-hidden`, SVGs are non-focusable, and the
geometry contains no labels or interactions. Nothing about project identity,
order, featured status, or destination depends on following a curve.

## Performance

The selected implementation adds three spans, three inline SVGs, and three
paths—six SVG descendants in total. It adds no request, asset, dependency,
JavaScript, state, listener, rendering loop, filter, mask, canvas, WebGL, or
Three.js use.

| Metric | Baseline | Chosen |
| --- | ---: | ---: |
| Decoded production JavaScript | 652,728 bytes | 652,728 bytes |
| JavaScript chunks | 7 | 7 |
| Decorative branch spans | 0 | 3 |
| Branch SVG descendants | 0 | 6 |
| Branch focusable elements | 0 | 0 |
| Three.js signatures on `/` | 0 | 0 |
| Console warnings or errors | 0 | 0 |

## Before and after evidence

Matching evidence covers Projects approach, the featured project, both
supporting projects, the full chapter, compact desktop, tablet, mobile,
reduced motion, forced colors, and forward/reverse travel:

- [`baseline`](media/organic-branches/baseline) — merged PR #22;
- [`static`](media/organic-branches/static) — Candidate 1;
- [`reveal`](media/organic-branches/reveal) — Candidate 2, including
  approaching, active, and reverse states;
- [`chosen`](media/organic-branches/chosen) — final static production result.

Evidence is documentation-only and is not imported by the production route.

## Validation

- `npm run lint` — passed with no warnings.
- `npm run typecheck` — passed.
- `npm run build` — passed; `/` remains statically generated.
- `npm run test:e2e` — passed, 36/36 Chromium tests.
- `npm run validate` — passed, including the complete 36-test Chromium suite.
- Chromium and WebKit release checks — passed, 22/22 combined.
- All six approved viewport sizes — passed with no horizontal overflow.
- Forward and reverse chapter ownership — passed.
- Direct fragments, reduced motion, forced colors, keyboard flow, repository
  links, and console safety — passed.

Firefox is available but is not reported as passing. Its request-only release
check passed; all ten page-backed checks failed inside Playwright
`browserContext.newPage` with the existing internal `_page` runner error before
application code executed. This reproduces the limitation already documented
by the Living Helix review and is not treated as application evidence.

## Reviewer checklist

- Do projects feel connected to the Helix?
- Is the featured project clearly primary?
- Are supporting projects still easy to find?
- Do branches feel organic or diagrammatic?
- Do connectors compete with text?
- Is the chapter calmer or busier?
- Does the Projects node still feel like one journey stop?
- Is motion useful or unnecessary?
- Does mobile remain readable?
- Is the baseline cleaner?

## Recommendation

**Keep the static branches.** They strengthen the project-to-journey
relationship without changing content, reducing whitespace, creating another
timeline, or adding motion. Revisit only if human review finds that the curves
read as connector decoration before they read as project attachment.
