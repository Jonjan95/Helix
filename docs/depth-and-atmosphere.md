# Depth & Atmosphere

## Design question

Can subtle atmospheric separation make the journey feel more dimensional and
intentional while preserving Helix's restrained graphite, warm-white, and cyan
identity?

The intended response is that the page feels more composed, not that its
background has acquired an effect.

## Review boundary

- Reviewed baseline: merged PR #23 at
  `999102ad34f72a23664901e9edcf41f2e047701b`.
- Page-level and journey-level atmosphere, threshold background continuity,
  directly related tokens, CSS, tests, evidence, and this document were in
  scope.
- Content, chapter order and pacing, `JourneyMotion`, laptop and Helix
  geometry, rail crossings, Organic Branches, layouts, links, metadata,
  dependencies, and `/lab/spatial` remained outside the review.
- Atmosphere is decorative, static, responsive, removable, and unnecessary for
  understanding.

## Baseline findings

### Existing field

The page body uses the design-system graphite `#121416`. The complete workspace
uses one slightly cooler `#111719` surface with a low-opacity cyan grid. A
single top pseudo-element softens the Arrival handoff before becoming
transparent. The shared Helix, nodes, connectors, branches, and semantic
content all sit over this same field.

### What already worked

- The background was dark, calm, and free from decorative glow.
- The laptop threshold released without a hard seam.
- The grid was quiet and consistent.
- Warm-white content and muted supporting text remained readable.
- Living Helix crossings and Organic Branches retained clear hierarchy.
- Mobile and reduced motion were complete without atmosphere-specific logic.

### Actual limitation

The uniform field made the long journey read as one shallow plane. Content,
Helix, and empty space had little tonal separation, particularly through
Projects and Experience. The threshold's faint screen luminance settled
completely at the top of the workspace, and Continue ended against almost the
same field as the middle chapters.

These were subtle composition limitations, not reasons for a background
redesign. The baseline did not justify cards, glow, texture, or new motion.

[Baseline screenshots, metrics, and recording](media/depth-atmosphere/baseline)
preserve the untouched comparison.

## Candidate 1 — static spatial wash

Candidate 1 added one broad, non-interactive journey pseudo-element. Two
elliptical surface shifts separate the middle and later reading regions from
the outer field; a shallow terminal falloff lets Continue settle without
fading to black.

The wash has no visible boundary, center point, panel shape, fixed positioning,
or animation. It is deliberately difficult to identify in isolation but
improves spatial separation in matched comparisons. Projects and Experience
benefit most because their longer evidence blocks no longer share exactly the
same apparent plane as the full viewport.

[Static candidate evidence](media/depth-atmosphere/static).

Decision: **retain**, with a simpler mobile treatment.

## Candidate 2 — state-responsive focus

Candidate 2 tested a large, soft chapter pseudo-surface driven only by the
existing `data-journey-state` values. It added no scroll controller, but its
value was limited: at a safe opacity the improvement over the static wash was
minor, while stronger values began to resemble a spotlight and made reverse
state changes more noticeable than the content hierarchy.

[State-responsive evidence](media/depth-atmosphere/focus).

Decision: **reject**. All candidate focus CSS was removed from production.
There is no local atmospheric state, transition, or dormant focus layer.

## Threshold-continuity experiment

The existing finite top handoff surface now carries an extremely small amount
of cyan-derived luminance behind the early workspace. It uses the same surface
that already concealed the threshold boundary; it does not change threshold
timing, pinning, identity behavior, grid strategy, or layout.

The contribution settles within the existing top surface and is absent from
later chapters. It reads as a source relationship with the laptop screen
rather than a page-wide cyan cast.

[Threshold continuity evidence](media/depth-atmosphere/threshold).

Decision: **retain**.

## Chosen atmospheric model

The production result uses two existing architectural surfaces:

1. the journey background and its single static spatial wash;
2. the existing finite threshold handoff surface, with a small residual light
   contribution.

The semantic and decorative journey hierarchy remains unchanged above these
surfaces. No element was added to the DOM. The root's
`data-atmosphere-model="static-depth"` attribute documents the selected model
and provides a stable outcome-oriented test hook.

## Global wash

The global wash is broad enough that it cannot be read as a chapter card or
spotlight. It remains behind the Helix and content, does not alter text
contrast, and avoids pure black. Its final falloff is shallow so Continue
feels calmer without creating a terminal curtain.

## Local focus

No local focus treatment is present. Chapter ownership continues to be
communicated by content opacity, nodes, connectors, and the centralized
journey state. Atmosphere does not compete with that hierarchy.

## Chapter-specific observations

- **Arrival / Environment:** the finite threshold surface makes the first
  workspace frames feel sourced from the screen while retaining the clean
  handoff established by PRs #20 and #21.
- **Engineering:** the field stays quiet; no separate chapter treatment was
  justified.
- **Projects:** the broad wash provides slight separation behind dense project
  evidence without changing branches, cards, or rail contrast.
- **Experience:** the second broad surface supports the long reading interval
  without dividing tracks into panels.
- **Continue:** cyan does not increase. A small graphite falloff lets the
  composition settle while the path remains visible and open.

No chapter receives a unique color or atmospheric ownership rule.

## Color and gradient decisions

All atmosphere derives from existing colors:

- the raised graphite surface supplies the broad spatial wash;
- a darker graphite mixture supplies the ending falloff;
- the existing cyan accent supplies the threshold residual at very low alpha.

No new accent color, pure-black boundary, saturated cyan, image, texture,
noise, blur, or shadow was introduced.

The gradients use broad elliptical shapes and distant stops. They exist only
to express depth; none moves, follows input, or forms a visible content panel.

## Motion decision

The chosen atmosphere is completely static. State-responsive focus was
rejected, and slow ambient motion was not implemented because the static
candidate already solved the limited composition problem. Forward and reverse
scrolling therefore produce the same atmospheric composition with no
additional timing or ownership.

## Responsive behaviour

- **Desktop and compact desktop:** receive the complete static wash and finite
  threshold continuity.
- **Tablet:** retains the broad surface without chapter-local treatment.
- **Mobile:** replaces the elliptical washes with one simple vertical tonal
  variation. It adds nothing around the vertical path and does not respond to
  chapter state.

The atmosphere does not affect sizing, positioning, overflow, or touch
scrolling.

## Reduced motion

Reduced motion receives the complete static composition. The atmosphere has no
animation of its own, does not transition with chapter state, hides no content,
and creates no pin spacer or motion owner.

## Forced colors

Both decorative pseudo-surfaces are removed in forced-colors mode. System
colors, semantic content, focus, and the existing forced-color Helix treatment
remain responsible for hierarchy.

## Accessibility

- Atmospheric surfaces are CSS pseudo-elements with no accessible content.
- They use `pointer-events: none` and cannot receive focus.
- No semantic order, heading, article, list, link, or focus behavior changed.
- Contrast and comprehension do not depend on the washes.
- Reflow does not gain a fixed or independently sized layer.

## Performance

Matched production measurements:

| Measure | Baseline | Chosen | Delta |
| --- | ---: | ---: | ---: |
| Decoded JavaScript | 652,728 B | 652,728 B | 0 B |
| Decoded CSS | 42,399 B | 43,237 B | +838 B |
| JavaScript chunks | 7 | 7 | 0 |
| Stylesheet chunks | 2 | 2 | 0 |
| Atmospheric DOM elements | 0 | 0 | 0 |
| Focusable atmospheric elements | 0 | 0 | 0 |
| Journey motion owners | 1 | 1 | 0 |
| Three.js signatures on `/` | 0 | 0 | 0 |

The implementation adds no dependency, asset, client state, event listener,
filter, canvas, WebGL, or runtime JavaScript. Both baseline and chosen captures
reported no browser console warnings or errors.

## Tokens

- `--color-atmosphere-surface`: transparent raised-graphite contribution for
  broad spatial separation.
- `--color-atmosphere-shadow`: transparent dark graphite for the restrained
  terminal falloff.
- `--color-atmosphere-threshold`: extremely low-alpha existing cyan for the
  finite screen-to-workspace relationship.

The tokens describe reusable roles rather than chapter-specific values.

## Before and after evidence

- [Untouched baseline](media/depth-atmosphere/baseline)
- [Candidate 1 — static spatial wash](media/depth-atmosphere/static)
- [Candidate 2 — state-responsive focus](media/depth-atmosphere/focus)
- [Threshold continuity](media/depth-atmosphere/threshold)
- [Chosen result, metrics, and recording](media/depth-atmosphere/chosen)

Matching baseline and chosen sets include Arrival, all journey regions, the
ending, compact desktop, tablet, mobile, reduced motion, forced colors, and
forward/reverse recordings.

## Rejected treatments

- Chapter-local or state-responsive light: too little benefit before it began
  to suggest a spotlight.
- Continuous ambient movement: unnecessary and contrary to the calm baseline.
- Per-chapter colors or panels: would fragment the continuous journey.
- Cyan fog, glow, texture, noise, blur, and fixed full-screen layers: exceed
  the design question and performance boundary.
- Helix opacity changes: unnecessary; the existing path hierarchy remains
  legible over the selected backdrop.

## Known limitations

- The improvement is intentionally subtle and may be imperceptible on
  poorly calibrated dark displays.
- CSS gradient rendering can vary slightly between browser engines.
- Atmosphere does not solve content-density or pacing concerns; those remain
  owned by their existing systems and were outside this PR.

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

The intended review outcome is “yes” to depth, continuity, hierarchy, and
darkness; “no” to obvious gradients or decorative attention. If the wash is
noticed before content, it should be reduced rather than expanded.

## Recommendation

**Keep.** The static wash and finite threshold residual provide the smallest
useful improvement. The state-responsive candidate and all independent
atmospheric motion remain rejected.
