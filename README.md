# Helix

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

The complete Helix journey now exists as an integrated graybox. On larger viewports, a short reversible scroll sequence moves toward the laptop display and into one shared workspace. Native scrolling then follows a continuous SVG path through Environment, Engineering Mindset, Selected Projects, Experience, and Continue stops. Each stop keeps its semantic chapter content outside the decorative path and uses the same maintainable attachment pattern.

Tablet reduces the path-to-content separation, mobile keeps the journey in a clear native-flow composition, and reduced-motion visitors receive the entire static chapter sequence without camera movement, chapter motion, or pinning. Project case studies, final personal content, interactive nodes, final visual polish, and any 3D implementation remain intentionally deferred. See [the helix concept](docs/helix-concept.md) for the current boundary and [the roadmap](docs/roadmap.md) for the planned sequence.

## Project documentation

- [Design system](docs/design-system.md) — primary visual and interaction reference
- [Experience architecture](docs/experience-architecture.md) — primary narrative and journey reference
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Helix concept](docs/helix-concept.md)
- [Roadmap](docs/roadmap.md)
