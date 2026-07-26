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

The revised threshold keeps the existing laptop movement and adds a small
internal layer model:

```text
Laptop shell
Screen glass
Arrival identity
Workspace threshold
```

These are not visible panels or new interface chrome. The glass is a
decorative, non-focusable plane. CSS perspective gives the identity a shallow
starting separation and places the workspace slightly behind it. During the
handoff, the identity settles backward while the workspace resolves forward.
The laptop shell, camera, and base attenuate over the same interval.

## Exact production changes

- Added one `aria-hidden` screen-glass layer to the existing semantic laptop.
- Added shallow `perspective`, `transform-style: preserve-3d`, and small
  `translateZ` separation inside the screen.
- Extended the existing `JourneyMotion` target map and cleanup list for that
  decorative layer.
- Began the desktop handoff at 60% instead of 72% and expanded it from 24% to
  36% of the same finite timeline. Tablet uses the same principle with a
  quieter profile.
- Moved the identity slightly backward while reducing its scale to `0.99`;
  moved the threshold slightly forward as it resolves.
- Preserved 12% of the screen frame at desktop completion instead of removing
  it completely, so the crossing retains a restrained plane cue.
- Reduced the final presence of the surrounding desktop Arrival copy from
  `0.16` to `0.025`, and tablet from `0.16` to `0.05`.
- Reduced base travel from 22 px to 16 px on desktop and from 14 px to 12 px on
  tablet so it quiets without appearing to detach.

The overall laptop scale, pin distance, camera duration, scroll behavior, and
`power1.inOut` easing convention are unchanged. No rotation, overshoot, blur,
flash, portal ring, animated noise, runtime asset, or new animation owner was
added.

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
approach. It no longer scales toward the visitor during departure; it moves a
small distance back into the screen and settles slightly smaller. The
workspace threshold begins resolving earlier from behind that identity and
finishes slightly forward of the starting plane.

The Orientation layout, Environment content, and Helix path are unchanged.
The threshold remains a decorative anticipation layer; the real workspace
content continues in normal semantic document flow.

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
laptop composition. No horizontal transform travel was added.

### Reduced motion

Reduced motion creates no threshold timeline and no pin spacer. GSAP cleanup
removes all enhancement styles, leaving the semantic Arrival identity, static
laptop, Orientation, and every later chapter available in document order. The
decorative glass does not cover or replace content.

## Performance

The production change adds one empty decorative element, CSS-only layer
styling, and values inside the existing GSAP timeline. It adds no dependency,
asset, request, event listener, ScrollTrigger owner, render loop, canvas, or
WebGL. Only transform and opacity are animated. The production homepage does
not request the lab-only Three.js chunk.

Using the same decoded-resource method recorded by PR #19, the production
homepage moved from 651,816 decoded JavaScript bytes to 652,486: a 670-byte
increase (about 0.10%). The revised route requested the same seven JavaScript
chunks, transferred 200,342 bytes in this local session, and requested no
Three.js chunk. These are local comparison measurements rather than universal
network costs.

## Validation and known limitations

The complete 33-check Chromium product suite passes, including the six
approved viewport sizes, keyboard flow, reduced motion, direct fragments,
forward and reverse ownership, console safety, and horizontal overflow. The
focused 11-check release suite also passes in Chromium and WebKit.

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

**Revise pending human comparison.** The implementation stays within the
approved technical and intensity boundaries, but completion alone is not proof
that it is visually better. Review the matched screenshots and recordings,
especially the screen-crossing and reverse-midpoint states. Keep it only if
the added layer relationship is perceptible without drawing attention to
itself; otherwise reduce or revert the depth cue.
