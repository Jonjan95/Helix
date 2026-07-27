# Living Helix

## Design question

Can the production Helix feel like a connected structure with restrained depth
and quiet organic presence without competing with portfolio content or reading
as an animation demonstration?

The desired result is spatial recognition rather than visual performance. A
visitor may notice that one rail passes in front of another, but should not
immediately notice an effect. Chapter state, content, and path continuity
remain more important than depth or ambient movement.

## Review boundary

- Reviewed baseline: merged PR #21 at
  `52af46e073f4248954ae525ebc6a10b5562a9513`.
- Production route only; `/lab/spatial` remains an isolated design reference.
- Chapter content, placement, pacing, laptop threshold, workspace handoff,
  global grid, typography, metadata, and links are outside this review.
- The SVG remains decorative, non-focusable, and hidden from assistive
  technology.
- Three.js, WebGL, canvas, particles, and new dependencies remain excluded.

## Baseline findings

### Existing SVG architecture

The merged path uses:

- one full-height decorative SVG with a `1000 × 5260` view box;
- one dotted vertical axis;
- two continuous Bézier rail paths using mirrored geometry;
- 18 horizontal rung lines;
- five chapter nodes and five connectors rendered outside the SVG by
  `HelixChapter`;
- one centralized path-introduction timeline and the existing five-state
  chapter model in `JourneyMotion`.

The baseline SVG contains 24 descendants: three groups, two paths, 19 lines,
no masks, and no circles. Five nodes remain separate HTML decoration associated
with the semantic chapter structure. No element has continuous ambient
animation.

Desktop and tablet show the complete two-rail SVG. Mobile replaces it with one
stable vertical CSS line beside the semantic document flow. Reduced motion
keeps the complete static desktop path and chapter state without a path
timeline, ScrollTrigger, or pin spacer.

### Observed limitations

The control is already restrained, continuous, and secondary to content.
Nodes and connectors provide clear chapter association, and the active state
is stronger than the structural path. Those qualities do not require repair.

Two specific limitations are visible:

1. Both rails remain uninterrupted at their crossings. Color and opacity
   differ, but neither rail visibly passes behind the other, so the intersection
   reads as two lines on one plane.
2. Rail weight and opacity are constant through the full path. The two curves
   establish the Helix silhouette, but do not alternate foreground and
   background roles. The result reads more like a technical diagram than a
   shallow spatial structure.

The horizontal rungs support continuity but currently share one uniform depth
treatment. They should remain quieter than nodes and content. The baseline
does not justify brighter rails, larger nodes, glow, path deformation, or a
project-branch redesign.

### Baseline measurements

- production JavaScript: 652,728 decoded bytes across seven chunks;
- Three.js signatures requested by `/`: zero;
- SVG descendants: 24;
- continuously animated Helix elements: zero;
- console warnings or errors: zero.

Baseline screenshots, a forward/reverse recording, and metrics are stored in
[`docs/media/living-helix/baseline`](media/living-helix/baseline).

## Candidate 1 — static layered depth

Candidate 1 reuses the two original Bézier definitions through SVG `<use>`
elements. Alternating vertical clip bands redraw one rail at a time as the
near layer. Five small crossing windows add a background-colored under-stroke
and then redraw only the foreground rail. This creates a narrow interruption
in the rear rail without circles, bubbles, filters, or duplicated geometry
definitions.

The base rails use a `1.1` non-scaling stroke. Near bands use `1.48`, and the
foreground line inside a crossing uses `1.55`. These small differences make
the alternation readable while remaining below the node, connector, and
content hierarchy. The 18 rungs and central axis remain structurally
unchanged and quieter than both rails.

Review evidence shows clearer foreground/background ownership at crossings
without making the path fragmented or materially louder. The path retains its
technical restraint while reading less like two flat lines.

Candidate 1 evidence and metrics are stored in
[`docs/media/living-helix/static`](media/living-helix/static).

## Candidate 2 — layered depth with ambient life

Candidate 2 retains the identical SVG structure and applies opposing opacity
ranges of `0.84–0.96` to the two near-rail groups over 26 seconds. It moves no
geometry, adds no scroll relationship, and creates no JavaScript loop. The
effect is disabled at 1024px and below, in forced colors, and under reduced
motion. Two elements animate when the evidence mode is active.

Deterministic frames captured 13 seconds apart confirm that the change is
extremely quiet. The comparison also shows that the movement adds little
spatial information beyond the static crossing hierarchy. Retaining a
continuous loop would therefore spend motion budget without improving
orientation, and would sit uncomfortably beside the design system's rejection
of idle pulsing.

Candidate 2 is not the production default. Its reproducible evidence remains
in [`docs/media/living-helix/ambient`](media/living-helix/ambient), including
two fixed animation states and a short recording.

## Crossing strategy

The chosen treatment uses five crossing definitions corresponding to the
existing shared-axis intersections. Each definition records the foreground
rail and y-coordinate once. A 68-unit clip window limits a five-pixel
background under-stroke to that local area, then a `1.55` foreground stroke
restores the near rail.

This is maintainable because crossing ownership is data rather than manually
drawn replacement curves. The original path geometry remains defined once per
rail. The gap follows the foreground curve, remains narrow at every responsive
scale, and does not create visible cut-out circles.

## Stroke strategy

The base layer preserves the complete silhouette at low contrast. Alternating
near bands add a small width and opacity increase. Rail A remains a restrained
warm neutral and Rail B retains the established quiet cyan, so the palette and
path identity do not change. Chapter state remains more prominent through the
existing node and connector rules.

No blur, glow, dash movement, gradient rail, filter, or path deformation is
used.

## Node strategy

The baseline nodes already communicate active, approaching, departing, passed,
and upcoming states clearly, so their markup and CSS are unchanged. Their
size, position, state model, connector treatment, semantic association, and
non-interactive behavior remain intact. Nodes do not pulse, float, or inherit
ambient motion.

## Ambient-motion decision

The chosen production result is static layered depth. The ambient candidate
proved technically inexpensive and visually restrained, but did not improve
the path enough to justify continuous motion. Production therefore has zero
continuously animated Helix elements.

The optional evidence mode remains isolated to a `data-helix-mode` override;
there is no visitor-facing control, runtime state, listener, ScrollTrigger, or
second owner.

## Responsive behavior

Desktop and compact desktop receive the full static layered hierarchy.
Crossings remain clean at 1440 × 1000 and 1280 × 800, and the marginally wider
near rail does not crowd headings or project evidence.

At 1024 × 768 the same static geometry remains readable, but ambient capability
is disabled. At the existing mobile composition boundary, including the
reviewed 768 × 1024 result, the full SVG remains hidden and the stable vertical
CSS path continues beside semantic content. The 390 × 844 and 360 × 800
presentations therefore add no crossing detail or continuous animation.

## Reduced motion and forced colors

Reduced motion keeps the full layered desktop SVG as a static structure,
creates no ambient animation, and preserves the existing static chapter
states. Mobile reduced motion retains the same vertical path.

Forced colors maps the SVG structure to `CanvasText`, uses `Canvas` for the
small crossing under-stroke, disables ambient capability, and degrades safely
if the depth contrast is flattened. Essential journey meaning remains in
semantic content and chapter state outside the SVG.

## Accessibility

The SVG remains `aria-hidden`, non-focusable, and text-free. Chapter content,
headings, links, order, nodes, and connectors remain outside the depth
implementation. Spatial hierarchy is decorative; losing it does not remove
journey meaning or active-state information. Keyboard flow, direct fragments,
and the single logical `h1` are unchanged.

## Architecture

`HelixPath` owns the finite SVG layer model:

1. source rail definitions;
2. complete low-contrast base rails;
3. existing rungs and axis;
4. alternating clipped near-rail bands;
5. five local crossing overlays.

`JourneyMotion` continues to target the existing base, rung, and near groups
for the one path-introduction timeline. It remains the only production
scroll-motion owner. The static depth system introduces no trigger and does
not alter chapter pacing, forward state, reverse state, or fragment
restoration.

## Performance findings

The chosen implementation adds SVG definitions, clip paths, and `<use>`
instances plus component-local CSS. It adds no runtime asset, dependency,
request, listener, client state, requestAnimationFrame loop, canvas, WebGL,
or per-node trigger.

Measured against the same built route:

| Metric | Baseline | Chosen |
| --- | ---: | ---: |
| Decoded production JavaScript | 652,728 bytes | 652,728 bytes |
| JavaScript chunks | 7 | 7 |
| SVG descendants | 24 | 65 |
| Continuously animated elements | 0 | 0 |
| Three.js signatures on `/` | 0 | 0 |
| Console warnings or errors | 0 | 0 |

The 41 additional SVG descendants are static definitions, clip rectangles,
groups, and `<use>` instances. There are still only two source path
definitions and 19 lines. No mask or filter is applied to the full-height SVG.

## Before, candidate, and chosen evidence

Matching evidence covers Environment, Engineering, Projects, Experience,
Continue, a representative crossing, compact desktop, laptop, tablet, mobile,
narrow mobile, reduced motion, forced colors, and forward/reverse travel:

- [`baseline`](media/living-helix/baseline) — merged PR #21;
- [`static`](media/living-helix/static) — Candidate 1;
- [`ambient`](media/living-helix/ambient) — Candidate 2;
- [`chosen`](media/living-helix/chosen) — final static production result,
  including a direct baseline comparison.

Evidence is documentation-only and is not imported by the runtime page.

## Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed; `/` remains statically generated.
- `npm run test:e2e` — passed, 34/34 Chromium tests.
- `npm run validate` — passed, including 34/34 Chromium tests.
- Chromium and WebKit release matrix — passed, 22/22 tests.
- Six approved viewport sizes — passed with no horizontal overflow.
- Forward and reverse chapter ownership — passed.
- Direct chapter fragments — passed.
- Reduced motion, forced colors, keyboard flow, and console safety — passed.

Firefox is not reported as passing. Its request-only check passed, while all
ten page-backed release checks failed inside Playwright
`browserContext.newPage` before application code executed. This reproduces the
existing runner limitation recorded by the Threshold review and is not treated
as either an application success or failure.

## Reviewer checklist

- Does the Helix feel less flat?
- Can you understand which rail passes in front?
- Does the path remain secondary to content?
- Is any movement noticeable immediately?
- Does it feel alive or merely animated?
- Does the path become tiring during long chapters?
- Are nodes still easy to associate with content?
- Is the static version preferable?
- Should the effect be reduced further?
- Does the baseline feel cleaner?

## Recommendation

**Keep the static layered-depth result.** It makes foreground/background
ownership legible while preserving the path's quiet role, existing geometry,
chapter-state hierarchy, mobile simplicity, reduced-motion completeness, and
production budget. Do not retain the ambient loop unless human review finds a
specific narrative benefit that is absent from the current evidence.
