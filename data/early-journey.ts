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
  focus: "Software development · Test & quality",
  location: "Malmö, Sweden",
  name: "Jonathan Jansson",
  summary:
    "I build projects across software, APIs, databases, automation, and connected systems—learning how they behave, where they fail, and how to verify the result.",
  title: "Software development student focused on testing and quality.",
} as const satisfies ArrivalIdentity;

export const environmentPrinciples = [
  {
    id: "structured-iteration",
    index: "01",
    practice:
      "Scoped issues, focused pull requests, validation commands, and documented boundaries.",
    summary:
      "Small, reviewable changes make progress easier to understand and correct.",
    title: "Structured iteration",
  },
  {
    id: "visible-evidence",
    index: "02",
    practice:
      "Observable behaviour, reproducible faults, automated checks, and manual review.",
    summary:
      "Tests, builds, and direct inspection turn assumptions into evidence I can check.",
    title: "Visible evidence",
  },
  {
    id: "practical-experimentation",
    index: "03",
    practice:
      "Working systems, documented decisions, and AI-assisted exploration with the result reviewed and validated.",
    summary:
      "I learn best by building, trying ideas against real behaviour, and refining what the system shows me.",
    title: "Practical experimentation",
  },
] as const satisfies readonly EnvironmentPrinciple[];

export const engineeringSteps = [
  {
    id: "understand",
    index: "01",
    summary:
      "Map the boundaries, expected behaviour, and context before changing the system.",
    title: "Understand",
  },
  {
    id: "isolate",
    index: "02",
    summary:
      "Separate the visible symptom from possible causes and narrow the problem deliberately.",
    title: "Isolate",
  },
  {
    id: "observe",
    index: "03",
    summary:
      "Use tests, logs, instrumentation, and direct inspection to make behaviour visible.",
    title: "Observe",
  },
  {
    id: "verify",
    index: "04",
    summary:
      "Check the intended result, unexpected paths, and whether the outcome is reproducible.",
    title: "Verify",
  },
] as const satisfies readonly EngineeringStep[];
