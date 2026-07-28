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

To be completed after candidate review.

## Branch origin

To be completed after candidate review.

## Featured branch treatment

To be completed after candidate review.

## Supporting branch treatment

To be completed after candidate review.

## Candidate 1 — static branches

To be completed after review.

## Candidate 2 — restrained chapter reveal

To be completed after review.

## Motion decision

To be completed after comparison.

## Responsive behaviour

To be completed after implementation.

## Reduced motion

To be completed after implementation.

## Forced colors

To be completed after implementation.

## Accessibility

To be completed after implementation.

## Performance

To be completed after measurement.

## Before and after evidence

To be completed after candidate review.

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

Pending candidate comparison: **revise**.
