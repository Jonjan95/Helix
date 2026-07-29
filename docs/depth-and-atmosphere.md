# Depth & Atmosphere

## Design question

Can subtle atmospheric separation make the journey feel more dimensional and
intentional while preserving Helix's restrained graphite, warm-white, and cyan
identity?

## Review boundary

- Reviewed baseline: merged PR #23 at
  `999102ad34f72a23664901e9edcf41f2e047701b`.
- Page-level and journey-level atmosphere, threshold background continuity,
  directly related tokens, CSS, tests, evidence, and documentation are in
  scope.
- Content, chapter order and pacing, `JourneyMotion`, laptop and Helix
  geometry, rail crossings, Organic Branches, layouts, links, metadata,
  dependencies, and `/lab/spatial` are outside the review.
- The atmosphere must remain decorative, mostly static, responsive,
  removable, and unnecessary for understanding.

## Baseline findings

### Existing field

The page body uses the design-system graphite `#121416`. The complete workspace
uses one slightly cooler `#111719` surface with a low-opacity cyan grid. A
single top pseudo-element softens the Arrival handoff before becoming
transparent. The shared Helix, nodes, connectors, branches, and semantic
content all sit over this same field.

### What already works

- The background is dark, calm, and free from decorative glow.
- The laptop threshold releases without a hard seam.
- The grid is quiet and consistent.
- Warm-white content and muted supporting text remain readable.
- The Living Helix crossings and Organic Branches retain clear hierarchy.
- Mobile and reduced motion are complete without atmosphere-specific logic.

### Actual limitations

The uniform field makes the long journey read as one shallow plane. Content,
Helix, and empty space have little tonal separation, particularly through the
dense Projects and Experience chapters. The threshold's faint screen
luminance settles completely at the top of the workspace, and Continue ends
against almost the same field as the middle chapters.

These are subtle composition limitations, not reasons for a background
redesign. The baseline does not justify brighter content surfaces, chapter
cards, glow, texture, or new motion.

Baseline screenshots, metrics, and forward/reverse evidence are stored in
[`docs/media/depth-atmosphere/baseline`](media/depth-atmosphere/baseline).

## Candidate 1 — static spatial wash

Pending comparison.

## Candidate 2 — state-responsive focus

Pending comparison.

## Threshold-continuity experiment

Pending comparison.

## Chosen atmospheric model

Pending comparison.

## Global wash

Pending comparison.

## Local focus

Pending comparison.

## Chapter-specific observations

Pending comparison.

## Color and gradient decisions

Pending comparison.

## Motion decision

Pending comparison.

## Responsive behaviour

Pending implementation.

## Reduced motion

Pending implementation.

## Forced colors

Pending implementation.

## Accessibility

Pending implementation.

## Performance

Pending measurement.

## Tokens

Pending implementation.

## Before and after evidence

Pending candidate review.

## Rejected treatments

Pending candidate review.

## Reviewer checklist

- Does the page feel deeper?
- Is the background effect noticeable before the content?
- Does the Helix remain secondary?
- Does the laptop threshold feel better connected to the workspace?
- Do Projects and Experience feel easier to separate from the background?
- Does Continue feel calmer?
- Are any gradients visibly obvious?
- Does the atmosphere feel refined or decorative?
- Is the page still dark enough?
- Is the baseline cleaner?
- Should the atmosphere be reduced?

## Recommendation

Pending comparison: **revise**.
