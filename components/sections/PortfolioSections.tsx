import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { portfolioSections } from "@/data/portfolio-sections";

export function PortfolioSections() {
  return (
    <div>
      {portfolioSections.map((section, index) => (
        <PortfolioSection key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
