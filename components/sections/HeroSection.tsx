import { Laptop } from "@/components/Laptop";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import styles from "@/styles/HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-introduction">
      <div className={styles.frame} aria-hidden="true">
        <span>01 / ENTRY</span>
        <span>UX · DESIGN · CODE</span>
      </div>

      <div className={styles.visual}>
        <Laptop />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>Welcome to Helix</p>
        <h2 id="hero-introduction" className={styles.introduction}>
          I create accessible digital experiences where design, story, and
          technology work as one.
        </h2>
        <p className={styles.supportingText}>
          This portfolio begins at the screen. The journey inside it is still
          taking shape.
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
