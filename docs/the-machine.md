# The Machine

## Design question

Can the laptop become a convincing physical workstation without competing
with its screen, imitating a real product, or changing the accepted Threshold
choreography?

This review answers with a restrained CSS construction. The workstation is
not intended to be photorealistic. Its job is to establish a believable
object at Arrival, carry Jonathan's semantic identity toward the visitor, and
then recede cleanly when the screen becomes the workspace.

## Baseline limitations

The merged PR #26 baseline communicated “laptop” immediately, but the object
read primarily as a framed display above a thin horizontal strip. The screen
was already strong; the physical construction around it was not.

The baseline review identified five limitations:

- the lower silhouette did not describe a keyboard deck or working surface;
- the hinge relationship was implied only by proximity;
- shell, screen, and base had similar material weight and little edge depth;
- the contact shadow floated below the display rather than grounding a whole
  machine;
- the close view exposed the object as a small set of flat CSS rectangles.

The screen proportions, identity hierarchy, Threshold depth separation, and
flat semantic text strategy were already effective and did not require a new
concept.

Baseline evidence is stored in
[`docs/media/the-machine/before`](media/the-machine/before).

## Candidates considered

### Candidate 1 — Minimal precision

This direction establishes the revised lid, hinge rail, shallow deck plane,
front edge, and contact shadow but removes the keyboard suggestion, trackpad,
hinge caps, and small deck indicator.

It has the calmest silhouette and is clearly more physical than the baseline.
At the full Arrival scale, however, the uninterrupted deck surface can still
read as a geometric platform rather than a workstation. Its restraint removes
some of the evidence that explains the new plane.

### Candidate 2 — Refined workstation

This direction uses the same silhouette and adds four low-contrast cues: a
finite key field, trackpad outline, paired hinge caps, and a two-pixel cyan
deck indicator. None carries content or interaction. The details are visible
in the close view and quiet at the normal Arrival distance.

The candidate feels more constructed without becoming busy. It avoids brand
signatures, individual key legends, ports, logos, speaker grilles, glossy
reflection, coloured glow, and decorative hardware detail.

The candidate comparison is stored as
[`10-candidate-minimal-precision.png`](media/the-machine/after/10-candidate-minimal-precision.png)
and
[`11-candidate-refined-workstation.png`](media/the-machine/after/11-candidate-refined-workstation.png).
The comparison is generated only by the repository evidence script; there is
no public candidate switch or runtime mode.

## Chosen direction

**Refined workstation** is selected.

Its additional detail has a clear job: it makes the lower plane readable as a
working surface. The screen remains the dominant rectangle, Jonathan's name
remains the dominant content, and the physical cues disappear together through
the existing handoff. At mobile sizes the details are removed, so the choice
does not force desktop complexity into a narrow composition.

## Geometry and material changes

### Display assembly

- The maximum workstation width moves from `48rem` to `49rem`, retaining the
  existing contained hero scale.
- The screen changes from `16 / 9.65` to `16 / 9.8`, producing a slightly
  calmer display proportion without imitating a named product.
- Bezel padding now distinguishes the lower edge from the top and sides.
- A neutral lid gradient, inset edge, and quieter shell shadow describe
  material thickness without gloss.
- The camera remains a single restrained point and receives only a fine
  neutral edge.

### Hinge and base

- A central hinge rail connects the display to the deck. Its caps are visible
  only when the composition can support them.
- The former thin base becomes a shallow perspective deck with a separate
  front edge.
- A low-contrast repeated grid suggests keys without rendering key labels or
  dozens of DOM elements.
- A simple trackpad outline defines the hand-rest area.
- The contact shadow belongs to the front edge, grounding the complete object
  rather than making the display appear to float.

The construction uses normal HTML elements and CSS. No SVG was necessary:
the relevant forms are planes, edges, and repeated key spacing, all of which
remain clearer and cheaper in CSS.

## Responsive simplification

### Desktop

Desktop receives the complete refined-workstation treatment. Detail remains
low contrast and subordinate to the screen at 1440 × 1000 and 1280 × 800.

### Laptop and tablet landscape

At compact heights between 48rem and 64rem wide, the hero uses a `42rem`
workstation stage and tighter vertical rhythm. This keeps the rebuilt base from
unnecessarily displacing the semantic introduction at 1024 × 768. The camera
profile, scroll distance, and Threshold timing do not change.

### Tablet portrait

At 768 × 1024 the full silhouette remains, but hinge caps and the deck accent
are removed and the key field becomes quieter. The screen retains visual
priority.

### Mobile

At 390 × 844 and 360 × 800, keyboard, trackpad, hinge caps, and deck accent are
removed. The simplified lid, hinge rail, deck plane, front edge, and contact
shadow preserve one readable object. Mobile remains unpinned and uses normal
document flow.

No reviewed viewport gained horizontal overflow.

## Text-rendering strategy

Jonathan's name, location, and status remain real semantic HTML inside
`screenIdentity`. That wrapper remains a flat sibling of the decorative
`screenDepth` wrapper. It receives no scale, `translateZ`,
`transform-style: preserve-3d`, filter, blur, or forced layer promotion.

The complete workstation still moves through the accepted camera transform,
but the identity is not independently enlarged inside a 3D subtree. It stays
crisp through the readable initial, early, and midpoint states, then the
existing opacity-only departure removes it before the final high-scale phase.
Reverse travel restores the same unscaled HTML.

The workstation details are descendants of `aria-hidden="true"` surfaces,
contain no focusable element, and never replace the single logical `h1`.

## Threshold impact

The rebuilt geometry required no change to `JourneyMotion` or its centralized
configuration.

The following accepted values and relationships are preserved:

- one `JourneyMotion` owner;
- one desktop/tablet Arrival pin and no mobile pin;
- 1,150 px desktop pin distance at 1440 × 1000;
- existing camera scale calculation and maximums;
- existing identity departure, Threshold arrival, shell fade, and base travel;
- existing sequential screen-grid/workspace-grid handoff;
- native forward and reverse scrolling;
- complete static reduced-motion flow.

The screen bounds still drive the camera destination. The larger base remains
inside the same laptop root and uses the existing `laptop-base` target, so it
recedes with the accepted handoff instead of creating a second transition.

## Evidence

Matched screenshots are stored in:

- [before](media/the-machine/before);
- [after](media/the-machine/after).

Both sets contain:

1. initial Arrival;
2. laptop close view;
3. early approach;
4. Threshold crossing;
5. workspace reveal;
6. compact desktop;
7. tablet;
8. mobile;
9. reduced motion.

The chosen forward-and-reverse recording is
[`12-forward-reverse.webm`](media/the-machine/after/12-forward-reverse.webm).
The metrics files record one `h1`, one motion owner, semantic identity
presence, zero focusable workstation details, zero desktop horizontal
overflow, no console warning/error, and no Three.js production resource.

## Known limitations

- CSS perspective suggests a workstation; it does not model mechanically
  correct hinge or deck geometry.
- The key field is an intentionally abstract material cue and has no individual
  keys or legends.
- CSS line rendering can vary slightly with browser scaling and device-pixel
  density.
- Automated reflow and reduced-motion checks do not replace hands-on physical
  device, browser zoom, or assistive-technology review.
- The workstation does not address PR #26 content decisions, direct chapter
  access, project evidence, or later-chapter density.

These limits are preferable to imported models, image assets, large effects,
or a more complex rendering system.

## Recommendation

**Keep.** The refined workstation is clearly more physical than the baseline,
its silhouette explains the object at a glance, and its details remain quieter
than the screen. The semantic identity stays crisp during its readable phase,
the accepted Threshold remains continuous forward and backward, and responsive
simplification prevents the desktop treatment from becoming mobile noise.

Revisit only if human review finds the deck detail visually dominant at the
normal Arrival distance. In that case, revise toward the documented Minimal
precision candidate without reverting the improved lid, hinge, and base
silhouette.
