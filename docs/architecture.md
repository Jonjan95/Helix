# Architecture

Helix uses a deliberately small architecture for its static foundation.

## Application structure

```text
app/
  globals.css              Global tokens, reset, and reduced-motion policy
  layout.tsx               Document metadata and root layout
  page.tsx                 Page composition
components/
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

### Arrival-to-Orientation transition

The first scroll-linked prototype is intentionally limited to the threshold between Arrival and Orientation. A dedicated client component owns one scoped GSAP context, one responsive `gsap.matchMedia()` configuration, and stable `data-motion` targets inside the existing chapters. Animation measurements and timing values live beside that component in one configuration module; presentational components only expose the minimal hooks the boundary requires.

Desktop uses a short pinned, reversible camera move that scales and positions the physical laptop around its display while surrounding hero content recedes. Tablet uses a shorter, constrained version. Mobile keeps native document flow and applies only a restrained scale-and-recede treatment. The reduced-motion branch creates no timeline, ScrollTrigger, or pin, so Arrival and Orientation remain a direct static sequence with all content available.

GSAP contexts and match-media registrations are reverted when the boundary unmounts or a media condition changes. The prototype animates transforms and opacity, does not update React state per frame, and preserves native scrolling. The digital workspace, a literal passage through the display, unrelated chapter animation, route transitions, and the helix visualization remain deferred.

## Testing

Playwright starts the built production server and verifies the public behavior that matters at this stage: the page loads, the identity and laptop hero are visible, all narrative chapters appear in the intended order, the motion boundary initializes without console errors, Orientation remains reachable, upward scrolling returns to Arrival, and reduced motion keeps both chapters in static flow without pinning. Horizontal overflow is checked at representative desktop, laptop, tablet, and mobile widths. Future milestones should add deeper keyboard and transition coverage as behavior becomes more complex.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
