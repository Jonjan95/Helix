export type ArrivalIdentity = {
  focus: string;
  location: string;
  name: string;
  summary: string;
  title: string;
};

export type EnvironmentPrinciple = {
  id: string;
  index: string;
  practice: string;
  summary: string;
  title: string;
};

export type EngineeringStep = {
  id: string;
  index: string;
  summary: string;
  title: string;
};

export const arrivalIdentity = {
  focus: "Software development · Testing & quality",
  location: "Malmö, Sweden",
  name: "Jonathan Jansson",
  summary:
    "I build software projects and explore how APIs, databases, automation, and connected devices work together—and what happens when they do not.",
  title: "Software development student with a focus on testing and quality.",
} as const satisfies ArrivalIdentity;

export const environmentPrinciples = [
  {
    id: "structured-iteration",
    index: "01",
    practice:
      "Issues define the scope; pull requests, tests, and builds check the result.",
    summary:
      "I break work into small changes that are easier to review and correct.",
    title: "Small, reviewable steps",
  },
  {
    id: "visible-evidence",
    index: "02",
    practice:
      "Tests, builds, reproduced faults, and manual review show what changed.",
    summary:
      "I check results instead of relying on assumptions.",
    title: "Check what changed",
  },
  {
    id: "practical-experimentation",
    index: "03",
    practice:
      "I test ideas in real projects, document decisions, and review AI-assisted work before using it.",
    summary:
      "I learn most by building working software.",
    title: "Learn by building",
  },
] as const satisfies readonly EnvironmentPrinciple[];

export const engineeringSteps = [
  {
    id: "understand",
    index: "01",
    summary:
      "Clarify what should happen, what is in scope, and what changed.",
    title: "Understand",
  },
  {
    id: "isolate",
    index: "02",
    summary:
      "Separate the symptom from its possible causes and narrow the search.",
    title: "Isolate",
  },
  {
    id: "observe",
    index: "03",
    summary:
      "Use tests, logs, and direct inspection to see what the system is doing.",
    title: "Observe",
  },
  {
    id: "verify",
    index: "04",
    summary:
      "Check the fix, nearby failure paths, and whether the result holds up when repeated.",
    title: "Verify",
  },
] as const satisfies readonly EngineeringStep[];
