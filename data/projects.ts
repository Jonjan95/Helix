export type ProjectStatus = "ACTIVE DEVELOPMENT" | "PROTOTYPE COMPLETE";

export type ProjectLink = {
  accessibleLabel: string;
  label: string;
  url: string;
};

export type PortfolioProject = {
  approach: string;
  boundary: string;
  featured: boolean;
  id: "ai-powered-test-engineer" | "cortexgrid" | "helix";
  name: string;
  problem: string;
  qualityHighlights: readonly string[];
  repository: ProjectLink;
  role: string;
  status: ProjectStatus;
  summary: string;
  technicalHighlights: readonly string[];
  technologies: readonly string[];
};

export const portfolioProjects = [
  {
    approach:
      "A Spring Boot API keeps projects, stories, generated cases, and scripts behind explicit controller, service, DTO, and repository boundaries. The Next.js interface makes each generated artifact reviewable, while an AI provider boundary supports both deterministic local output and an optional OpenAI integration.",
    boundary:
      "Core generation and review workflows are implemented. Generated Playwright scripts are stored for inspection; exporting, executing, and reporting on them remain planned work.",
    featured: true,
    id: "ai-powered-test-engineer",
    name: "AI-Powered Test Engineer",
    problem:
      "Requirements, test design, and browser automation often live in disconnected tools. That makes intent harder to trace and generated automation harder to review before it becomes part of a test suite.",
    qualityHighlights: [
      "JUnit, Mockito, and MockMvc cover backend units and HTTP boundaries.",
      "Testcontainers verifies PostgreSQL mappings and Flyway migrations against a real database.",
      "Playwright exercises the frontend workflow with controlled API responses, while CI runs backend tests, frontend checks, the production build, and browser tests.",
    ],
    repository: {
      accessibleLabel: "View AI-Powered Test Engineer on GitHub",
      label: "View source on GitHub",
      url: "https://github.com/Jonjan95/AI-Powered-Test-Engineer",
    },
    role: "FULL-STACK QUALITY ENGINEERING WORKSPACE",
    status: "ACTIVE DEVELOPMENT",
    summary:
      "A full-stack workspace that turns project and user-story context into structured test cases and reviewable Playwright TypeScript.",
    technicalHighlights: [
      "Java 21 and Spring Boot 3.5 REST API with validated request and response models.",
      "PostgreSQL 16 persistence managed through versioned Flyway migrations.",
      "Next.js 16 and TypeScript review interface with a provider-agnostic AI service boundary.",
    ],
    technologies: [
      "Java 21",
      "Spring Boot",
      "PostgreSQL",
      "Flyway",
      "Next.js",
      "TypeScript",
      "Playwright",
      "Testcontainers",
    ],
  },
  {
    approach:
      "A local-first modular monolith separates presentation, application workflows, domain rules, ports, and adapters. A deterministic state machine models ownership, dependencies, evidence, approvals, and immutable run events without pretending to operate an external coding agent.",
    boundary:
      "The prototype is complete as a deterministic simulation and planning workspace. It does not call an AI API, execute Codex, validate a repository, or deploy software.",
    featured: false,
    id: "cortexgrid",
    name: "CortexGrid",
    problem:
      "Collaboration with coding agents becomes difficult to trust when responsibility, evidence, approval points, and failure states are implicit rather than inspectable.",
    qualityHighlights: [
      "Vitest covers domain rules, persistence, and component behaviour.",
      "Playwright checks desktop and mobile workflows; CI also runs linting, type checks, Prisma validation, the production build, and browser tests.",
    ],
    repository: {
      accessibleLabel: "View CortexGrid on GitHub",
      label: "View source on GitHub",
      url: "https://github.com/Jonjan95/CortexGrid",
    },
    role: "HUMAN-AGENT RESPONSIBILITY PROTOTYPE",
    status: "PROTOTYPE COMPLETE",
    summary:
      "A visual workspace for turning a development goal into an execution contract, an editable agent prompt, and an inspectable responsibility workflow.",
    technicalHighlights: [
      "Next.js 16 and TypeScript application with Zod-validated contracts and workflow rules.",
      "Prisma and SQLite persistence for local projects, immutable events, and saved-run replay.",
      "React Flow visualisation backed by deterministic simulation rather than live agent execution.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "SQLite",
      "Zod",
      "React Flow",
      "Vitest",
      "Playwright",
    ],
  },
  {
    approach:
      "Semantic server-rendered chapters remain the content source of truth. One scoped motion owner progressively enhances that static document with a reversible laptop handoff and a calibrated SVG path, while responsive and reduced-motion modes preserve the same narrative in simpler compositions.",
    boundary:
      "The journey foundation and motion graybox are implemented. Final personal content, detailed case-study media, interactive nodes, visual polish, and any decision about 3D rendering remain deferred.",
    featured: false,
    id: "helix",
    name: "Helix",
    problem:
      "Conventional portfolio pages can separate projects from the thinking and quality practices behind them, while highly visual alternatives can make the actual evidence difficult to navigate.",
    qualityHighlights: [
      "Playwright verifies semantic chapter order, reversible journey states, direct links, reduced motion, and horizontal overflow across representative viewports.",
      "Static rendering, native scrolling, visible focus states, and semantic content remain intact without the motion layer.",
    ],
    repository: {
      accessibleLabel: "View Helix on GitHub",
      label: "View source on GitHub",
      url: "https://github.com/Jonjan95/Helix",
    },
    role: "NARRATIVE PORTFOLIO SYSTEM",
    status: "ACTIVE DEVELOPMENT",
    summary:
      "This portfolio treats visual storytelling, accessibility, motion, and engineering evidence as one progressively enhanced system.",
    technicalHighlights: [
      "Next.js App Router and TypeScript with semantic chapter data rendered outside decorative SVG.",
      "CSS Modules and a restrained token system keep the visual language local and maintainable.",
      "GSAP and ScrollTrigger are scoped to one JourneyMotion boundary with responsive profiles and cleanup.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "CSS Modules",
      "GSAP",
      "ScrollTrigger",
      "Playwright",
    ],
  },
] as const satisfies readonly PortfolioProject[];
