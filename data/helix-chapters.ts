import type { ChapterName } from "@/components/JourneyChapter";
import { contactRoutes, type ContactRoute } from "@/data/contact";
import { experienceTracks, type ExperienceTrack } from "@/data/experience";
import { portfolioProjects, type PortfolioProject } from "@/data/projects";

export const helixChapterIds = [
  "environment",
  "engineering",
  "projects",
  "experience",
  "contact",
] as const;

export type HelixChapterId = (typeof helixChapterIds)[number];
export type HelixChapterPlacement = "left" | "right";
export type HelixChapterPacing =
  | "entry"
  | "featured"
  | "expanded"
  | "standard"
  | "exit";

type HelixChapterBase = {
  anchorId: string;
  chapter: HelixChapterId;
  heading: string;
  headingId: string;
  index: string;
  introduction: string;
  label: string;
  narrativeChapter: Exclude<ChapterName, "arrival">;
  pacing: HelixChapterPacing;
  placement: HelixChapterPlacement;
};

export type EnvironmentChapterData = HelixChapterBase & {
  chapter: "environment";
  detail: string;
  narrativeChapter: "orientation";
};

export type EngineeringChapterData = HelixChapterBase & {
  chapter: "engineering";
  narrativeChapter: "engineering";
  principles: readonly string[];
};

export type ProjectsChapterData = HelixChapterBase & {
  chapter: "projects";
  narrativeChapter: "selected-work";
  projects: readonly PortfolioProject[];
};

export type ExperienceChapterData = HelixChapterBase & {
  chapter: "experience";
  narrativeChapter: "proof";
  tracks: readonly ExperienceTrack[];
};

export type ContactChapterData = HelixChapterBase & {
  chapter: "contact";
  closing: string;
  direction: string;
  directionLabel: string;
  narrativeChapter: "future";
  routes: readonly ContactRoute[];
};

export type HelixChapterData =
  | EnvironmentChapterData
  | EngineeringChapterData
  | ProjectsChapterData
  | ExperienceChapterData
  | ContactChapterData;

export const helixChapters = [
  {
    anchorId: "about",
    chapter: "environment",
    detail:
      "The workspace establishes one shared field for the path, its chapter stops, and the evidence that follows.",
    heading: "Inside the system",
    headingId: "about-heading",
    index: "01",
    introduction:
      "A guided look at how I approach software, quality, and thoughtful implementation.",
    label: "ENVIRONMENT",
    narrativeChapter: "orientation",
    pacing: "entry",
    placement: "left",
  },
  {
    anchorId: "skills",
    chapter: "engineering",
    heading: "Quality is part of the build, not a final check.",
    headingId: "skills-heading",
    index: "02",
    introduction:
      "I approach software through clear requirements, testable behaviour, reliable implementation, and continuous learning.",
    label: "ENGINEERING MINDSET",
    narrativeChapter: "engineering",
    pacing: "featured",
    placement: "right",
    principles: [
      "Understand the problem before choosing the solution.",
      "Make behaviour testable.",
      "Prefer clear systems over clever complexity.",
      "Use feedback to improve the implementation.",
    ],
  },
  {
    anchorId: "projects",
    chapter: "projects",
    heading: "Building systems by solving real problems.",
    headingId: "projects-heading",
    index: "03",
    introduction:
      "Three working systems show how product intent, technical decisions, and quality evidence connect in practice.",
    label: "SELECTED PROJECTS",
    narrativeChapter: "selected-work",
    pacing: "expanded",
    placement: "left",
    projects: portfolioProjects,
  },
  {
    anchorId: "experience",
    chapter: "experience",
    heading: "Technical work across software, systems, and service.",
    headingId: "experience-heading",
    index: "04",
    introduction:
      "My path into software has moved through code, connected devices, and hands-on troubleshooting. Each environment has strengthened the same habit: understand the system, isolate the problem, and verify the result.",
    label: "EXPERIENCE",
    narrativeChapter: "proof",
    pacing: "expanded",
    placement: "right",
    tracks: experienceTracks,
  },
  {
    anchorId: "contact",
    chapter: "contact",
    closing: "The path remains open.",
    direction:
      "Open to conversations about LIA, junior software and QA opportunities, test automation, and practical technical collaboration.",
    directionLabel: "CURRENT DIRECTION",
    heading: "Let’s build something reliable.",
    headingId: "contact-heading",
    index: "05",
    introduction:
      "I’m currently developing toward roles in software development, testing, and quality engineering. If my work or background feels relevant, the next step can be a conversation.",
    label: "CONTINUE",
    narrativeChapter: "future",
    pacing: "exit",
    placement: "left",
    routes: contactRoutes,
  },
] as const satisfies readonly HelixChapterData[];
