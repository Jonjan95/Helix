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
  HelixChapter.tsx        Reusable node-to-content attachment composition
  HelixJourney.tsx        Shared Orientation and Engineering environment
  HelixScene.tsx          Decorative SVG journey spine
  JourneyChapter.tsx       Semantic wrapper for narrative chapters
  motion/                  Scoped motion boundaries and configuration
  sections/                Hero and portfolio section components
  Laptop.tsx               CSS-built hero object
  ScrollIndicator.tsx      In-page navigation cue
data/
  helix-chapters.ts       Typed semantic content for implemented helix stops
  portfolio-sections.ts    Typed placeholder portfolio content
docs/                      Product and technical documentation
styles/                    Component-scoped CSS Modules
tests/                     Playwright end-to-end tests
utils/                     Small reusable, framework-independent helpers
```

## Rendering and content

The initial page is rendered with React Server Components and requires no client-side JavaScript for its core content. Section and helix-chapter data are kept in typed local modules so provisional content can change without entering presentation or motion configuration. The journey motion boundary is a progressive client enhancement around this server-rendered content; it does not replace or duplicate the semantic source.

The page follows the six chapters defined by the [Experience Architecture](experience-architecture.md): arrival, orientation, engineering, selected work, proof, and future. Each chapter is a semantic `<section>` labelled by its visible heading and carries a stable internal `data-chapter` value. These attributes describe narrative structure; they are not visible navigation labels or animation behavior. Existing URL fragments remain on the content within each chapter.

## Styling

Global CSS owns design tokens, baseline element behavior, focus treatment, and the reduced-motion policy. CSS Modules keep component presentation local. The [Helix design system](design-system.md) is the primary reference for visual and interaction decisions. The laptop is built with HTML and CSS, avoiding image dependencies and heavy 3D rendering in the first milestone.

## Motion strategy

### Workspace-to-Engineering journey

`HelixJourney` composes the Orientation and Engineering chapter landmarks inside one continuous workspace field. `DigitalWorkspace` owns the semantic Orientation heading, concise provisional copy, and entry frame. The parent journey owns the shared graphite grid so the helix can emerge without a new panel, background, or section border.

`HelixScene` owns only the finite decorative SVG: two rails, twelve rungs, six node positions, and the active Engineering visual state. `HelixChapter` owns the reusable attachment composition around that presentation: semantic content, a restrained connector, and a continuing-path cue. Engineering is the first use of this pattern. Its heading, introduction, and principles come from `helix-chapters.ts` and remain outside the decorative SVG and motion configuration.

`ArrivalOrientationTransition` continues to own all motion through one scoped GSAP context and one responsive `gsap.matchMedia()` configuration. The approved Arrival camera timeline remains unchanged. One unpinned helix timeline now coordinates the structure reveal, Engineering-node emphasis, connector, semantic content, and path continuation. Stable `data-motion` hooks keep this orchestration independent from CSS Module names, while selectors, breakpoints, and motion values remain centralized in `arrival-orientation.config.ts`.

Desktop places the journey spine and Engineering content in one asymmetric composition. Tablet reduces their separation without changing the relationship. Mobile uses a stacked native-flow composition with the content close to the relevant path segment. The reduced-motion branch creates no timeline, ScrollTrigger, pin, screen-entry zoom, or helix depth movement; it clears enhancement styles so the active node and all Engineering content appear statically in document order.

GSAP contexts, ScrollTriggers, and match-media registrations are reverted when the boundary unmounts or a media condition changes. The timelines animate transforms and opacity, do not update React state per frame, and preserve native scrolling. Later node attachments, node navigation, route transitions, Three.js, React Three Fiber, WebGL, and the complete helix journey remain deferred. See the focused [helix concept](helix-concept.md) for the narrative and visual boundary.

## Testing

Playwright starts the built production server and verifies the identity, laptop, workspace, finite SVG, active Engineering node, semantic heading, introduction, and principles. It checks the node-to-content structural association, chapter order, skip link, console safety, forward activation, reverse restoration, and reduced-motion static route. Horizontal overflow is checked through the Engineering stop at representative desktop, laptop, tablet, and mobile widths. Future milestones should extend this same outcome-based pattern when later nodes are implemented.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
