# Architecture

Helix uses a deliberately small architecture for its static foundation.

## Application structure

```text
app/
  globals.css              Global tokens, reset, and reduced-motion policy
  layout.tsx               Document metadata and root layout
  page.tsx                 Page composition
components/
  HelixChapter.tsx         Reusable node-to-content attachment composition
  HelixChapterContent.tsx  Explicit semantic content for each journey stop
  HelixJourney.tsx         Shared environment for the complete journey
  HelixPath.tsx            One decorative SVG path spanning every stop
  JourneyChapter.tsx       Semantic wrapper for narrative chapters
  motion/
    JourneyMotion.tsx      Scoped arrival and journey orchestration
    journey-motion.config.ts  Central selectors, breakpoints, and values
  sections/                Hero and portfolio section components
  Laptop.tsx               CSS-built hero object
  ScrollIndicator.tsx      In-page navigation cue
data/
  helix-chapters.ts        Typed semantic content and placement for five stops
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

### Complete journey graybox

`HelixJourney` composes Orientation, Engineering, Selected Work, Proof, and Future as five semantic chapter landmarks inside one continuous workspace field. It renders one `HelixPath` behind every stop instead of giving each chapter a separate panel or decorative fragment. The path is a visual relationship layer only: it is non-focusable, hidden from assistive technology, and contains no essential labels.

`HelixChapter` owns the repeated relationship between one node, one restrained connector, and one semantic content region. `HelixChapterContent` keeps the chapter-specific markup explicit so lists, project summaries, and contact routes can use the elements their meaning requires. `helix-chapters.ts` centralizes typed narrative content, document chapter names, placement, and pacing without turning the page into a generic content builder.

`JourneyMotion` owns both the approved Arrival camera transition and the full journey enhancement through one scoped GSAP context and one responsive `gsap.matchMedia()` configuration. A path timeline introduces the shared structure. Five local chapter timelines update direct DOM state attributes and coordinate each node, connector, and content entrance as the visitor reaches it. Stable `data-motion` and `data-journey-*` hooks keep orchestration independent from CSS Module names; selectors, breakpoints, durations, and travel values remain centralized in `journey-motion.config.ts`.

Desktop preserves the complete alternating node-to-content composition. Tablet reduces separation while keeping the relationship legible. Mobile uses a vertical path beside stacked semantic content, a short unpinned Arrival handoff, and smaller transform distances. The reduced-motion branch creates no camera timeline, journey timeline, ScrollTrigger, or pin; it clears enhancement styles and marks every chapter static so the full experience remains available in document order.

GSAP contexts, ScrollTriggers, and match-media registrations are reverted when the boundary unmounts or a media condition changes. Timelines animate transforms and opacity, do not update React state on scroll frames, and preserve native scrolling. Node controls, case-study interactions, route transitions, Three.js, React Three Fiber, WebGL, and final visual composition remain deferred. See the focused [helix concept](helix-concept.md) for the narrative and visual boundary.

## Testing

Playwright starts the built production server and verifies the identity, laptop, shared path, all five semantic chapters, chapter order, expected headings, and node-to-content associations. It checks the skip link, keyboard focus, console safety, forward progression through every stop, reverse restoration toward the workspace, and the complete reduced-motion static route. Horizontal overflow and responsive composition are checked at representative desktop, laptop, tablet, and mobile widths. Tests assert stable outcomes rather than intermediate transform values or fragile screenshots.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
