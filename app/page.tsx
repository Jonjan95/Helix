import { HeroSection } from "@/components/sections/HeroSection";
import { PortfolioSections } from "@/components/sections/PortfolioSections";
import { JourneyMotion } from "@/components/motion/JourneyMotion";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to portfolio journey
      </a>
      <main id="main-content">
        <JourneyMotion>
          <HeroSection />
          <PortfolioSections />
        </JourneyMotion>
      </main>
    </>
  );
}
