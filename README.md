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

Selected Projects is the first content-complete chapter. It presents AI-Powered Test Engineer as the featured project, with CortexGrid and Helix as supporting evidence. Problem, approach, technical decisions, quality practices, current status, and scope boundaries are stored as typed local data and rendered as semantic articles. Claims and links were checked against the current public repositories; the page performs no live GitHub requests and does not turn planned functionality into completed work.

Tablet reduces multi-column project density, mobile stacks all projects in document order, and reduced-motion visitors receive the entire static chapter sequence without camera movement, chapter motion, or pinning. Project detail routes, galleries, final personal content, interactive nodes, final visual polish, and any 3D implementation remain intentionally deferred. See [the helix concept](docs/helix-concept.md) for the current boundary and [the roadmap](docs/roadmap.md) for the planned sequence.

## Project documentation

- [Design system](docs/design-system.md) — primary visual and interaction reference
- [Experience architecture](docs/experience-architecture.md) — primary narrative and journey reference
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Helix concept](docs/helix-concept.md)
- [Roadmap](docs/roadmap.md)
