import type { ChapterName } from "@/components/JourneyChapter";
import { contactRoutes, type ContactRoute } from "@/data/contact";
import {
  engineeringSteps,
  environmentPrinciples,
  type EngineeringStep,
  type EnvironmentPrinciple,
} from "@/data/early-journey";
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
  narrativeChapter: "orientation";
  principles: readonly EnvironmentPrinciple[];
};

export type EngineeringChapterData = HelixChapterBase & {
  chapter: "engineering";
  handoff: string;
  narrativeChapter: "engineering";
  steps: readonly EngineeringStep[];
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
    heading: "A workspace built around learning by doing.",
    headingId: "about-heading",
    index: "01",
    introduction:
      "I work in small steps, check the result, and learn by putting ideas into practice.",
    label: "ENVIRONMENT",
    narrativeChapter: "orientation",
    pacing: "entry",
    placement: "left",
    principles: environmentPrinciples,
  },
  {
    anchorId: "skills",
    chapter: "engineering",
    handoff: "The projects below show those steps at work.",
    heading: "Start by understanding the problem.",
    headingId: "skills-heading",
    index: "02",
    introduction:
      "Whether I am looking at an API, a database, a connected device, or equipment in the field, I use the same four steps.",
    label: "ENGINEERING MINDSET",
    narrativeChapter: "engineering",
    pacing: "featured",
    placement: "right",
    steps: engineeringSteps,
  },
  {
    anchorId: "projects",
    chapter: "projects",
    heading: "Projects built around real problems.",
    headingId: "projects-heading",
    index: "03",
    introduction:
      "These three projects show how I turn an idea into working software, test it, and stay honest about what is finished.",
    label: "SELECTED PROJECTS",
    narrativeChapter: "selected-work",
    pacing: "expanded",
    placement: "left",
    projects: portfolioProjects,
  },
  {
    anchorId: "experience",
    chapter: "experience",
    heading: "Experience across software, devices, and field work.",
    headingId: "experience-heading",
    index: "04",
    introduction:
      "My route into software has passed through code, connected devices, and hands-on troubleshooting. Each has taught me to understand the problem, narrow the cause, and check the result.",
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
      "I’m interested in LIA and junior opportunities in software development, testing, and QA, as well as thoughtful technical collaboration.",
    directionLabel: "OPEN TO",
    heading: "Let’s continue the conversation.",
    headingId: "contact-heading",
    index: "05",
    introduction:
      "If my work or background connects with what you are building, these are the best ways to continue.",
    label: "CONTINUE",
    narrativeChapter: "future",
    pacing: "exit",
    placement: "left",
    routes: contactRoutes,
  },
] as const satisfies readonly HelixChapterData[];
