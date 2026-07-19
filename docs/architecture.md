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

### Arrival-to-Orientation workspace transition

The first scroll-linked experience is intentionally limited to the threshold between Arrival and Orientation. `DigitalWorkspace` owns the semantic Orientation heading, concise provisional copy, and the restrained 2.5D environment built from CSS surfaces, borders, grid lines, and a central path. The laptop contains a separate aria-hidden threshold layer that previews the same visual language without duplicating Orientation's information.

`ArrivalOrientationTransition` continues to own the complete motion sequence through one scoped GSAP context and one responsive `gsap.matchMedia()` configuration. Stable `data-motion` attributes connect that controller to the laptop shell, screen identity, threshold, and workspace without coupling GSAP to CSS Module class names. Measurements, breakpoints, scroll distances, and handoff values remain centralized in `arrival-orientation.config.ts`.

Desktop preserves the approved short pin and full camera approach, then recedes the physical shell near the final threshold. Tablet uses the existing shorter and less aggressive profile. Mobile remains unpinned and uses a restrained identity-to-threshold handoff in native document flow. The reduced-motion branch creates no timeline, ScrollTrigger, pin, or screen-entry zoom; Arrival and the semantic workspace remain consecutive sections with all Orientation content visible.

GSAP contexts and match-media registrations are reverted when the boundary unmounts or a media condition changes. The handoff animates transforms and opacity, does not update React state per frame, and preserves native scrolling. A wider workspace system, animation beyond Orientation, final portfolio content, route transitions, Three.js, WebGL, and the helix visualization remain deferred.

## Testing

Playwright starts the built production server and verifies the public behavior that matters at this stage: the page loads, the identity, laptop, and digital workspace exist, all narrative chapters appear in the intended order, the motion boundary initializes without console errors, Orientation remains reachable, and upward scrolling returns to Arrival. Reduced motion keeps both chapters in static flow without pinning and exposes the essential Orientation heading and copy. Horizontal overflow is checked before and after entering the workspace at representative desktop, laptop, tablet, and mobile widths. Future milestones should add deeper keyboard and transition coverage as behavior becomes more complex.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
