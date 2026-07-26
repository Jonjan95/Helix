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
      "A Spring Boot API stores projects, user stories, test cases, and scripts. A Next.js interface keeps generated output reviewable, and a provider boundary supports deterministic local output or an optional OpenAI integration.",
    boundary:
      "Test-case and script generation are working. Playwright scripts can be reviewed and stored, but exporting, running, and reporting on them are still planned.",
    featured: true,
    id: "ai-powered-test-engineer",
    name: "AI-Powered Test Engineer",
    problem:
      "Requirements, test cases, and browser scripts often sit in separate tools, making it difficult to trace automation back to its original intent.",
    qualityHighlights: [
      "JUnit, Mockito, and MockMvc cover business logic and HTTP endpoints.",
      "Testcontainers checks PostgreSQL mappings and Flyway migrations against a real database.",
      "Playwright covers the main interface flow; CI also runs backend tests, frontend checks, builds, and browser tests.",
    ],
    repository: {
      accessibleLabel: "View AI-Powered Test Engineer on GitHub",
      label: "View source on GitHub",
      url: "https://github.com/Jonjan95/AI-Powered-Test-Engineer",
    },
    role: "FULL-STACK TEST DESIGN PROJECT",
    status: "ACTIVE DEVELOPMENT",
    summary:
      "A full-stack tool that turns project context and user stories into structured test cases and Playwright TypeScript for review.",
    technicalHighlights: [
      "Java 21 and Spring Boot REST API with validated DTOs and clear controller, service, and repository layers.",
      "PostgreSQL 16 with versioned Flyway migrations.",
      "Next.js 16 and TypeScript interface with a provider-neutral AI integration.",
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
      "A modular Next.js application models tasks, dependencies, approvals, and immutable run events. Its state machine is deterministic: it demonstrates the workflow without pretending to run an external coding agent.",
    boundary:
      "The deterministic prototype is complete. It does not call an AI API, run Codex, inspect a repository, or deploy software.",
    featured: false,
    id: "cortexgrid",
    name: "CortexGrid",
    problem:
      "Work with coding agents is harder to trust when ownership, approval points, and failures are hidden.",
    qualityHighlights: [
      "Vitest covers domain rules, persistence, and component behaviour.",
      "Playwright covers desktop and mobile workflows; CI adds linting, type checks, Prisma validation, builds, and browser tests.",
    ],
    repository: {
      accessibleLabel: "View CortexGrid on GitHub",
      label: "View source on GitHub",
      url: "https://github.com/Jonjan95/CortexGrid",
    },
    role: "RESPONSIBILITY WORKFLOW PROTOTYPE",
    status: "PROTOTYPE COMPLETE",
    summary:
      "A local workspace for defining a development goal, refining an agent prompt, and seeing who is responsible for each step.",
    technicalHighlights: [
      "Next.js 16 and TypeScript with Zod-validated contracts and workflow rules.",
      "Prisma and SQLite store local projects, immutable events, and saved runs.",
      "React Flow presents the workflow, backed by deterministic simulation rather than live agent execution.",
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
      "The page starts as semantic server-rendered content. One motion layer adds the laptop handoff and scroll-driven Helix, while responsive and reduced-motion layouts keep the same story clear.",
    boundary:
      "The complete journey and core content are implemented. Project case-study media, interactive nodes, final visual polish, and any 3D direction remain later work.",
    featured: false,
    id: "helix",
    name: "Helix",
    problem:
      "Traditional portfolios can separate finished work from the thinking behind it. Highly visual sites can also hide the information visitors came to find.",
    qualityHighlights: [
      "Playwright checks chapter order, reversible journey states, direct links, reduced motion, and horizontal overflow across representative viewports.",
      "Static rendering, native scrolling, visible focus, and semantic content remain intact without motion.",
    ],
    repository: {
      accessibleLabel: "View Helix on GitHub",
      label: "View source on GitHub",
      url: "https://github.com/Jonjan95/Helix",
    },
    role: "SCROLL-DRIVEN PORTFOLIO",
    status: "ACTIVE DEVELOPMENT",
    summary:
      "This portfolio uses one continuous journey to connect my projects, experience, and approach to testing.",
    technicalHighlights: [
      "Next.js App Router and TypeScript render semantic chapter data outside the decorative SVG.",
      "CSS Modules and shared design tokens keep the visual language consistent.",
      "GSAP and ScrollTrigger stay inside one responsive JourneyMotion owner with scoped cleanup.",
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
