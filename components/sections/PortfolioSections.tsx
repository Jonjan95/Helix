import {
  JourneyChapter,
  type ChapterName,
} from "@/components/JourneyChapter";
import { DigitalWorkspace } from "@/components/DigitalWorkspace";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import {
  portfolioSections,
  type PortfolioSectionData,
} from "@/data/portfolio-sections";

type SectionId = PortfolioSectionData["id"];

const chapterSections: Array<{ chapter: ChapterName; sectionId: SectionId }> = [
  { chapter: "orientation", sectionId: "about" },
  { chapter: "engineering", sectionId: "skills" },
  { chapter: "selected-work", sectionId: "projects" },
  { chapter: "proof", sectionId: "experience" },
  { chapter: "future", sectionId: "contact" },
];

const sectionsById = new Map(
  portfolioSections.map((section) => [section.id, section]),
);

export function PortfolioSections() {
  return (
    <div>
      {chapterSections.map(({ chapter, sectionId }, index) => {
        if (chapter === "orientation") {
          return (
            <JourneyChapter
              key={chapter}
              name={chapter}
              labelledBy="about-heading"
            >
              <DigitalWorkspace />
            </JourneyChapter>
          );
        }

        const section = sectionsById.get(sectionId);

        if (!section) {
          return null;
        }

        return (
          <JourneyChapter
            key={chapter}
            name={chapter}
            labelledBy={`${section.id}-heading`}
          >
            <PortfolioSection section={section} index={index} />
          </JourneyChapter>
        );
      })}
    </div>
  );
}
