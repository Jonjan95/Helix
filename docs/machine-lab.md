# Machine Lab

## Status and boundary

Machine Lab is an isolated technical and experience-direction experiment, continued in PR #29 after the model work in PR #28. It is available only by direct navigation to `/lab/machine`, is marked `noindex, nofollow`, remains excluded from the sitemap, and sits beneath the existing `/lab/` robots exclusion. The production homepage does not link to it and was not changed for this experiment.

The lab now answers a second narrow question: can those proven mechanics form a calm Arrival sequence in which the visitor understands one dominant event before the next begins?

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

## Arrival direction

The range input remains the source of truth for normalized `0–1` progress. Both candidates use the same stage names and mechanical implementation; only their stage ranges and playback duration differ. Stage interpolation uses controlled smoothstep easing. There is no bounce, spring, scroll interception, continuous render loop, or second motion owner. The R3F canvas keeps `frameloop="demand"`, and reverse playback traverses the same states in the opposite order.

### Candidate A — Quiet cinematic

Candidate A is the chosen direction. Its 7.2-second lab playback gives the machine, powered display, and identity distinct reading intervals before the camera begins.

| Progress | Dominant event |
| --- | --- |
| `0.00–0.12` | Machine emerges through light. |
| `0.12–0.20` | Established-machine hold. |
| `0.20–0.46` | Lid opens around the existing hinge. |
| `0.46–0.54` | Open-lid hold. |
| `0.54–0.66` | Screen luminance rises. |
| `0.66–0.72` | Screen interface resolves. |
| `0.72–0.80` | Semantic identity appears. |
| `0.80–0.87` | Identity holds without camera motion. |
| `0.87–0.94` | Camera reframes toward the display centre. |
| `0.94–0.96` | Identity departs. |
| `0.96–1.00` | Camera dollies to the threshold boundary. |

### Candidate B — Compact editorial

Candidate B preserves the same ownership order in a 5-second playback, but compresses the holds. It is retained as a developer review comparison through the visible lab selector and `?sequence=editorial` query.

| Progress | Dominant event |
| --- | --- |
| `0.00–0.09` | Machine reveal. |
| `0.09–0.13` | Established-machine hold. |
| `0.13–0.40` | Lid opening. |
| `0.40–0.45` | Open-lid hold. |
| `0.45–0.57` | Screen activation. |
| `0.57–0.61` | Screen settled. |
| `0.61–0.69` | Identity reveal. |
| `0.69–0.76` | Identity hold. |
| `0.76–0.86` | Camera reframe. |
| `0.86–0.89` | Identity departure. |
| `0.89–1.00` | Camera dolly. |

Candidate B is rejected as the recommended production direction because the screen and identity are understood, but their shorter holds make the reframe feel like the next task rather than the consequence of a completed identity moment. It remains useful when judging future production scroll distance.

## PR #28 human review and revision scope

Human review found the first prototype technically successful and visually promising, but not ready for production integration. The single camera interpolation read as a diagonal coordinate change rather than a deliberate approach. Its fixed CSS identity only approximated the display perspective, and the fitted screen surface had not been documented tightly enough to review its relationship to the bezel. The machine also needed modest material separation without becoming glossy or effect-heavy.

This revision retains the isolated route, deterministic controls, supplied model, measured hinge, production loading boundary, and reversible sequence. It changes only the camera approach, identity anchoring, runtime screen fit, and restrained studio treatment.

## PR #29 human review findings and decisions

Human review accepted the model, hinge, lighting foundation, and staged camera principle, but found that the machine entered awkwardly, screen activation and identity competed, and camera travel began before the display composition had resolved. The root cause was timing ownership: overlapping progress ranges made several mechanically correct changes read as one busy event.

PR #29 keeps the mechanics and changes the direction:

- **Machine entrance:** the object is already grounded in the scene. Warm key, ambient fill, cyan rim, and contact treatment rise from near-darkness over the first stage; the machine does not translate or rotate into view.
- **Lid timing:** the existing hinge and angle are unchanged. Opening begins only after the reveal hold and finishes before screen power begins.
- **Screen activation:** near-black glass gains dark-cyan luminance and then holds as a stable powered surface. An optional DOM grid was tested and rejected because its transformed projection did not remain registered with the bezel at every canvas width. There is no flash, glitch, scanline treatment, or boot copy.
- **Identity composition:** semantic HTML remains outside WebGL. The HTML plane uses the measured display proportions, a bounded screen-space X correction derived from canvas width, centred copy, reduced measure, screen-relative contrast, and bezel clipping. It does not appear until the screen-settled interval is complete.
- **Camera timing:** the accepted reframe and normal-facing dolly positions are preserved. Reframe waits for a complete identity hold; identity then leaves in its own short interval before the dolly begins.

This makes the event order legible in forward and reverse travel without adding effects or changing the production journey.

## Camera strategy

The perspective camera still begins at `[4.6, 2.8, 6.4]`, looking across the full machine from a restrained three-quarter angle. Both candidates reuse the accepted two-part move after their identity hold:

- **Reframe** moves to `[0.75, 1.2, 6]`, reducing lateral displacement before closing distance. Its look target settles on the screen center at `[0, 0.6, -0.64]`, so the machine remains legible while the view becomes frontal.
- **Dolly** moves to `[0.04, 0.67, 4.15]` while keeping that screen-center target stable. The final camera position preserves the complete bezel and a small part of the base instead of clipping into the display.

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

Human review found that the first anchored version still read as a layer floating in front of the display. Its 22rem content box had no display-ratio clipping boundary, its anchor sat independently of the exact screen center, and a `scale(0.5)` scene transform combined with a CSS `scale(2)` counter-scale. That full-strength compensation preserved size but weakened the perceived relationship between text, glass, and bezel. Warm-white contrast also remained closer to page typography than powered-screen typography.

### Screen-near semantic HTML

The name, location, and professional direction remain normal HTML, never a WebGL texture, SVG, canvas, or 3D text. A Drei `Html` transform remains at local Y `0.098` and Z `-0.0067`, only `0.0005` local units in front of the runtime display plane. Its X value is a bounded linear correction from `-0.024` to `0.019` local units based on canvas width; this compensates for transformed-HTML projection across the lab's responsive stage widths without changing the screen plane or camera. Its `0.282` distance factor maps a `400 × 250` CSS clipping frame to the display's measured `0.282 × 0.176` opening. The nearly identical `1.60:1` aspect ratios let the identity inherit screen perspective while clipping prevents content from crossing the bezel.

The earlier counter-scale pair remains removed. Typography uses centred composition, reduced warm-white contrast, quieter metadata, no background panel, no border, and no glow. The screen itself remains the brightest field. The external HTML portal remains outside the canvas's `aria-hidden` subtree, while the scene anchor inherits lid opening, camera reframe, and dolly. Identity appears only after screen activation has settled, holds before camera movement, exits before the dolly, and restores cleanly in reverse.

The previous internal canvas-texture comparison was removed for this direction. PR #29 has one visual and semantic source for identity content.

## Controls and states

Machine Lab provides native controls:

- a keyboard-operable range input for exact progress;
- keyboard-operable Candidate A and Candidate B radio controls;
- forward, reverse, and reset buttons;
- a reduced-motion preview checkbox;
- a visible stage and progress readout.

System `prefers-reduced-motion: reduce` and the preview control both resolve immediately to an open, powered machine with visible semantic identity at the selected candidate's identity-hold state (`0.84` for Candidate A and `0.73` for Candidate B). Entrance, lid, and camera playback are disabled in that state.

The route exposes a visible loading message while the GLB is pending. If WebGL is unavailable, the GLB fails, or the route is opened with the deterministic review query `?webgl=off`, the canvas is replaced by a semantic fallback containing Jonathan's identity, an explanation, and a production-portfolio link. The fallback does not depend on JavaScript interaction to reveal its essential content.

## Responsive behavior

- Desktop receives the full studio composition and the selected candidate duration.
- Laptop and square viewports retain the full sequence with a narrower control column.
- Tablet moves controls below the stage and keeps the model in a contained landscape composition.
- Mobile uses the same deterministic stage order in a compact 4.2-second playback, with a shorter stage, stacked controls, a farther camera endpoint, and no pinning.
- Reduced motion is a stable open state at every viewport, not a slowed version of the animation.

All required viewport checks preserve native scrolling and show no horizontal overflow.

## Performance and isolation

Measurements are stored in [`docs/media/machine-lab/metrics.json`](media/machine-lab/metrics.json). They were captured from the production build by recording emitted JavaScript response bodies; these are uncompressed emitted bytes, not transfer-compressed network sizes.

- GLB: 404,020 bytes, requested once by Machine Lab.
- Imported geometry: 8,322 triangles.
- Structural runtime: nine objects including the hinge wrapper.
- DPR: capped at `1.5`; a device-scale-factor `2` review measured approximately `1.5` in both axes.
- Production `/` emitted JavaScript: 652,875 bytes.
- Machine Lab emitted JavaScript: 1,496,996 bytes.
- Lab-only emitted JavaScript: 982,323 bytes.
- Lab-only chunks containing the Three.js renderer: 969,330 bytes. This is a conservative chunk-level contribution and includes co-bundled R3F and Drei support; it is not a symbol-level Three.js measurement.
- Production `/` requested no GLB, no canvas, and none of the renderer-containing lab chunks.
- Both measured routes produced zero browser console warnings and zero browser console errors.

React Three Fiber `9.7.0` and Drei `10.7.7` are loaded only by the dynamic Machine Lab canvas. Three.js is pinned to compatible release `0.182.0`: Three r183 introduced a `Clock` deprecation warning while the current stable R3F store still constructs that API. Pinning the last compatible release keeps diagnostics honest without suppressing console output.

The approximately 982 KB lab-only JavaScript cost is acceptable for a direct-access experiment but is too large to accept automatically on the production homepage. Any production proposal must establish a deliberate loading boundary and compare this cost against the existing CSS implementation.

## Model source and license

The supplied asset is [“Laptop”](https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e) by [Aullwen](https://sketchfab.com/Aullwen) on Sketchfab. It is licensed under the [Creative Commons Attribution 4.0 International license (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

Helix modifies the model for this experiment. The imported GLB geometry is retained, while the runtime presentation:

- scales and repositions the model for the lab composition;
- inserts a measured hinge wrapper and animates the independent screen node;
- replaces the original materials with restrained graphite treatments;
- adds a fitted powered-display plane and Helix identity treatment;
- supplies new lighting, contact treatment, camera staging, and accessibility markup.

Attribution is retained here with the exact title, creator, source, license version, and modification notice required for the adapted use. The creator does not endorse Helix.

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

### Screen-identity revision

1. [Open laptop with identity](media/machine-lab/identity-revision/01-open-laptop-identity.png)
2. [Angled identity view](media/machine-lab/identity-revision/02-angled-identity.png)
3. [Camera reframe](media/machine-lab/identity-revision/03-camera-reframe.png)
4. [Dolly midpoint](media/machine-lab/identity-revision/04-dolly-midpoint.png)
5. [Close screen view](media/machine-lab/identity-revision/05-close-screen-view.png)
6. [Reverse](media/machine-lab/identity-revision/06-reverse.png)
7. [Reduced motion](media/machine-lab/identity-revision/07-reduced-motion.png)
8. [Internal texture fallback](media/machine-lab/identity-revision/08-texture-fallback.png)

The texture frame above is retained as historical PR #28 evidence; the runtime texture candidate itself is no longer part of Machine Lab.

### Arrival-direction comparison

The candidate captures use matching semantic states rather than matching progress values because their timing ranges differ.

| State | Candidate A — Quiet cinematic | Candidate B — Compact editorial |
| --- | --- | --- |
| Darkness / initial reveal | [A01](media/machine-lab/arrival-direction/candidate-a/01-darkness-initial-reveal.png) | [B01](media/machine-lab/arrival-direction/candidate-b/01-darkness-initial-reveal.png) |
| Machine established | [A02](media/machine-lab/arrival-direction/candidate-a/02-machine-established.png) | [B02](media/machine-lab/arrival-direction/candidate-b/02-machine-established.png) |
| Lid opening | [A03](media/machine-lab/arrival-direction/candidate-a/03-lid-opening.png) | [B03](media/machine-lab/arrival-direction/candidate-b/03-lid-opening.png) |
| Fully open | [A04](media/machine-lab/arrival-direction/candidate-a/04-fully-open.png) | [B04](media/machine-lab/arrival-direction/candidate-b/04-fully-open.png) |
| Screen activation | [A05](media/machine-lab/arrival-direction/candidate-a/05-screen-activation.png) | [B05](media/machine-lab/arrival-direction/candidate-b/05-screen-activation.png) |
| Screen settled | [A06](media/machine-lab/arrival-direction/candidate-a/06-screen-settled.png) | [B06](media/machine-lab/arrival-direction/candidate-b/06-screen-settled.png) |
| Identity visible | [A07](media/machine-lab/arrival-direction/candidate-a/07-identity-visible.png) | [B07](media/machine-lab/arrival-direction/candidate-b/07-identity-visible.png) |
| Identity hold | [A08](media/machine-lab/arrival-direction/candidate-a/08-identity-hold.png) | [B08](media/machine-lab/arrival-direction/candidate-b/08-identity-hold.png) |
| Camera reframe | [A09](media/machine-lab/arrival-direction/candidate-a/09-camera-reframe.png) | [B09](media/machine-lab/arrival-direction/candidate-b/09-camera-reframe.png) |
| Camera dolly | [A10](media/machine-lab/arrival-direction/candidate-a/10-camera-dolly.png) | [B10](media/machine-lab/arrival-direction/candidate-b/10-camera-dolly.png) |
| Reverse midpoint | [A11](media/machine-lab/arrival-direction/candidate-a/11-reverse-midpoint.png) | [B11](media/machine-lab/arrival-direction/candidate-b/11-reverse-midpoint.png) |
| Reset | [A12](media/machine-lab/arrival-direction/candidate-a/12-reset.png) | [B12](media/machine-lab/arrival-direction/candidate-b/12-reset.png) |
| Mobile | [A13](media/machine-lab/arrival-direction/candidate-a/13-mobile.png) | [B13](media/machine-lab/arrival-direction/candidate-b/13-mobile.png) |
| Reduced motion | [A14](media/machine-lab/arrival-direction/candidate-a/14-reduced-motion.png) | [B14](media/machine-lab/arrival-direction/candidate-b/14-reduced-motion.png) |
| Forward and reverse | [A15 recording](media/machine-lab/arrival-direction/candidate-a/15-forward-reverse.webm) | [B15 recording](media/machine-lab/arrival-direction/candidate-b/15-forward-reverse.webm) |
| Compact desktop, 1280 × 800 | [A16](media/machine-lab/arrival-direction/candidate-a/16-compact-desktop.png) | [B16](media/machine-lab/arrival-direction/candidate-b/16-compact-desktop.png) |
| Laptop, 1024 × 768 | [A17](media/machine-lab/arrival-direction/candidate-a/17-laptop.png) | [B17](media/machine-lab/arrival-direction/candidate-b/17-laptop.png) |
| Tablet, 768 × 1024 | [A18](media/machine-lab/arrival-direction/candidate-a/18-tablet.png) | [B18](media/machine-lab/arrival-direction/candidate-b/18-tablet.png) |
| Narrow mobile, 360 × 800 | [A19](media/machine-lab/arrival-direction/candidate-a/19-narrow-mobile.png) | [B19](media/machine-lab/arrival-direction/candidate-b/19-narrow-mobile.png) |

## Known limitations

- The default semantic candidate remains a CSS 3D composition and needs final acceptance in the real Arrival layout and all production browser targets.
- The lab does not test production scroll pacing, Threshold crossing, or handoff into the workspace.
- Candidate durations describe button playback in the lab, not a committed production scroll distance.
- Mobile retains the same stage order at a shorter duration; physical-device review may still justify a static open state during production integration.
- Materials and the layered contact footprint are intentionally restrained lab treatments rather than a physically calibrated product-rendering study.
- The approximately 982 KB emitted Three/R3F lab-only cost needs a stricter production loading plan before integration.
- No Firefox run is claimed by this Chromium-only Playwright configuration.

## Recommendation

**Proceed to a separate production-integration proposal using Candidate A as the direction.**

Candidate A makes the machine, lid, screen, identity, reframe, and dolly readable as consecutive events while retaining the accepted model and mechanics. Candidate B proves the sequence can be compressed coherently, but it gives the powered display and identity less breathing room and is therefore rejected as the primary direction. Model attribution and modification notice remain unchanged. Production integration, scroll mapping, final browser acceptance in the real Arrival composition, and the lab-only bundle budget remain separate future decisions; Machine Lab stays isolated and the production route stays unchanged in PR #29.
