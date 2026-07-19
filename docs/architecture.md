# Architecture

Helix uses a deliberately small architecture for its static foundation.

## Application structure

```text
app/
  globals.css              Global tokens, reset, and reduced-motion policy
  layout.tsx               Document metadata and root layout
  page.tsx                 Page composition
components/
  DigitalWorkspace.tsx    Semantic Orientation workspace
  HelixScene.tsx          Decorative SVG relationship structure
  JourneyChapter.tsx       Semantic wrapper for narrative chapters
  motion/                  Scoped motion boundaries and configuration
  sections/                Hero and portfolio section components
  Laptop.tsx               CSS-built hero object
  ScrollIndicator.tsx      In-page navigation cue
data/
  portfolio-sections.ts    Typed placeholder portfolio content
docs/                      Product and technical documentation
styles/                    Component-scoped CSS Modules
tests/                     Playwright end-to-end tests
utils/                     Small reusable, framework-independent helpers
```

## Rendering and content

The initial page is rendered with React Server Components and requires no client-side JavaScript for its core content. Section data is kept in a typed local module so placeholder content can be replaced without changing layout code. The Arrival-to-Orientation motion boundary is a progressive client enhancement around this server-rendered content; it does not replace or duplicate the semantic source.

The page follows the six chapters defined by the [Experience Architecture](experience-architecture.md): arrival, orientation, engineering, selected work, proof, and future. Each chapter is a semantic `<section>` labelled by its visible heading and carries a stable internal `data-chapter` value. These attributes describe narrative structure; they are not visible navigation labels or animation behavior. Existing URL fragments remain on the content within each chapter.

## Styling

Global CSS owns design tokens, baseline element behavior, focus treatment, and the reduced-motion policy. CSS Modules keep component presentation local. The [Helix design system](design-system.md) is the primary reference for visual and interaction decisions. The laptop is built with HTML and CSS, avoiding image dependencies and heavy 3D rendering in the first milestone.

## Motion strategy

### Arrival-to-Orientation workspace and helix transition

The first scroll-linked experience is intentionally limited to the threshold between Arrival and Orientation. `DigitalWorkspace` owns the semantic Orientation heading, concise provisional copy, and the restrained 2.5D environment built from CSS surfaces, borders, grid lines, and a central path. The laptop contains a separate aria-hidden threshold layer that previews the same visual language without duplicating Orientation's information.

`ArrivalOrientationTransition` continues to own the complete motion sequence through one scoped GSAP context and one responsive `gsap.matchMedia()` configuration. Stable `data-motion` attributes connect that controller to the laptop shell, screen identity, threshold, workspace, and helix layers without coupling GSAP to CSS Module class names. Measurements, breakpoints, scroll distances, and motion profiles remain centralized in `arrival-orientation.config.ts`.

Desktop preserves the approved short pin and full camera approach, then recedes the physical shell near the final threshold. After the workspace, a second unpinned timeline in the same controller reveals the finite SVG helix through transforms and opacity while normal scrolling continues toward Engineering. Tablet reduces spatial travel and mobile uses a shorter reveal in native flow. The reduced-motion branch creates no timeline, ScrollTrigger, pin, screen-entry zoom, or helix depth movement; Arrival, the semantic workspace, the complete static helix, and later chapters remain in document order.

`HelixScene` is a presentational Server Component. It owns two SVG rails, twelve rungs, and neutral future node slots, while its CSS Module owns the static and responsive composition. The SVG is decorative and hidden from assistive technology because the semantic chapter content remains the source of meaning. See the focused [helix concept](helix-concept.md) for the narrative boundary and deferred directions.

GSAP contexts, ScrollTriggers, and match-media registrations are reverted when the boundary unmounts or a media condition changes. Both timelines animate transforms and opacity, do not update React state per frame, and preserve native scrolling. Final node content, helix navigation, animation for later chapters, route transitions, Three.js, React Three Fiber, WebGL, and a complete helix journey remain deferred.

## Testing

Playwright starts the built production server and verifies the public behavior that matters at this stage: the page loads, the identity, laptop, workspace, and finite helix structure exist; all narrative chapters appear in order; the motion boundary initializes without console errors; forward scrolling reaches the helix; and upward scrolling returns to Arrival. Reduced motion keeps the journey in static flow without pinning and exposes both the essential Orientation content and complete helix scene. Horizontal overflow is checked before and after entering the workspace and helix at representative desktop, laptop, tablet, and mobile widths. Future milestones should add deeper keyboard and transition coverage as behavior becomes more complex.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
