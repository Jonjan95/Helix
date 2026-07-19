import { HeroSection } from "@/components/sections/HeroSection";
import { PortfolioSections } from "@/components/sections/PortfolioSections";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to portfolio content
      </a>
      <main id="main-content">
        <HeroSection />
        <PortfolioSections />
      </main>
    </>
  );
}
