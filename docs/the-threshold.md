# The Threshold

## Design question

Can the laptop-to-workspace transition feel more like crossing a physical
threshold while remaining calm, reversible, accessible, responsive, and
recognisably Helix?

This iteration tests one deliberately narrow answer: use shallow CSS
perspective to relate the screen surface, Arrival identity, and workspace
threshold. It does not attempt to make the transition cinematic. A reviewer
should notice that the workspace appears to exist behind the screen, not the
animation technique used to suggest it.

## Baseline

The control is merged `main` at `95b2e67`. It was reviewed in the built
production route at 1440 × 1000 in Chromium. The pinned Arrival distance was
1,150 px.

At the matched evidence positions, the laptop scale progressed from `1` at
Arrival to approximately `1.04` at 22%, `1.59` at 50%, `2.23` at 78%, and
`2.31` at the handoff. These values document the observed control; they are
not new acceptance thresholds.

The baseline shell remained fully opaque until 72% of the sequence. It was
still approximately `0.97` opaque at the 78% capture and then settled at
`0.12`. The identity and threshold used the same late 24%-long handoff:
Jonathan's identity moved from full opacity to zero while scaling slightly
forward, and the workspace threshold moved from zero to full opacity while
scaling from `0.96` to `1`. The screen itself had no depth relationship
between those layers.

The screen grid already provided useful visual continuity, but three
limitations were observed:

- the screen read primarily as a flat object being enlarged;
- shell attenuation and workspace appearance were concentrated in the final
  quarter, making the handoff more like two fades than one physical movement;
- Arrival copy remained faintly perceptible beneath the resolved threshold.

The first Helix path is not revealed by this pinned threshold timeline. It
begins through the existing journey-path timeline as Orientation approaches,
so the path remains downstream of the screen crossing. Forward travel is
directly scrubbed over the finite 1,150 px desktop distance with the existing
`0.55` scrub value. Reverse scrolling restores the same states in reverse.
Reduced motion creates neither the camera timeline nor a pin spacer and keeps
Arrival and the full journey in static document order.

Baseline screenshots and the forward/reverse recording are in
[`docs/media/the-threshold/before`](media/the-threshold/before).

## Revised concept

The revised threshold keeps the existing laptop movement and uses a small
internal layer model:

```text
Laptop shell
Screen
├── Arrival identity (flat semantic HTML)
└── Decorative depth wrapper
    ├── Screen glass
    └── Workspace threshold
```

These are not visible panels or new interface chrome. The glass is a
decorative, non-focusable plane. CSS perspective is limited to the decorative
wrapper. The semantic identity remains on a flat screen plane while the glass
and workspace threshold establish shallow depth. During the handoff, the
identity exits before the final high-scale phase and the workspace resolves
forward. The laptop shell, camera, and base attenuate over the same interval.

## Exact production changes

- Added one `aria-hidden` decorative depth wrapper around the existing
  screen-glass and workspace-threshold layers.
- Limited `perspective`, `transform-style: preserve-3d`, and `translateZ`
  separation to that decorative wrapper.
- Kept the semantic identity outside the scaled 3D subtree and removed its
  scale and depth tween.
- Extended the existing `JourneyMotion` target map and cleanup list for that
  decorative layer.
- Began the desktop handoff at 60% instead of 72% and expanded it from 24% to
  36% of the same finite timeline. Tablet uses the same principle with a
  quieter profile.
- Began the desktop identity departure at 48% over 24% of the timeline, before
  the laptop reaches its final high-scale phase. Tablet begins at 56% over
  22%.
- Moved the threshold slightly forward as it resolves.
- Preserved 12% of the screen frame at desktop completion instead of removing
  it completely, so the crossing retains a restrained plane cue.
- Removed the final screen-edge and shell shadow at desktop and tablet
  resolution so neither becomes a full-width line after enlargement.
- Allowed the screen plane to overlap the normal-flow workspace at pin release.
- Separated the screen grid into its own decorative layer so it can recede
  before the workspace grid becomes visible.
- Removed the resolved desktop/tablet inner screen-frame edge and restored a
  grid-free workspace entry veil.
- Matched the tablet Arrival surface to the threshold background where the
  smaller camera profile intentionally leaves more of the section visible.
- Reduced the final presence of the surrounding desktop Arrival copy from
  `0.16` to `0.025`, and tablet from `0.16` to `0.05`.
- Reduced base travel from 22 px to 16 px on desktop and from 14 px to 12 px on
  tablet so it quiets without appearing to detach.

The overall laptop scale, camera distance, 1,150 px desktop pin distance,
camera duration, scroll behavior, and `power1.inOut` easing convention are
unchanged. No rotation, overshoot, blur, flash, portal ring, animated noise,
runtime asset, or new animation owner was added.

## Shell, screen, identity, and workspace

The shell starts exactly as before. Its final opacity remains `0.12`, but the
longer coordinated handoff makes the bezel and base recede with the internal
layers rather than after them. The base travels less, preserving the physical
relationship between display and keyboard deck.

The screen gains one quiet glass cue: a fine neutral edge and a very low
contrast reflection with a small cyan component. Its opacity decreases while
crossing, so it supports the threshold rather than becoming a glowing frame.
No cyan light is added outside the laptop or later in the journey.

Jonathan's identity remains semantic HTML and fully readable through the
approach. It remains visually flat, does not receive a scale or depth
transform, and fades before the final high-scale phase. The workspace
threshold begins resolving earlier from behind that identity and finishes
slightly forward of the starting plane.

The Orientation layout, Environment content, and Helix path are unchanged.
The threshold remains a decorative anticipation layer; the real workspace
content continues in normal semantic document flow.

## Human review correction

Human review accepted the spatial direction but found two rendering defects:
the Arrival identity became visibly rasterized during enlargement, and a
full-width seam divided the pinned scene from the normal-flow workspace.

### Identity rasterization

The screen and display both established 3D contexts, and the identity had its
own `translateZ`, `preserve-3d`, and GSAP scale. The complete laptop was then
promoted and enlarged to more than twice its initial size. Chromium therefore
treated the still-readable identity as a composited texture inside a scaled
3D subtree and visibly magnified that texture.

The correction separates concerns. The identity stays as flat semantic HTML
on the screen plane; only the decorative glass and threshold use the depth
wrapper. The identity receives opacity only and departs earlier. Reverse
travel restores the same unscaled HTML, so readable text is crisp in both
directions.

### Workspace seam

The enlarged screen extended below the Arrival section at release, but the
Arrival container clipped it at exactly the section boundary. At the same
coordinate, the workspace introduced a different grid treatment and the
whole-laptop drop shadow became a dark full-width band. The matching edges
made two continuous layers read as stacked sections.

The correction lets the screen plane overlap the workspace, clips only the
horizontal page axis at the motion root, moves the shadow to the fading shell,
and removes the resolved screen edge. The workspace still enters normal flow
at the same point; the overlapping screen surface conceals the document
boundary without a second pin, extra page height, or an overlay wipe.

Matched correction evidence is stored in
[`correction-before`](media/the-threshold/correction-before) and
[`correction-after`](media/the-threshold/correction-after). The revised folder
includes a side-by-side former-seam comparison and a forward/reverse recording.

## Grid alignment review

Human review of the seam correction found that its two visible grids did not
share a coordinate system. The laptop grid was defined in local screen
coordinates and then enlarged by the camera transform. The temporary workspace
overlay used viewport-height spacing and a manually offset viewport origin.
The normal journey grid used a third responsive spacing rule from the journey
element's own origin.

At the inspected 1280 × 720 state, the local laptop spacing was 40 px before
camera scaling, the handoff overlay spacing was 66.24 px, and the normal
workspace spacing was 64 px. Even where two values happened to be close, their
origins and transform phases differed. At 1024 × 768 the tablet camera profile
made the divergence larger. Device-pixel rounding could only add variance; it
was not the root cause.

### Candidates evaluated

The synchronized-token candidate assigned the same 64 px token and origin to
both declared grid backgrounds. It still failed because one grid was inside
the transformed laptop while the other remained in normal viewport space.
Matching CSS tokens therefore produced different apparent spacing after
camera scaling and could not remain aligned across 1440 × 1000, 1280 × 800,
and 1024 × 768 without per-viewport compensation.

The sequential-fade candidate made the laptop grid a dedicated decorative
layer and faded it during the existing threshold interval. The screen's solid
surface then carries the crossing without grid lines. The normal workspace
grid appears only after the screen has moved on, through a grid-free top veil.
There is never a point at which two grid origins compete.

### Chosen approach

The sequential fade is quieter and structurally more robust. Desktop and
tablet resolve the screen grid and inner frame edge to zero; the screen overlap
and shared `#111719` surface preserve the threshold composition. Tablet uses
that surface for Arrival as well because its intentionally smaller camera
coverage leaves more surrounding section visible. Mobile keeps its existing
static grid and unpinned motion profile. Reduced motion keeps the complete
static laptop and journey in normal document order.

No grid-specific ScrollTrigger, second pin, resize calculation, arbitrary
per-viewport offset, or production toggle was added. The synchronized candidate
exists only in the evidence script.

Matched candidate and final evidence is stored in
[`grid-alignment`](media/the-threshold/grid-alignment). It includes the
reviewed misalignment, synchronized-token candidate, fade candidate, desktop
and compact handoffs, pin release, reverse crossing, mobile, reduced motion,
and the chosen forward/reverse recording.

## Comparison

### Forward

Initial Arrival, early approach, and overall camera travel remain deliberately
close to the control. The visible difference is concentrated between the
midpoint and crossing: glass, identity, threshold, shell, and base now
participate in one longer handoff. The revised screen frame retains a small
amount of structure at resolution, while the unrelated Arrival copy becomes
quieter.

Whether this is a meaningful improvement is a review decision. The matched
evidence should be used to judge whether the workspace feels located behind
the screen without making the transition itself conspicuous.

### Reverse

Because the new values extend the existing scrubbed GSAP timeline, reverse
travel follows the same relationship in reverse. The screen plane returns
before the identity becomes primary; the shell and base regain their original
strength together. No reverse-only state, listener, or timing path exists.

### Responsive

Desktop and compact desktop receive the complete shallow-depth treatment.
Tablet uses smaller depth distances and the existing shorter camera profile.
Mobile remains native and unpinned; it receives no camera-like perspective
movement and only retains the static glass treatment already present in the
laptop composition. Desktop and tablet use the sequential grid handoff; mobile
retains the static screen grid. No horizontal transform travel was added.

### Reduced motion

Reduced motion creates no threshold timeline and no pin spacer. GSAP cleanup
removes all enhancement styles, leaving the semantic Arrival identity, static
laptop, Orientation, and every later chapter available in document order. The
decorative glass does not cover or replace content.

## Performance

The production change adds one empty decorative grid element, CSS-only layer
styling, and one opacity value inside the existing GSAP timeline. It adds no
dependency, asset, request, event listener, ScrollTrigger owner, render loop,
canvas, or WebGL. Only transform and opacity are animated. The production
homepage does not request the lab-only Three.js chunk.

The correction changes markup, CSS, existing configuration values, tests, and
the local evidence script. It adds no production dependency, request, event
listener, animation owner, or client state. Final bundle measurements are
recorded in the pull request because decoded resource sizes vary by build and
local server session. Using the same local decoded-resource method as the
previous correction, the grid revision moved `/` from 652,486 to 652,734
decoded JavaScript bytes: +248 bytes. The route still requests seven JavaScript
chunks and no Three.js chunk.

## Validation and known limitations

The complete 33-check Chromium product suite passes, including the six
approved viewport sizes, keyboard flow, reduced motion, direct fragments,
forward and reverse ownership, console safety, and horizontal overflow. The
focused 11-check release suite passes in both Chromium and WebKit (22 checks
total). The route remains statically generated.

Firefox is not reported as passing. Its release run reproduces the Playwright
runner failure already recorded by PR #19: page-backed checks fail while the
runner creates `browserContext.newPage`, before application code executes. The
request-only headers check passes. One isolated retry produced the same
result, so Firefox visual behavior remains unavailable in this environment
rather than classified as an application failure.

The 200% and 400% artifacts are controlled reflow equivalents at 720 × 500 and
360 × 250 with reduced motion. They verify the layout boundary but are not a
substitute for hands-on browser-chrome zoom. Physical-device, physical zoom,
screen-reader, and frame-time profiling remain human follow-up checks. These
limitations do not justify broadening this focused design PR.

## Intentionally unchanged

- visitor-facing copy and chapter order;
- Environment, Engineering Mindset, Projects, Experience, and Continue;
- chapter pacing and ownership;
- Helix SVG geometry, nodes, branches, and path reveal;
- native scrolling and direct fragments;
- metadata, sitemap, robots, and public routes;
- the `/lab/spatial` comparison route;
- mobile pinning behavior and the reduced-motion architecture.

Layered SVG depth for the later Helix path remains a separate future decision.
Three.js remains outside the production portfolio.

## Reviewer checklist

- Does the screen feel more like a place than a flat surface?
- Does the transition feel calmer or more complicated?
- Is the difference visible without being distracting?
- Does the workspace feel located behind the screen?
- Does reverse travel feel natural?
- Does the cyan cue help, or does it feel decorative?
- Would the baseline be preferable?
- Should the effect be reduced further?

## Recommendation

**Keep.** The accepted spatial concept and text-rendering correction are
unchanged. The grid handoff no longer attempts to align transformed and
normal-flow coordinate systems; it uses a controlled absence between them.
The screen/workspace overlap remains continuous in forward and reverse travel
without a visible grid restart. The matched candidate evidence should remain
part of the PR record.
