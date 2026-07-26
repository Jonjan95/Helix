# Helix

** **WORK IN PROGRESS** **

Helix is Jonathan Jansson's story-led software developer portfolio, with a focus on testing, quality, usability, accessibility, and reliable implementation. It begins in front of a stylized computer and guides visitors through one continuous journey of working habits, engineering mindset, projects, experience, and current direction.

The project follows a private internal design vision centred on curiosity, clarity, usability, performance, and accessibility. The private planning material is intentionally not part of the public repository.

## Technology

- Next.js 16 with the App Router
- React 19
- TypeScript
- CSS Modules
- ESLint
- GSAP and ScrollTrigger for scoped, progressively enhanced motion
- Playwright for end-to-end testing

## Getting started

Requirements: Node.js 24 and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation and tests

Install the Playwright browsers once:

```bash
npx playwright install chromium firefox webkit
```

Run checks individually:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:release
```

Or run the full validation sequence:

```bash
npm run validate
```

## Current status

The complete Helix journey now exists as a calibrated integrated foundation. On larger viewports, a short reversible scroll sequence moves toward the laptop display and into one shared workspace. Native scrolling then follows a continuous SVG path through Environment, Engineering Mindset, Selected Projects, Experience, and Continue stops. Each stop keeps its semantic chapter content outside the decorative path and uses the same maintainable attachment pattern. Approach, active, departure, and passed states create a clear focus hierarchy without hiding content, and direct chapter links resolve after the pinned layout is established.

All six narrative chapters are now content-complete. Arrival identifies Jonathan Jansson as a software development student in Malmö focused on testing and quality. Environment presents structured iteration, visible evidence, and practical experimentation as the conditions that support his learning. Engineering Mindset turns those habits into a four-step reasoning sequence—Understand, Isolate, Observe, Verify—and hands the visitor into the project evidence. Selected Projects presents AI-Powered Test Engineer as the featured project, with CortexGrid and Helix as supporting evidence. Experience connects current software and quality studies, previous embedded-systems studies, and practical field troubleshooting through three typed evidence tracks. Continue closes the current narrative with verified GitHub, LinkedIn, and professional email routes.

Identity, study direction, working habits, project claims, and public links were checked against repository documentation, merged implementation evidence, and current public sources. A portfolio-wide voice and concision pass now gives all six chapters one direct, personal tone while preserving the distinction between studies, projects, and employment. The copy does not imply professional software or QA employment, completed ongoing education, seniority, named client work, or invented outcomes. Tablet and mobile simplify the completed chapter compositions in normal document flow, while reduced-motion visitors receive the entire static sequence without camera movement, chapter motion, or pinning. Project detail routes, a downloadable CV, exhaustive employment history, interactive nodes, final visual polish, and any 3D implementation remain intentionally deferred. See [the content voice audit](docs/content-voice-audit.md) for the wording decisions and measurements, [the helix concept](docs/helix-concept.md) for the current boundary, and [the roadmap](docs/roadmap.md) for the planned sequence.

An isolated [spatial design exploration](docs/spatial-design-exploration.md) now compares the production baseline with CSS/GSAP perspective, layered SVG depth, and a direct Three.js proof of concept. The unlinked `/lab/spatial` route is a review lab, not production navigation. Its evidence recommends a restrained CSS/SVG hybrid and keeps WebGL out of the production journey.

The first portfolio-wide journey audit is complete. It verified the forward and reverse sequence, all current routes, six representative viewport sizes, reduced motion, semantic hierarchy, console safety, and static generation. The focused refinements correct the skip-link destination and the mobile entry cue’s touch target; the established chapter pacing and centralized motion architecture did not require changes. See [the full journey audit](docs/full-journey-audit.md) for prioritized findings and deferred content work.

The focused visual-polish pass is complete. It clarifies typography and content measure, stacks supporting projects before they become narrow text strips, restrains cyan to meaningful current and featured states, unifies separators, gives repository links 44px targets at every approved size, quiets the path behind content, and refines the laptop and final ending. No motion value, SVG geometry, dependency, or visitor-facing claim changed. See [the visual polish audit](docs/visual-polish-audit.md) and its before-and-after evidence.

Helix is now a locally validated release candidate. Production metadata, browser icons, a 1200 × 630 social preview, environment-aware canonical handling, robots, sitemap, security headers, CI, and a focused Chromium/Firefox/WebKit release matrix are complete. The public origin is intentionally not hardcoded: a deployment must set `NEXT_PUBLIC_SITE_URL` before building. Analytics remains excluded. A hosting destination, public-URL smoke test, physical device review, and hands-on screen-reader pass remain before the site can be described as production-proven. See the [production-readiness audit](docs/production-readiness-audit.md) and [deployment guide](docs/deployment.md).

## Project documentation

- [Design system](docs/design-system.md) — primary visual and interaction reference
- [Experience architecture](docs/experience-architecture.md) — primary narrative and journey reference
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Spatial design exploration](docs/spatial-design-exploration.md)
- [Helix concept](docs/helix-concept.md)
- [Full journey audit](docs/full-journey-audit.md)
- [Content voice audit](docs/content-voice-audit.md)
- [Visual polish audit](docs/visual-polish-audit.md)
- [Production-readiness audit](docs/production-readiness-audit.md)
- [Deployment](docs/deployment.md)
- [Roadmap](docs/roadmap.md)
