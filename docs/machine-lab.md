# Machine Lab

## Status and boundary

Machine Lab is an isolated technical experiment for PR #28. It is available only by direct navigation to `/lab/machine`, is marked `noindex, nofollow`, remains excluded from the sitemap, and sits beneath the existing `/lab/` robots exclusion. The production homepage does not link to it and was not changed for this experiment.

The lab answers one narrow question: can a supplied GLB support Helix's closed-machine, opening, screen-activation, semantic-identity, and camera-approach sequence without compromising the production journey?

## Model inspection

`public/models/helix-machine.glb` is 404,020 bytes. The reproducible `npm`-independent inspection command is:

```bash
node scripts/inspect-machine-model.mjs
```

The imported hierarchy contains eight objects and two meshes:

```text
Scene
└── Sketchfab_model
    └── 6d4c164f62674ba9b12714fec0584379fbx
        └── RootNode
            ├── Frame
            │   └── Frame_ComputerFrame_0
            └── Screen
                └── Screen_ComputerScreen_0
```

- `Frame` is the grounded base. Its world bounds are approximately `30.4 × 0.976 × 20.103` units.
- `Screen` is the complete upright lid/display assembly. Its world bounds are approximately `30.4 × 20.103 × 1.005` units.
- The imported model contains 8,322 triangles: 8,164 in the frame and 158 in the screen.
- The model separates base and lid cleanly, but does not provide an articulated hinge node.
- The `Screen` node origin is close to the rear lower edge, but its geometry begins approximately `0.195` local units below that origin.

The model is therefore usable without editing the GLB. Machine Lab inserts one runtime `RuntimeHingePivot`, offset by the measured `0.195` units, reparents `Screen` beneath it, and preserves the original transform. The reported structural runtime count is nine objects: the eight imported objects plus this wrapper. Lighting, the screen activation plane, and the studio shadow are lab presentation objects and are not counted as model structure.

## Mechanical sequence

The range input is the source of truth for a normalized `0–1` sequence. Playback is a convenience layer over the same progress value and does not depend on scroll.

| Progress | Stage | Purpose |
| --- | --- | --- |
| `0.00–0.20` | Closed | Establish one quiet, grounded machine silhouette. |
| `0.20–0.50` | Opening | Rotate the lid around the measured rear hinge while the base remains fixed. |
| `0.45–0.65` | Screen activation | Bring a restrained cyan-black screen surface online after the display faces the viewer. |
| `0.58–0.76` | Identity | Reveal Jonathan's semantic identity over the display without placing text in WebGL. |
| `0.70–1.00` | Camera approach | Move the camera toward the powered display while preserving the laptop form for most of the approach. |

Stage interpolation uses controlled smoothstep easing. There is no bounce, spring, scroll interception, continuous render loop, or second motion owner. The R3F canvas uses `frameloop="demand"`; a frame is invalidated only when progress changes. Forward and reverse playback use the same sequence and duration, so reversing restores the closed state coherently.

## Semantic text strategy

The name, location, and professional direction are normal server-described HTML outside the canvas. CSS positions this layer over the projected display and adjusts it conservatively during the final approach. It is never rendered into the GLB, a texture, SVG, or canvas. This preserves text selection, heading semantics, screen-reader access, and sharp browser text rendering.

This fixed HTML overlay is intentionally a lab compromise. It proves that semantic content can coexist with the model, but it is not a final screen-plane tracking system. A production integration would need to validate its alignment across the real Arrival composition without moving the text into WebGL.

## Controls and states

Machine Lab provides native controls:

- a keyboard-operable range input for exact progress;
- forward, reverse, and reset buttons;
- a reduced-motion preview checkbox;
- a visible stage and progress readout.

System `prefers-reduced-motion: reduce` and the preview control both resolve immediately to an open, powered machine with visible semantic identity at progress `0.68`. Lid and camera playback are disabled in that state.

The route exposes a visible loading message while the GLB is pending. If WebGL is unavailable, the GLB fails, or the route is opened with the deterministic review query `?webgl=off`, the canvas is replaced by a semantic fallback containing Jonathan's identity, an explanation, and a production-portfolio link. The fallback does not depend on JavaScript interaction to reveal its essential content.

## Responsive behavior

- Desktop receives the full studio composition and sequence.
- Laptop and square viewports retain the full sequence with a narrower control column.
- Tablet moves controls below the stage and keeps the model in a contained landscape composition.
- Mobile uses the same direct control model in normal document flow, with a shorter stage, stacked controls, a mobile-aligned semantic overlay, and no pinning.
- Reduced motion is a stable open state at every viewport, not a slowed version of the animation.

All required viewport checks preserve native scrolling and show no horizontal overflow.

## Performance and isolation

Measurements are stored in [`docs/media/machine-lab/metrics.json`](media/machine-lab/metrics.json). They were captured from the production build by recording emitted JavaScript response bodies; these are uncompressed emitted bytes, not transfer-compressed network sizes.

- GLB: 404,020 bytes, requested once by Machine Lab.
- Imported geometry: 8,322 triangles.
- Structural runtime: nine objects including the hinge wrapper.
- DPR: capped at `1.5`; a device-scale-factor `2` review measured approximately `1.5` in both axes.
- Production `/` emitted JavaScript: 652,728 bytes.
- Machine Lab emitted JavaScript: 1,485,683 bytes.
- Lab-only emitted JavaScript: 971,157 bytes.
- Lab-only chunks containing the Three.js renderer: 959,812 bytes. This is a conservative chunk-level contribution and includes co-bundled R3F support; it is not a symbol-level Three.js measurement.
- Production `/` requested no GLB, no canvas, and none of the renderer-containing lab chunks.
- Both measured routes produced zero browser console warnings and zero browser console errors.

React Three Fiber `9.7.0` and Drei `10.7.7` are loaded only by the dynamic Machine Lab canvas. Three.js is pinned to compatible release `0.182.0`: Three r183 introduced a `Clock` deprecation warning while the current stable R3F store still constructs that API. Pinning the last compatible release keeps diagnostics honest without suppressing console output.

The approximately 971 KB lab-only JavaScript cost is acceptable for a direct-access experiment but is too large to accept automatically on the production homepage. Any production proposal must establish a deliberate loading boundary and compare this cost against the existing CSS implementation.

## Model source and license

The GLB was supplied for this experiment. Its binary metadata identifies the Blender glTF exporter, and its internal names include `Sketchfab_model`, but it contains no verifiable author, source URL, copyright notice, or license. Repository history available to this PR does not establish those facts.

Therefore:

- no author, marketplace, or license claim is made;
- the asset must not be treated as cleared for public production use;
- source provenance and redistribution rights must be verified before production integration or deployment;
- replacing materials at runtime does not change the underlying asset-license requirement.

## Evidence

The captured states are:

1. [Closed](media/machine-lab/01-closed.png)
2. [Opening midpoint](media/machine-lab/02-opening-midpoint.png)
3. [Fully open](media/machine-lab/03-fully-open.png)
4. [Screen activation](media/machine-lab/04-screen-activation.png)
5. [Identity visible](media/machine-lab/05-identity-visible.png)
6. [Camera approach](media/machine-lab/06-camera-approach.png)
7. [Reverse midpoint](media/machine-lab/07-reverse-midpoint.png)
8. [Reset](media/machine-lab/08-reset.png)
9. [Tablet](media/machine-lab/09-tablet.png)
10. [Mobile](media/machine-lab/10-mobile.png)
11. [Reduced motion](media/machine-lab/11-reduced-motion.png)
12. [WebGL fallback](media/machine-lab/12-webgl-fallback.png)

The [forward-and-reverse recording](media/machine-lab/13-forward-reverse.webm) shows the same centralized sequence in both directions.

## Known limitations

- Asset provenance and redistribution rights are unresolved.
- The semantic overlay is aligned for the lab's known compositions, not coupled to a projected 3D screen plane.
- The lab does not test production scroll pacing, Threshold crossing, or handoff into the workspace.
- Materials are intentionally restrained lab replacements rather than a final material study.
- The emitted Three/R3F cost needs a stricter production loading plan before integration.
- No Firefox run is claimed by this Chromium-only Playwright configuration.

## Recommendation

**Revise the prototype before production integration.**

The experiment proves that the supplied hierarchy can support a plausible, reversible hinge opening; that the display can activate independently; and that semantic HTML identity can remain outside WebGL. It does not yet justify replacing the production CSS machine. Asset licensing must be verified, the HTML-to-screen alignment must be validated in the real Arrival composition, and the lab-only bundle cost needs an explicit production budget. Until those conditions are satisfied, keep Machine Lab isolated and keep the production route unchanged.
