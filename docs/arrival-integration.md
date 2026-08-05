# Arrival integration

## Status

PR #30 moves the proven Candidate A Machine Lab sequence into the production Arrival while keeping the CSS Threshold intact. The change is deliberately reversible: the production page selects a presentation, but it does not replace the journey, its content, or its scroll architecture.

## Production architecture

Arrival has three cooperating layers:

1. `HeroSection` keeps the original server-rendered CSS laptop and semantic identity in document order.
2. `ProductionArrivalMachine` progressively mounts the shared `MachineCanvas` over that CSS foundation when the machine mode is supported.
3. `JourneyMotion` remains the sole production scroll owner. It publishes the existing normalized Arrival progress to a small subscription bridge; the machine consumes that value without creating a scroll listener or ScrollTrigger.

The Machine Lab remains the tuning environment. Production imports the same canvas, runtime hinge, fitted screen plane, semantic HTML screen treatment, lighting, model path, and Candidate A sequence definition. It does not copy the lab animation logic.

The CSS scene stays mounted beneath the canvas. During the final machine approach, the canvas yields to the existing screen and workspace Threshold. This preserves the established crossing and its normal-flow handoff instead of introducing a second transition.

## Machine sequence

Production uses Candidate A (`cinematic`) without changing its internal timing:

- machine reveal and hold;
- mechanical lid opening and hold;
- screen activation and hold;
- semantic identity reveal and hold;
- camera reframe;
- identity departure;
- camera dolly.

The Candidate A sequence occupies the opening portion of the existing pinned Arrival interval. The remainder belongs to the accepted CSS Threshold handoff. Reverse scrolling feeds the same progress in reverse, restoring both layers coherently.

## Semantic identity

The existing Arrival `h1` remains server-rendered in the CSS foundation, so the document keeps one primary heading before JavaScript, during loading, after a failure, and while the machine is active. The fitted screen treatment is still real HTML rendered outside WebGL. In production it is marked decorative to prevent the repeated visual treatment from creating a second accessible heading. No identity text is rendered into canvas, SVG, an image, or a texture.

## Loading strategy

The CSS laptop is the initial render and LCP-safe presentation. Three.js, React Three Fiber, Drei, the machine canvas, and the GLB remain behind a client-only dynamic import. Production begins that import during browser idle time (with a bounded timeout) after checking the selected mode, viewport, reduced-motion preference, and WebGL support.

The model is approximately 395 KiB. Neither it nor the renderer is part of server rendering. The Machine Lab continues to use the same dynamically loaded module.

## Fallback strategy

The CSS Threshold is used when:

- `arrivalMode` is `css`;
- the viewport uses the compact unpinned journey;
- WebGL context creation is unavailable;
- the machine component or model fails to load.

Reduced motion is intentionally different: on a capable desktop it presents the shared machine in its stable open state, keeps all content visible, and introduces no pin or camera movement. If WebGL is unavailable there as well, the complete CSS presentation remains available.

Failure is local to Arrival. The downstream Helix journey, navigation, semantic content, and native scrolling do not depend on the canvas.

## Feature flag and development checks

The build-time flag is `arrivalMode`, exported from `lib/arrival/arrival-mode.ts`. Its default is `machine`; setting `NEXT_PUBLIC_ARRIVAL_MODE=css` selects the CSS presentation.

For quick local comparison, `?arrival=css` and `?arrival=machine` override the build default. `?webgl=off` exercises capability fallback, and `?machine=error` exercises the load-failure outcome without corrupting the model.

## Responsive behaviour

Desktop receives the complete Candidate A sequence. Compact laptop/tablet and mobile layouts retain the established CSS journey, normal document flow, and mobile no-pin rule. Reduced-motion desktop uses the static open machine. The order and meaning of the semantic content do not change between modes.

## Physical camera language

The first production integration moved the camera by interpolating directly from its opening coordinates to one reframe coordinate and then to one dolly coordinate. Although the stages were correctly separated, the shortest-path interpolation made the camera feel automated: lateral alignment, vertical alignment, and forward travel happened together, and the look target arrived at the display at the same rate as the camera body.

The camera now follows two connected cubic spatial paths without changing the Candidate A stage boundaries:

1. **Reframe:** the camera distributes its lateral and vertical correction across the complete path while it remains distant, then settles almost square to the display. This avoids preserving most of the orientation change for the last part of the stage.
2. **Dolly:** the camera completes its remaining alignment early, then travels primarily along the display's forward axis toward a clear end frame.

Both paths use a monotonic quintic ease. Acceleration and deceleration reach zero at each endpoint, avoiding a robotic start or stop without bounce, elastic movement, or overshoot. The existing hold between reframe and dolly remains intact.

The look target follows its own continuous cubic path. It acquires the screen slightly ahead of the camera position, then remains locked to the display through the dolly. The effect is that attention reaches the destination first and the camera follows, while the display stays stable during the final approach.

## Continuity audit

Human review found a visible side-to-front composition jump during a small scroll movement. The audit covered camera position and target, machine and lid transforms, the screen plane, semantic HTML anchor, opacity, light intensity, stage boundaries, the Threshold handoff, and runtime presentation ownership.

Four continuity risks were found:

1. **Two progress clocks:** production published raw `ScrollTrigger` progress to the WebGL machine while GSAP's scrubbed timeline drove the CSS Threshold. A wheel step could move the machine immediately while the surrounding scene was still settling.
2. **Late orientation correction:** the previous reframe control points preserved too much lateral and angular correction for the end of the reframe, making a continuous path appear like a switch at normal scroll speed.
3. **Conditional camera ownership:** reframe and dolly were selected as separate paths at a boundary. Their positions met, but the implementation expressed an immediate controller handoff rather than shared ownership.
4. **Runtime presentation activation:** the model-ready callback fired before the first progress-correct WebGL frame was guaranteed to have been painted.

The correction keeps the approved timing, scroll distance, lighting, model, HTML, and downstream journey intact:

- the machine now consumes the scrubbed GSAP timeline progress used by the surrounding Threshold;
- reframe control points spread alignment across the path, and the look target follows a continuous cubic path;
- reframe and dolly share ownership through the opening 20% of the dolly range with a quintic blend;
- the WebGL scene applies the current normalized progress before its first render, remains visually hidden for two committed frames, and only then takes ownership from the loading fallback;
- a normalized 4,000-sample audit verifies bounded changes in camera position, target, and view direction, including epsilon checks on every camera and sequence-stage boundary.

Machine and lid rotation, screen power, semantic identity visibility, light intensity, and the screen-plane hierarchy already derive from continuous stage functions. No separate animation owner, local ScrollTrigger, machine rotation switch, or HTML-anchor reparenting was found. The Threshold crossfade remains part of the single `JourneyMotion` timeline and now shares its progress source with the machine.

### Continuity Rules

- Never switch visual ownership instantly.
- Blend between animation systems.
- Adjacent scroll positions should never produce different compositions.
- Motion must remain physically continuous.
- Concurrent layers must consume the same authoritative progress value.
- A loading-state handoff must preserve the current composition rather than reveal a new one.

The mathematical audit did not expose a camera-path discontinuity, but later human review still found a visible composition switch. That review was authoritative and led to the renderer-ownership audit below.

## Renderer ownership audit

The remaining side-to-front jump was a perceptual handoff between two different laptop representations, not a discontinuity inside the WebGL camera. During the original Machine-to-Threshold range, the page crossfaded the WebGL machine into the complete CSS laptop. At normalized progress `0.69`, both representations were approximately half visible even though their projected geometry did not match.

At the 1440 × 1000 review viewport, the measured differences were:

- CSS screen width: 1556.08 px; WebGL screen width: 556.17 px; difference: 999.91 px, or 76.2% of the 1312 px scene width;
- CSS screen height: 938.50 px; WebGL screen height: 347.75 px; difference: 590.75 px, or 108.0% of the 547.19 px scene height;
- screen center: 8.12 px horizontal and 105.26 px vertical difference;
- outer machine silhouette: 451.37 px width and 238.84 px height difference;
- base center: 321.42 px vertical difference;
- CSS display perspective: flat, while the WebGL display retained the fitted 3D camera projection.

Opacity interpolation could not make those compositions continuous. It only made both mismatched silhouettes visible together.

The successful enhanced path now has one laptop owner:

1. The complete CSS laptop remains available while WebGL loads and for explicit CSS mode, compact layouts, WebGL failure, and model failure.
2. The WebGL scene initializes at the normalized progress already owned by `JourneyMotion`.
3. It renders two stable hidden frames with the current lid, screen, identity, camera, and model state before its ready callback transfers ownership.
4. If the visitor has already moved beyond the initial 4% of Arrival when loading finishes, the page retains CSS ownership for that visit rather than switching renderer mid-sequence.
5. Once ready near the initial state, WebGL is the only visible laptop representation for the complete Machine range.
6. During the existing Threshold range, only the neutral CSS workspace layer may appear over WebGL. The CSS shell, camera, base, screen identity, grid, glass, screen background, border, and frame remain visually suppressed.

The semantic CSS identity remains in the document and accessible; only its visual opacity is suppressed after WebGL takes ownership. No production control, additional scroll owner, timing change, camera-path change, or downstream journey change was introduced.

### Diagnostic review mode

The internal query parameter `arrivalDiagnostic` isolates the three reviewed representations:

- `?arrivalDiagnostic=css` shows the complete CSS composition;
- `?arrivalDiagnostic=webgl` shows the WebGL composition at the same progress;
- `?arrivalDiagnostic=combined` preserves the rejected legacy crossfade for comparison.

`?arrivalDiagnostics=on` leaves the corrected production composition intact while recording the active owner, CSS and WebGL opacity, normalized and Machine progress, camera position and target, lid angle, and projected screen, machine, and base bounds. Diagnostics are disabled by default and add no production UI.

Machine Lab supports a temporary `?cameraDebug=on` review mode. It uses a fixed observer view to draw the camera path, the current virtual camera position, and the active look target. The mode is disabled by default, has no production control, and does not alter production rendering.

Remaining camera review should focus on physical devices: perceived velocity at very high refresh rates, the final screen-edge framing across unusual aspect ratios, and whether the compact Machine Lab preview needs its own camera path. These observations should not change sequence timing or threshold composition without separate approval.

### Camera evidence

The reproducible review set is stored in `docs/media/arrival-integration/physical-camera/`:

- `01-initial-framing.png`;
- `02-reframe.png`;
- `03-dolly-start.png`;
- `04-dolly-midpoint.png`;
- `05-dolly-end.png`;
- `06-reverse.png`;
- `07-debug-path.png`;
- `08-forward-reverse.webm`.

The stills use exact Machine Lab progress positions. The reverse still and recording use the real deterministic playback controls rather than synthesized transform values.

The continuity revision evidence is stored in `docs/media/arrival-integration/physical-camera/continuity/`:

- `01-before-discontinuity.png` and `02-discontinuity-frame.png` preserve the reviewed side-to-front comparison;
- `03-after-fix.png` shows the revised composition at the former transition range;
- `04-forward.png` and `05-reverse.png` use the real deterministic controls;
- `06-debug-ownership.png` shows the shared reframe-to-dolly ownership region;
- `07-slow-forward-reverse.webm` records small native scroll increments through the production sequence in both directions.

The renderer-ownership evidence is stored in `docs/media/arrival-integration/renderer-handoff/`:

- `01-current-css-only.png`, `02-current-webgl-only.png`, and `03-current-combined.png` show the three representations at the same former-jump progress;
- `04-revised-before.png`, `05-revised-transfer.png`, and `06-revised-after.png` show the corrected production composition at `p - 0.002`, `p`, and `p + 0.002`;
- `frame-0.688.png` through `frame-0.692.png` preserve the complete one-frame audit range;
- `07-slow-forward.webm` and `08-slow-reverse.webm` record the actual production page;
- `09-frame-audit.json` records active ownership, opacity, progress, camera, target, lid angle, projected bounds, and the measured CSS/WebGL differences.

## Remaining polish

- Review the exact canvas-to-threshold blend on a wider range of physical GPUs and display densities.
- Measure real-user loading behaviour before choosing whether the idle timeout should change.
- Revisit the compact desktop boundary only if evidence supports extending the WebGL presentation below the current desktop breakpoint.
- Treat material, camera, model, and timing changes as Machine Lab work first; production should continue to consume an accepted lab sequence.

These are calibration items, not prerequisites for the fallback architecture. Downstream chapters and the Helix path remain intentionally unchanged.
