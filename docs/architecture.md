# Architecture

Helix uses a deliberately small architecture for its static foundation.

## Application structure

```text
app/
  globals.css              Global tokens, reset, and reduced-motion policy
  layout.tsx               Document metadata and root layout
  page.tsx                 Page composition
components/
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

The initial page is rendered with React Server Components and requires no client-side JavaScript for its core content. Section data is kept in a typed local module so placeholder content can be replaced without changing layout code. Every primary area is a semantic `<section>` with a stable URL fragment and labelled heading.

## Styling

Global CSS owns design tokens, baseline element behavior, focus treatment, and the reduced-motion policy. CSS Modules keep component presentation local. The [Helix design system](design-system.md) is the primary reference for visual and interaction decisions. The laptop is built with HTML and CSS, avoiding image dependencies and heavy 3D rendering in the first milestone.

## Motion strategy

There is no timeline or scroll-linked animation yet. GSAP is installed only to establish the intended dependency. When animation is introduced, it should progressively enhance the existing page, isolate client-side behavior to the smallest useful boundary, and use `gsap.matchMedia()` alongside the CSS `prefers-reduced-motion` policy.

## Testing

Playwright starts the built production server and verifies the public behavior that matters at this stage: the page loads, the identity and laptop hero are visible, every primary portfolio section exists, and the document has no horizontal overflow at representative desktop and mobile widths. Future milestones should add deeper keyboard, reduced-motion, responsive, and transition coverage as behavior becomes more complex.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
