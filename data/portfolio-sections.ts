export type PortfolioSectionData = {
  id: "experience" | "skills" | "projects" | "contact";
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
};

export const portfolioSections: PortfolioSectionData[] = [
  {
    id: "experience",
    eyebrow: "Practice",
    title: "Experience",
    description:
      "A practical view of the teams, responsibilities, and technical problems that have shaped how I work.",
    detail:
      "Roles and outcomes will become a concise timeline once the final work-history content is ready.",
  },
  {
    id: "skills",
    eyebrow: "Capabilities",
    title: "Skills",
    description:
      "Software development, quality assurance, test automation, usability, and reliable implementation.",
    detail:
      "This section will connect technical tools with the testing, communication, and design thinking behind dependable software.",
  },
  {
    id: "projects",
    eyebrow: "Selected work",
    title: "Projects",
    description:
      "Selected work explored through the problem, implementation, testing, and result.",
    detail:
      "Project showcases will be added as focused technical narratives rather than a wall of disconnected thumbnails.",
  },
  {
    id: "contact",
    eyebrow: "Next step",
    title: "Contact",
    description:
      "Open to conversations about software development, quality, and useful digital products.",
    detail:
      "Contact details and social links will be added with the final portfolio content.",
  },
];
