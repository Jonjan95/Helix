# The Machine

The laptop is the first physical object in Helix and the threshold into the
portfolio. It must explain that relationship through form and behaviour, not
through decorative hardware detail. This record documents the second design
decision in draft PR #27: **The Opening Machine**.

## Human review decision

The earlier **Refined workstation** direction was rejected.

Its display, hinge rail, perspective deck, and front edge were composed as
separate visual layers. Although each layer added laptop-like detail, their
geometry did not share a convincing mechanical relationship. The screen read
as a framed rectangle above a stack of floating lower surfaces, and the hinge
did not explain how those surfaces belonged together.

The problem was structural rather than cosmetic. More shading or hardware
detail would have made the illustration busier without making the machine
more believable.

The rejected direction is retained in
[`media/the-machine/rejected`](media/the-machine/rejected) for comparison.

## Selected concept: The Opening Machine

Arrival now begins with a nearly closed, unpowered laptop. The visitor's first
scroll input opens the lid around its rear axis, activates the screen, reveals
Jonathan's identity, and then begins the already accepted camera approach.

Opening is part of the story:

`closed object → working machine → personal identity → digital threshold`

It is not an idle flourish or a separate animation. Forward scroll constructs
the portal; reverse scroll closes it again.

## Mechanical model

The physical machine is one CSS 3D scene with a shared coordinate system.

- The base is one grounded assembly containing the deck, rear edge, restrained
  keyboard field, trackpad, and connected front edge.
- The lid has separate front and rear surfaces.
- The lid's transform origin is the lower rear edge, aligned with the base's
  rear edge.
- Two restrained hinge barrels sit on that shared axis and remain part of the
  same scene.
- The lid rotates with `rotateX`; the base does not counter-animate or float.
- A single contact shadow changes scale and opacity as the machine opens.
- The scene's perspective is owned by the laptop root, while
  `transform-style: preserve-3d` is limited to the mechanical subtree.

This model explains the object with one relationship instead of layering a
screen illustration over an unrelated base.

## Opening sequence

### 1. Closed machine

Desktop begins at a restrained 78-degree lid rotation. Tablet begins at 68
degrees so the shallower scene remains legible. The display is unpowered,
Jonathan's screen identity is not visually present, and the scroll cue remains
available. The closed silhouette and hinge establish the physical object.

### 2. Mechanical opening

The lid rotates to the accepted open position with `power2.inOut`. The base
stays grounded while the complete scene settles into its open composition.
The contact shadow broadens without bounce, elasticity, or spring motion.

### 3. Screen activation

The flat screen portal begins activating only after the lid is substantially
open. Glass and grid light appear first; Jonathan's identity follows. The
brief ordering makes the text feel powered by the machine rather than pasted
onto a moving surface.

### 4. Approach

Once open, the accepted camera calculation approaches the display. Camera
start changes from timeline position `0.12` to `0.28`, and camera duration
changes from `0.76` to `0.60`, reserving the first part of the existing pin for
the opening without changing the camera destination. Arrival copy recession
moves from `0.22` to `0.30` so the initial scene remains calm.

### 5. Crossing

The accepted Threshold handoff still begins at `0.60`. Its identity departure,
grid handoff, glass depth, shell/base departure, screen coverage, and workspace
continuity values are unchanged. The desktop pin-distance profile is also
unchanged: 1,150px at 1440 × 1000.

## Text-rendering strategy

Jonathan's identity remains semantic HTML and the page retains one `h1`.

The semantic screen portal is a flat sibling of the mechanical 3D scene. It is
not a child of the rotating lid, does not use `preserve-3d`, and receives no
independent scale, `translateZ`, blur, filter, or texture. It is visually
hidden while the lid moves through unreadable angles, then aligned with the
open decorative display before its opacity increases.

This separation allows the decorative lid to carry physical motion while the
readable identity stays crisp. The existing root-level camera approach still
moves the complete composition, and the identity exits before the final
high-scale Threshold phase. Reverse travel restores the same flat text and
then removes it before the lid closes.

The semantic content exists in the server-rendered document at every stage;
animation changes only its visual presentation.

## Responsive simplification

### Desktop

Desktop receives the complete five-stage opening sequence, full 3D lid range,
screen activation, camera approach, and accepted pinned Threshold.

### Tablet

Tablet keeps the same narrative but begins from a shallower 68-degree closed
angle and uses the existing reduced camera depth. Fine keyboard detail is
quieter. It retains one pin and the existing shorter tablet distance profile.

### Mobile

Mobile uses a stable open silhouette in normal document flow. It does not run
the mechanical opening or create a pin. Keyboard and trackpad detail are
removed, while the semantic identity and existing short screen handoff remain
available.

### Reduced motion

Reduced motion presents the stable open laptop, powered display, semantic
identity, and complete journey immediately. It creates no pin and no lid
animation. The same component and document order are used; there is no
separate reduced-motion implementation.

## Motion ownership and performance

The opening is part of the existing `JourneyMotion` GSAP timeline. Configuration
for the desktop and tablet opening is centralized in
`journey-motion.config.ts`.

The change adds no local `ScrollTrigger`, second motion owner, frame loop,
client state, dependency, image, canvas, WebGL, Three.js, or React Three Fiber.
The route remains statically generated. The recording script drives native
scroll only for evidence capture; it is not production code.

## Evidence

Evidence is stored in [`media/the-machine`](media/the-machine):

- [`rejected`](media/the-machine/rejected) contains the human-rejected refined
  workstation;
- [`after`](media/the-machine/after) contains the Opening Machine sequence,
  responsive states, reduced-motion state, metrics, and forward/reverse
  recording.

The revised set includes:

1. rejected workstation;
2. closed state;
3. opening midpoint;
4. fully open state;
5. screen activation;
6. approach;
7. Threshold crossing;
8. reverse closing;
9. compact desktop;
10. tablet;
11. mobile;
12. reduced motion.

## Known limitations

- CSS perspective describes a coherent hinge relationship but is not a
  mechanical simulation.
- The keyboard remains an abstract surface cue rather than individually
  modelled keys.
- Lid edge thickness is deliberately understated and may vary slightly with
  browser antialiasing and device-pixel density.
- The flat semantic screen portal aligns with the decorative display only
  after the lid is substantially open; it is intentionally invisible before
  that point.
- Automated reflow, keyboard, and reduced-motion checks do not replace
  hands-on assistive-technology and physical-device review.
- PR #26 content decisions, direct chapter access, project evidence, and later
  chapter density remain outside this revision.

## Recommendation

**Keep.** The new concept resolves the structural rejection: base, hinge, and
lid now share one scene and one physical axis, while screen activation explains
why the portfolio identity appears. It adds narrative meaning without adding a
second motion system, disturbing the accepted Threshold, or forcing complex 3D
behaviour onto mobile and reduced-motion visitors.

Revise further only if human review finds the closed angle too shallow or too
opaque at a specific approved viewport. Such a revision should tune the
centralized opening profile, not reopen the mechanical architecture.
