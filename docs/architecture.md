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
  ExperienceTracks.tsx     Semantic three-track professional narrative
  ProjectShowcase.tsx      Semantic featured and supporting project evidence
  motion/
    JourneyMotion.tsx      Scoped arrival and journey orchestration
    journey-motion.config.ts  Central selectors, breakpoints, and values
  sections/                Hero and portfolio section components
  Laptop.tsx               CSS-built hero object
  ScrollIndicator.tsx      In-page navigation cue
data/
  experience.ts            Verified Experience records and claim boundaries
  helix-chapters.ts        Typed semantic content and placement for five stops
  projects.ts              Verified Selected Projects records and status boundaries
docs/                      Product and technical documentation
styles/                    Component-scoped CSS Modules
tests/                     Playwright end-to-end tests
utils/                     Small reusable, framework-independent helpers
```

## Rendering and content

The initial page is rendered with React Server Components and requires no client-side JavaScript for its core content. Section and helix-chapter data are kept in typed local modules so content can change without entering presentation or motion configuration. The journey motion boundary is a progressive client enhancement around this server-rendered content; it does not replace or duplicate the semantic source.

Selected Projects has a purpose-built `PortfolioProject` model in `data/projects.ts`. Each record carries its identity, role, status, summary, problem, approach, technical evidence, quality evidence, technologies, repository link, scope boundary, and featured state. The model serves this chapter rather than acting as a generic CMS. Content is checked against public repository documentation, source structure, tests, and build configuration before it is published. The resulting local snapshot avoids runtime GitHub requests and states planned or unavailable capability as a boundary rather than an outcome.

Experience follows the same local, chapter-specific approach through the `ExperienceTrack` model in `data/experience.ts`. Each record defines its category, broad timeframe, summary, grounded evidence, relevant environments, and present-day engineering perspective. `ExperienceTracks` renders exactly three semantic articles in narrative order. The data is not a generic résumé schema: it deliberately excludes employers, client identities, guessed dates, quantified impact, and unsupported responsibilities. Ongoing studies are described as ongoing, project practice is not presented as employment, and no runtime résumé service is involved.

The page follows the six chapters defined by the [Experience Architecture](experience-architecture.md): arrival, orientation, engineering, selected work, proof, and future. Each chapter is a semantic `<section>` labelled by its visible heading and carries a stable internal `data-chapter` value. These attributes describe narrative structure; they are not visible navigation labels or animation behavior. Existing URL fragments remain on the content within each chapter.

## Styling

Global CSS owns design tokens, baseline element behavior, focus treatment, and the reduced-motion policy. CSS Modules keep component presentation local. The [Helix design system](design-system.md) is the primary reference for visual and interaction decisions. The laptop is built with HTML and CSS, avoiding image dependencies and heavy 3D rendering in the first milestone.

## Motion strategy

### Complete journey graybox

`HelixJourney` composes Orientation, Engineering, Selected Work, Proof, and Future as five semantic chapter landmarks inside one continuous workspace field. It renders one `HelixPath` behind every stop instead of giving each chapter a separate panel or decorative fragment. The path is a visual relationship layer only: it is non-focusable, hidden from assistive technology, and contains no essential labels.

`HelixChapter` owns the repeated relationship between one node, one restrained connector, and one semantic content region. `HelixChapterContent` keeps the chapter-specific markup explicit so lists, project evidence, experience tracks, and contact routes can use the elements their meaning requires. `ProjectShowcase` renders one featured article and two supporting articles without changing the Projects node, connector, left-side placement, or motion ownership. `ExperienceTracks` renders one emphasized current-direction article followed by two supporting evidence articles without adding a second timeline or an interaction model. `helix-chapters.ts` centralizes typed narrative content, document chapter names, placement, and pacing without turning the page into a generic content builder.

`JourneyMotion` owns both the approved Arrival camera transition and the full journey enhancement through one scoped GSAP context and one responsive `gsap.matchMedia()` configuration. A path timeline introduces the shared structure. Five local chapter timelines update direct DOM state attributes and coordinate each node, connector, and content entrance as the visitor reaches it. Stable `data-motion` and `data-journey-*` hooks keep orchestration independent from CSS Module names; selectors, breakpoints, durations, and travel values remain centralized in `journey-motion.config.ts`.

The journey publishes `upcoming`, `approaching`, `active`, `departing`, and `passed` states at trigger boundaries. It reports no active chapter before Environment begins to approach and uses event-driven attribute changes rather than React state on every scroll frame. Per-role motion ranges let entry, featured, expanded, standard, and exit chapters keep distinct reading spans without scattering thresholds through component code. Initial and changed URL fragments are restored after ScrollTrigger refresh so pinned geometry cannot leave a direct link focused on the wrong stop.

Desktop preserves the complete alternating node-to-content composition. Tablet reduces separation while keeping the relationship legible. Mobile uses a vertical path beside stacked semantic content, a short unpinned Arrival handoff, and smaller transform distances. The reduced-motion branch creates no camera timeline, journey timeline, ScrollTrigger, or pin; it clears enhancement styles and marks every chapter static so the full experience remains available in document order.

Within Selected Projects, desktop gives the featured narrative a two-column evidence rhythm and places the supporting projects side by side beneath it. Laptop and tablet collapse that internal complexity before text becomes cramped. Mobile uses one continuous document column, wraps technology labels, and retains the existing vertical path. These are CSS-only composition changes; no project-specific scroll controller or client state exists.

Experience remains on the right side of the shared path and uses a continuous vertical evidence rhythm rather than cards or a résumé timeline. The first track receives stronger typographic and cyan emphasis because it represents the current software-and-quality direction; the embedded and field-service tracks explain the systems thinking and troubleshooting discipline that support it. The existing expanded pacing role gives the longer semantic chapter enough reading space without per-element thresholds. Laptop and tablet reduce metadata density, mobile stacks the same articles beside the vertical path, and reduced motion exposes every track immediately. No Experience-specific ScrollTrigger, state owner, or hidden content exists.

GSAP contexts, ScrollTriggers, and match-media registrations are reverted when the boundary unmounts or a media condition changes. Timelines animate transforms and opacity, do not update React state on scroll frames, and preserve native scrolling. Node controls, case-study interactions, route transitions, Three.js, React Three Fiber, WebGL, and final visual composition remain deferred. See the focused [helix concept](helix-concept.md) for the narrative and visual boundary.

## Testing

Playwright starts the built production server and verifies the identity, laptop, shared path, all five semantic chapters, chapter order, expected headings, and node-to-content associations. Selected Projects checks cover the featured identity, exactly three semantic articles, project order, statuses, evidence headings, verified HTTPS repository links, keyboard order, mobile stacking, reduced-motion visibility, and the absence of placeholder links. Experience checks cover exactly three ordered tracks, heading hierarchy, current-direction identity, grounded evidence, present-day relevance, the absence of fake résumé controls, mobile order, reduced-motion visibility, and ownership through the final track. The suite also checks console safety, forward and reverse journey ownership, direct fragments, static generation, and horizontal overflow at representative desktop, laptop, tablet, and mobile widths. Tests assert stable state outcomes rather than intermediate transform values or fragile screenshots.

## Architectural guardrails

- Keep content available without animation.
- Do not introduce a 3D library until a proven experience requires it.
- Prefer composition over a large generic component system.
- Add state management only when shared interactive state actually exists.
- Keep animation orchestration separate from semantic content.
