# Living Helix

## Design question

Can the production Helix feel like a connected structure with restrained depth
and quiet organic presence without competing with portfolio content or reading
as an animation demonstration?

The desired result is spatial recognition rather than visual performance. A
visitor may notice that one rail passes in front of another, but should not
immediately notice a looping effect. Chapter state, content, and path
continuity remain more important than depth or ambient movement.

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

The horizontal rungs support continuity but currently share one uniform
depth treatment. They should remain quieter than nodes and content. The
baseline does not justify brighter rails, larger nodes, glow, path deformation,
or a project-branch redesign.

### Baseline measurements

- production JavaScript: 652,728 decoded bytes across seven chunks;
- Three.js signatures requested by `/`: zero;
- SVG descendants: 24;
- continuously animated Helix elements: zero;
- console warnings or errors: zero.

Baseline screenshots, a forward/reverse recording, and metrics are stored in
[`docs/media/living-helix/baseline`](media/living-helix/baseline).

## Candidate 1 — static layered depth

Candidate 1 will test a maintainable front/back hierarchy with no continuous
movement. It may use layered segments or crossing masks, small stroke-width
and opacity differences, and restrained rung depth. It must reuse the existing
geometry, preserve chapter state, and degrade harmlessly in forced colors.

The candidate succeeds only if crossings become easier to read without making
the Helix louder or visually fragmented.

## Candidate 2 — layered depth with ambient life

Candidate 2 will retain the same static depth model and add the smallest
credible ambient change. The evaluation will compare a very slow, low-amplitude
depth emphasis with Candidate 1. It may not deform the geometry visibly,
introduce scroll ownership, create a render loop, or run on mobile or under
reduced motion.

A static result remains valid and may be preferred. Ambient movement will not
be retained merely because it can be implemented.

## Crossing strategy

Pending candidate review. The preferred direction is a small number of
maintainable crossing windows derived from the existing geometry, with the
rear rail interrupted only enough for the foreground rail to read clearly.
The treatment must not create visible bubbles, dots, or transit-map joints.

## Stroke strategy

Pending candidate review. Depth differences must remain below chapter-state
emphasis. The near rail may be marginally wider and clearer; the rear rail must
remain continuous enough to preserve the journey.

## Node strategy

The baseline nodes already communicate active, approaching, departing, passed,
and upcoming states clearly. Candidate work should preserve their size,
position, state model, and non-interactive behavior. Any change must improve
their connection to the layered path without producing halos, pulses, or
independent floating motion.

## Ambient-motion decision

Undecided until static and ambient candidates have matching evidence. The
review will prefer silence when movement does not materially strengthen the
spatial reading.

## Responsive and reduced-motion boundary

Desktop may receive the complete crossing hierarchy. Compact desktop is a
high-priority noise check. Tablet may simplify crossing detail. Mobile keeps a
stable, static vertical path and receives no ambient animation. Reduced motion
keeps a polished static depth result with all semantic content and chapter
state available in document order.

## Performance boundary

The implementation may add SVG structure and CSS but no runtime asset,
dependency, requestAnimationFrame loop, canvas, WebGL, or per-node trigger.
Production JavaScript, SVG DOM growth, animated-element count, console output,
and Three.js isolation will be measured against the baseline above.

## Evidence plan

Matching evidence will cover Environment, Engineering, Projects, Experience,
Continue, a representative crossing, compact desktop, laptop, tablet, mobile,
narrow mobile, reduced motion, forced colors, and forward/reverse travel.
Candidate evidence is design-review material and is not imported by the
runtime page.

## Reviewer checklist

- Does the Helix feel less flat?
- Can you understand which rail passes in front?
- Does the path remain secondary to content?
- Is any movement noticeable immediately?
- Does the result feel alive or merely animated?
- Does the path become tiring during long chapters?
- Are nodes still easy to associate with content?
- Is the static candidate preferable?
- Should the effect be reduced further?
- Does the baseline feel cleaner?

## Recommendation

**Undecided.** Baseline evidence is complete. A keep, revise, or revert
recommendation requires matched static and ambient candidate review.
