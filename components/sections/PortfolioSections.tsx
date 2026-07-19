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
type ContentChapterName = Exclude<ChapterName, "orientation">;

const chapterSections: Array<{
  chapter: ContentChapterName;
  sectionId: SectionId;
}> = [
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
      <JourneyChapter name="orientation" labelledBy="about-heading">
        <DigitalWorkspace />
      </JourneyChapter>

      {chapterSections.map(({ chapter, sectionId }, index) => {
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
            <PortfolioSection section={section} index={index + 1} />
          </JourneyChapter>
        );
      })}
    </div>
  );
}
