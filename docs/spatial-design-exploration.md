# Spatial design exploration

This experiment asks one narrow question: can spatial depth make the laptop-to-journey threshold more intentional without weakening clarity, accessibility, performance, or the calm character of Helix?

It is not a production redesign. The comparison lives only at the unlinked, `noindex` route `/lab/spatial`. The production homepage, its semantic chapters, and the single `JourneyMotion` owner are unchanged.

## Boundaries

- Portfolio meaning remains in server-rendered HTML.
- Canvas and SVG are decorative comparison layers, never content containers.
- Native scrolling, keyboard controls, and the production route remain intact.
- Reduced motion produces static compositions, not incomplete animations.
- Three.js is loaded dynamically only after direction C is selected.
- The lab is omitted from the sitemap and disallowed under `/lab/` in configured robots output.
- No React Three Fiber, new scroll controller, particle field, external model, or production WebGL dependency was introduced.

## Shared comparison

All directions use one native control surface: prototype radios, subtle/strong depth, forward/reverse/reset, and a reduced-motion simulation. Each direction answers the same threshold question and uses the same laptop/workspace vocabulary.

### 00 — production baseline

The baseline reproduces the restrained laptop threshold without experimental depth. It is the control: any added complexity must improve orientation or narrative continuity, not merely look novel.

### A — CSS and GSAP pseudo-3D

CSS perspective separates the laptop shell, identity, threshold, and workspace into physical planes. One scoped GSAP timeline demonstrates a reversible forward/reverse move. This direction preserves DOM composition, has the smallest conceptual gap from the current production motion architecture, and is easy to simplify responsively.

Its limit is also visible: aggressive scale quickly turns a physical laptop into a flat screen. Production use would need a shorter range and more attention to the final handoff than the lab playback.

### B — SVG spatial depth

Layer order, opacity, stroke weight, crossing rails, connectors, and nodes create depth without a camera. It strengthens the Helix as an engineered path and keeps responsive behavior predictable. The SVG is decorative and hidden from assistive technology; the comparison explanation remains ordinary HTML.

This direction communicates path hierarchy well, but it cannot by itself deliver the physical feeling of moving through the display.

### C — direct Three.js proof of concept

The contained WebGL scene uses one screen plane, one three-dimensional curve, four nodes, and one controlled camera tween. It imports `three` only inside the dynamically loaded lab component. Rendering occurs on initial composition, resize, visibility restoration, and tween updates rather than in a permanent animation loop.

The renderer caps device pixel ratio at 1.5, observes its container, pauses visual work when hidden, handles context loss, and disposes tweens, observers, listeners, geometry, materials, renderer, and context on cleanup. When WebGL is unavailable—or `?webgl=off` is used for deterministic review—the lab shows an informative static fallback. Reduced motion renders one static spatial relationship and creates no camera tween.

True depth makes the camera threshold physically distinct, but the improvement is not yet proportional to the runtime weight, responsive tuning, fallback surface, and long-term maintenance cost.

## Evaluation matrix

Scores use a five-point scale. For delivery risk, five means lowest risk.

| Direction | Narrative fit | Visual quality | Accessibility | Performance | Maintainability | Responsive behavior | Delivery risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 3 | 3 | 5 | 5 | 5 | 5 | 5 |
| CSS / GSAP | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| SVG depth | 4 | 4 | 5 | 5 | 4 | 5 | 5 |
| Three.js | 4 | 4 | 3 | 2 | 2 | 3 | 2 |

## Findings

The comparison supports a hybrid direction rather than a full 3D adoption:

1. Retain semantic HTML and the current centralized GSAP ownership.
2. Use restrained CSS perspective for the physical laptop threshold.
3. Use layered SVG for the Helix path once the visitor is inside the workspace.
4. Do not promote Three.js into production at this stage.

CSS supplies the physical transition that SVG cannot. SVG supplies legible, responsive path depth without camera and rendering complexity. Together they serve the narrative with less risk than WebGL and preserve the static experience as the contract.

## Evidence and validation

Committed evidence is stored in [`docs/media/spatial-design`](media/spatial-design). It includes desktop states for all directions, mobile and reduced-motion compositions, the deterministic WebGL fallback, and short forward/reverse recordings for the two moving prototypes.

The focused matrix completes in Chromium and WebKit. Firefox reached every production and lab check during the first pass, exposing only a browser-generated WebGL driver warning that is now separated from application console failures; subsequent Firefox retries could not create page fixtures because the managed browser process failed inside Playwright. That runner limitation is recorded rather than presented as a passing result. The remaining review covers desktop, landscape, tablet/mobile-width document flow; keyboard operation; system and simulated reduced motion; forced WebGL fallback; console output; overflow; static generation; and production-route isolation. Exact command results and bundle measurements are recorded in PR #19.

The production homepage requested 651,816 decoded bytes of JavaScript in the route-level measurement. The lab baseline requested 602,535 bytes. Selecting Three.js raised the lab total to 1,332,910 bytes: a 730,375-byte decoded increment, including a 725,217-byte Three.js chunk (183,530 bytes transferred in the measured local production session). That chunk was not requested by `/`.

## Intentionally deferred

- production laptop or journey changes;
- scroll-linked integration of the preferred hybrid;
- final camera choreography;
- interactive Helix nodes;
- Three.js, WebGL, or canvas on the production route;
- external models, textures, lighting systems, and asset pipelines;
- route transitions or a second motion owner.

The next implementation PR should be a small CSS/SVG threshold prototype on top of the existing production architecture, with its own before/after evidence and no WebGL dependency.
