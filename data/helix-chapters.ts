export type HelixChapterData = {
  anchorId: string;
  chapter: "engineering";
  heading: string;
  headingId: string;
  index: string;
  introduction: string;
  label: string;
  principles: readonly string[];
};

export const engineeringChapter = {
  anchorId: "skills",
  chapter: "engineering",
  heading: "Quality is part of the build, not a final check.",
  headingId: "skills-heading",
  index: "02",
  introduction:
    "I approach software through clear requirements, testable behaviour, reliable implementation, and continuous learning.",
  label: "Engineering mindset",
  principles: [
    "Understand the problem before choosing the solution.",
    "Make behaviour testable.",
    "Prefer clear systems over clever complexity.",
    "Use feedback to improve the implementation.",
  ],
} satisfies HelixChapterData;
