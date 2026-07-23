# Helix

** **WORK IN PROGRESS** **

Helix is Jonathan Jansson's story-led software developer portfolio, with a focus on quality assurance, testing, usability, accessibility, and reliable implementation. It begins in front of a stylized computer and will eventually guide visitors through a memorable digital journey of background, experience, skills, and projects.

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

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation and tests

Install the Playwright browser once:

```bash
npx playwright install chromium
```

Run checks individually:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Or run the full validation sequence:

```bash
npm run validate
```

## Current status

The complete Helix journey now exists as a calibrated integrated foundation. On larger viewports, a short reversible scroll sequence moves toward the laptop display and into one shared workspace. Native scrolling then follows a continuous SVG path through Environment, Engineering Mindset, Selected Projects, Experience, and Continue stops. Each stop keeps its semantic chapter content outside the decorative path and uses the same maintainable attachment pattern. Approach, active, departure, and passed states create a clear focus hierarchy without hiding content, and direct chapter links resolve after the pinned layout is established.

Selected Projects, Experience, and Continue are the first three content-complete chapters. Selected Projects presents AI-Powered Test Engineer as the featured project, with CortexGrid and Helix as supporting evidence. Experience connects current software and quality studies, previous embedded-systems studies, and practical field troubleshooting through three typed evidence tracks. Continue closes the current narrative with verified GitHub, LinkedIn, and professional email routes, a restrained statement of Jonathan's current direction, and a visible path beyond the final contact option.

Project claims and links were checked against current public repositories. Experience claims remain scoped to verified study, project, and field-service boundaries: it does not imply professional software employment, completed ongoing education, named client work, or invented outcomes. Contact publishing is similarly narrow: the chapter exposes only intentionally public professional routes and adds no form, tracking service, phone number, address, or private social account. Tablet and mobile simplify the completed chapter compositions in normal document flow, while reduced-motion visitors receive the entire static sequence without camera movement, chapter motion, or pinning. Project detail routes, a downloadable CV, exhaustive employment history, final copy polish, interactive nodes, final visual polish, and any 3D implementation remain intentionally deferred. See [the helix concept](docs/helix-concept.md) for the current boundary and [the roadmap](docs/roadmap.md) for the planned sequence.

The first portfolio-wide journey audit is complete. It verified the forward and reverse sequence, all current routes, six representative viewport sizes, reduced motion, semantic hierarchy, console safety, and static generation. The focused refinements correct the skip-link destination and the mobile entry cue’s touch target; the established chapter pacing and centralized motion architecture did not require changes. See [the full journey audit](docs/full-journey-audit.md) for prioritized findings and deferred content work.

## Project documentation

- [Design system](docs/design-system.md) — primary visual and interaction reference
- [Experience architecture](docs/experience-architecture.md) — primary narrative and journey reference
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Helix concept](docs/helix-concept.md)
- [Full journey audit](docs/full-journey-audit.md)
- [Roadmap](docs/roadmap.md)
