export type PortfolioSectionData = {
  id: "about" | "experience" | "skills" | "projects" | "contact";
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
};

export const portfolioSections: PortfolioSectionData[] = [
  {
    id: "about",
    eyebrow: "Perspective",
    title: "About",
    description:
      "I connect thoughtful interaction design with the systems that bring it to life.",
    detail:
      "A fuller introduction will live here, grounded in how I work, what I value, and the problems I enjoy solving.",
  },
  {
    id: "experience",
    eyebrow: "Practice",
    title: "Experience",
    description:
      "Work shaped by collaboration, close attention to users, and care for the final details.",
    detail:
      "Roles, responsibilities, and defining outcomes will become a concise, story-led timeline.",
  },
  {
    id: "skills",
    eyebrow: "Capabilities",
    title: "Skills",
    description:
      "UX thinking, accessible interfaces, visual systems, and dependable front-end development.",
    detail:
      "This area will balance technical fluency with the design and communication skills behind the work.",
  },
  {
    id: "projects",
    eyebrow: "Selected work",
    title: "Projects",
    description:
      "Case studies that make the decisions, constraints, iterations, and impact visible.",
    detail:
      "Project showcases will be added as focused narratives rather than a wall of disconnected thumbnails.",
  },
  {
    id: "contact",
    eyebrow: "Next step",
    title: "Contact",
    description:
      "Interested in building something clear, useful, and memorable together?",
    detail:
      "Contact details and social links will be added with the final portfolio content.",
  },
];
