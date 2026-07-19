# Helix

Helix is Jonathan Jansson's story-led software developer portfolio, with a focus on quality assurance, testing, usability, accessibility, and reliable implementation. It begins in front of a stylized computer and will eventually guide visitors through a memorable digital journey of background, experience, skills, and projects.

The project follows a private internal design vision centred on curiosity, clarity, usability, performance, and accessibility. The private planning material is intentionally not part of the public repository.

## Technology

- Next.js 16 with the App Router
- React 19
- TypeScript
- CSS Modules
- ESLint
- GSAP and ScrollTrigger (installed for later milestones, not currently used)
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

The static foundation and initial laptop hero refinement are in place. The page includes Jonathan's software developer positioning, a responsive laptop hero, a restrained introduction, a scroll cue, semantic placeholder sections, an initial reduced-motion policy, and desktop/mobile end-to-end coverage.

Advanced scroll animation, the laptop zoom, the transition into the screen, and the helix journey are intentionally deferred. See [the roadmap](docs/roadmap.md) for the planned sequence.

## Project documentation

- [Design system](docs/design-system.md) — primary visual and interaction reference
- [Experience architecture](docs/experience-architecture.md) — primary narrative and journey reference
- [Design principles](docs/design-principles.md)
- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
