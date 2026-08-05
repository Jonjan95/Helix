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

1. **Reframe:** the camera makes a very small outward anticipation, performs most of its lateral and vertical correction while it remains distant, and settles almost square to the display.
2. **Dolly:** the camera completes its remaining alignment early, then travels primarily along the display's forward axis toward a clear end frame.

Both paths use a monotonic quintic ease. Acceleration and deceleration reach zero at each endpoint, avoiding a robotic start or stop without bounce, elastic movement, or overshoot. The existing hold between reframe and dolly remains intact.

The look target has its own motivation. It acquires the screen slightly ahead of the camera position, then remains locked to the display through the dolly. The effect is that attention reaches the destination first and the camera follows, while the display stays stable during the final approach.

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

## Remaining polish

- Review the exact canvas-to-threshold blend on a wider range of physical GPUs and display densities.
- Measure real-user loading behaviour before choosing whether the idle timeout should change.
- Revisit the compact desktop boundary only if evidence supports extending the WebGL presentation below the current desktop breakpoint.
- Treat material, camera, model, and timing changes as Machine Lab work first; production should continue to consume an accepted lab sequence.

These are calibration items, not prerequisites for the fallback architecture. Downstream chapters and the Helix path remain intentionally unchanged.
