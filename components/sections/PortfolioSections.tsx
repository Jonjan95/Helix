import {
  JourneyChapter,
  type ChapterName,
} from "@/components/JourneyChapter";
import { HelixJourney } from "@/components/HelixJourney";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import {
  portfolioSections,
  type PortfolioSectionData,
} from "@/data/portfolio-sections";

type SectionId = PortfolioSectionData["id"];
type ContentChapterName = Exclude<
  ChapterName,
  "orientation" | "engineering"
>;

const chapterSections: Array<{
  chapter: ContentChapterName;
  index: number;
  sectionId: SectionId;
}> = [
  { chapter: "selected-work", index: 2, sectionId: "projects" },
  { chapter: "proof", index: 3, sectionId: "experience" },
  { chapter: "future", index: 4, sectionId: "contact" },
];

const sectionsById = new Map(
  portfolioSections.map((section) => [section.id, section]),
);

export function PortfolioSections() {
  return (
    <div>
      <HelixJourney />

      {chapterSections.map(({ chapter, index, sectionId }) => {
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
