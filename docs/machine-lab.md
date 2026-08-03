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
- `Screen_ComputerScreen_0` is the mesh for the complete lid assembly; the asset does not expose the illuminated display area as a separate mesh. Machine Lab therefore adds a fitted runtime plane as the controllable screen surface.
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
| `0.70–0.84` | Camera reframe | Remove the initial lateral offset first, align with the display, and retain the readable machine silhouette. |
| `0.84–1.00` | Camera dolly | Travel primarily toward the display along its forward view direction while holding a stable screen center. |
| `0.90–0.97` | Identity departure | Remove the semantic identity before the closest camera state, while keeping reverse playback deterministic. |

Stage interpolation uses controlled smoothstep easing. There is no bounce, spring, scroll interception, continuous render loop, or second motion owner. The R3F canvas uses `frameloop="demand"`; a frame is invalidated only when progress changes. Forward and reverse playback use the same sequence and duration, so reversing restores the closed state coherently.

## Human review and revision scope

Human review found the first prototype technically successful and visually promising, but not ready for production integration. The single camera interpolation read as a diagonal coordinate change rather than a deliberate approach. Its fixed CSS identity only approximated the display perspective, and the fitted screen surface had not been documented tightly enough to review its relationship to the bezel. The machine also needed modest material separation without becoming glossy or effect-heavy.

This revision retains the isolated route, deterministic controls, supplied model, measured hinge, production loading boundary, and reversible sequence. It changes only the camera approach, identity anchoring, runtime screen fit, and restrained studio treatment.

## Camera strategy

The perspective camera still begins at `[4.6, 2.8, 6.4]`, looking across the full machine from a restrained three-quarter angle. The former `0.70–1.00` single interpolation has been split into two stages:

- **Reframe (`0.70–0.84`)** moves to `[0.75, 1.2, 6]`, reducing lateral displacement before closing distance. Its look target settles on the screen center at `[0, 0.6, -0.64]`, so the machine remains legible while the view becomes frontal.
- **Dolly (`0.84–1.00`)** moves to `[0.04, 0.67, 4.15]` while keeping that screen-center target stable. The final camera position preserves the complete bezel and a small part of the base instead of clipping into the display.

Compact layouts use farther endpoints (`[0.8, 1.3, 6.1]` for reframe and `[0.18, 0.82, 4.6]` for dolly). This keeps the same narrative order without forcing the desktop camera distance into smaller stages. The field of view remains constant; the approach comes from camera travel rather than a simulated zoom.

## Screen plane fit

The imported asset does not expose its active display as a distinct mesh, so the runtime screen surface is measured against the visible lid opening:

| Property | Runtime value |
| --- | --- |
| Plane width | `0.282` local units |
| Plane height | `0.176` local units |
| Local position | `[0, 0.098, -0.0062]` |
| Local rotation | `[0, 0, 0]` |
| Depth offset | `0.0062` local units toward the visible `-Z` lid face |
| Bezel margin | approximately `0.011` horizontal and `0.0125` vertical units per side |

The plane is attached to the measured hinge assembly and uses a `BackSide` material because the model's visible display face points along local `-Z`. This orientation prevents the activation surface from remaining visible through the rear lid. The small depth offset keeps it ahead of the underlying lid surface without visibly floating or z-fighting. Closed, midpoint, open, forward-approach, and reverse states were reviewed; the plane remains within the opening and does not clip through the frame.

## Material and lighting strategy

The imported texture materials remain runtime replacements, now with slightly clearer but still quiet separation: the lid uses metalness `0.32` and roughness `0.54`; the base uses metalness `0.28` and roughness `0.58`. The fitted display moves from near-black to dark cyan with emissive intensity `0.11`, remaining the brightest surface.

The studio uses ambient intensity `0.36`, a softened warm key at intensity `1.65`, a restrained cyan rim at `0.38`, and tone-mapping exposure `0.92`. Three low-opacity ground ellipses form a controlled contact footprint without a large shadow rectangle. There is still no HDRI, bloom, fog, reflection environment, or post-processing.

Runtime-created graphite materials are explicitly disposed on unmount. The imported geometries, original material and texture resources, and loader cache are also released when the lab leaves the document; media-query listeners and playback frames are cancelled by the HTML controller.

## Semantic text strategy

The name, location, and professional direction remain normal semantic HTML, never a WebGL texture, SVG, canvas, or 3D text. A Drei `Html` transform is attached to an `Object3D` anchor at `[-0.012, 0.098, -0.0065]` in the fitted screen plane's local coordinate system. The HTML portal is placed outside the canvas's `aria-hidden` subtree, while the anchor inherits the lid opening and screen perspective.

The transformed wrapper uses a small scene scale with an inverse CSS scale on its inner content. This preserves the scene relationship without relying on a heavily magnified browser texture. The identity appears only after the screen faces the viewer, exits over progress `0.90–0.97` before the closest camera state, and restores cleanly in reverse. Browser inspection confirms the heading remains exposed outside any `aria-hidden` canvas ancestor.

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
- Mobile uses the same direct control model in normal document flow, with a shorter stage, stacked controls, a farther camera endpoint, and no pinning.
- Reduced motion is a stable open state at every viewport, not a slowed version of the animation.

All required viewport checks preserve native scrolling and show no horizontal overflow.

## Performance and isolation

Measurements are stored in [`docs/media/machine-lab/metrics.json`](media/machine-lab/metrics.json). They were captured from the production build by recording emitted JavaScript response bodies; these are uncompressed emitted bytes, not transfer-compressed network sizes.

- GLB: 404,020 bytes, requested once by Machine Lab.
- Imported geometry: 8,322 triangles.
- Structural runtime: nine objects including the hinge wrapper.
- DPR: capped at `1.5`; a device-scale-factor `2` review measured approximately `1.5` in both axes.
- Production `/` emitted JavaScript: 652,875 bytes.
- Machine Lab emitted JavaScript: 1,494,768 bytes.
- Lab-only emitted JavaScript: 980,095 bytes.
- Lab-only chunks containing the Three.js renderer: 969,098 bytes. This is a conservative chunk-level contribution and includes co-bundled R3F and Drei support; it is not a symbol-level Three.js measurement.
- Production `/` requested no GLB, no canvas, and none of the renderer-containing lab chunks.
- Both measured routes produced zero browser console warnings and zero browser console errors.

React Three Fiber `9.7.0` and Drei `10.7.7` are loaded only by the dynamic Machine Lab canvas. Three.js is pinned to compatible release `0.182.0`: Three r183 introduced a `Clock` deprecation warning while the current stable R3F store still constructs that API. Pinning the last compatible release keeps diagnostics honest without suppressing console output.

The approximately 980 KB lab-only JavaScript cost is acceptable for a direct-access experiment but is too large to accept automatically on the production homepage. Any production proposal must establish a deliberate loading boundary and compare this cost against the existing CSS implementation.

## Model source and license

The GLB was supplied for this experiment. Its binary metadata identifies the Blender glTF exporter, and its internal names include `Sketchfab_model`, but it contains no verifiable author, source URL, copyright notice, or license. Repository history available to this PR does not establish those facts.

Therefore:

- no author, marketplace, or license claim is made;
- the asset must not be treated as cleared for public production use;
- source provenance and redistribution rights must be verified before production integration or deployment;
- replacing materials at runtime does not change the underlying asset-license requirement.

## Evidence

### Original review baseline

The retained baseline shows the fixed-overlay and single-camera implementation accepted for revision:

1. [Identity visible](media/machine-lab/revision-before/01-identity-visible.png)
2. [Single camera approach](media/machine-lab/revision-before/02-single-camera-approach.png)
3. [Tablet](media/machine-lab/revision-before/03-tablet.png)
4. [Mobile](media/machine-lab/revision-before/04-mobile.png)
5. [Reduced motion](media/machine-lab/revision-before/05-reduced-motion.png)
6. [Forward-and-reverse recording](media/machine-lab/revision-before/06-forward-reverse.webm)

The original prototype did not contain distinct reframe and dolly states, so its single camera-approach frame is the comparison baseline for the revised camera sequence.

### Revised evidence

1. [Identity visible](media/machine-lab/revision-after/01-identity-visible.png)
2. [Camera reframe](media/machine-lab/revision-after/02-camera-reframe.png)
3. [Camera dolly midpoint](media/machine-lab/revision-after/03-camera-dolly-midpoint.png)
4. [Final approach](media/machine-lab/revision-after/04-final-approach.png)
5. [Reverse approach](media/machine-lab/revision-after/05-reverse-approach.png)
6. [Screen-plane close-up](media/machine-lab/revision-after/06-screen-plane-close-up.png)
7. [Compact desktop](media/machine-lab/revision-after/07-compact-desktop.png)
8. [Tablet](media/machine-lab/revision-after/08-tablet.png)
9. [Mobile](media/machine-lab/revision-after/09-mobile.png)
10. [Reduced motion](media/machine-lab/revision-after/10-reduced-motion.png)

The revised [forward-and-reverse recording](media/machine-lab/revision-after/11-forward-reverse.webm) demonstrates that camera staging, identity departure, screen fit, and lid state all restore through the same deterministic progress source.

## Known limitations

- Asset provenance and redistribution rights are unresolved.
- Drei's transformed HTML remains a CSS 3D composition and needs cross-browser visual acceptance in the final Arrival layout before production use.
- The lab does not test production scroll pacing, Threshold crossing, or handoff into the workspace.
- Materials and the layered contact footprint are intentionally restrained lab treatments rather than a physically calibrated product-rendering study.
- The emitted Three/R3F cost needs a stricter production loading plan before integration.
- No Firefox run is claimed by this Chromium-only Playwright configuration.

## Recommendation

**Revise further before production integration.**

The revision resolves the requested prototype concerns: the approach now reads as reframe then dolly, the semantic identity follows a true scene anchor while remaining accessible HTML, the runtime plane has a measured bezel fit, and the machine has clearer restrained material separation. It still does not justify replacing the production CSS machine. Asset licensing must be verified, transformed HTML must be accepted across production browser targets, and the lab-only bundle cost needs an explicit production budget. Until those conditions are satisfied, keep Machine Lab isolated and keep the production route unchanged.
