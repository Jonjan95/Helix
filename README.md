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

The static foundation, laptop hero refinement, semantic journey chapters, and first Arrival-to-Orientation motion prototype are in place. On larger viewports, a short reversible scroll sequence moves toward the laptop display before handing off to Orientation. Mobile uses a lighter native-flow treatment, while reduced-motion visitors receive the complete static chapter sequence without camera movement or pinning.

The internal digital world, later chapter transitions, project interactions, and helix journey remain intentionally deferred. See [the roadmap](docs/roadmap.md) for the planned sequence.

## Project documentation

- [Design system](docs/design-system.md) — primary visual and interaction reference
- [Experience architecture](docs/experience-architecture.md) — primary narrative and journey reference
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
