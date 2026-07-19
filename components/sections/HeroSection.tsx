import { Laptop } from "@/components/Laptop";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import styles from "@/styles/HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-introduction">
      <div className={styles.frame} aria-hidden="true">
        <span>01 / ENTRY</span>
        <span>SOFTWARE · QUALITY · EXPERIENCE</span>
      </div>

      <div className={styles.visual}>
        <Laptop />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>Software developer portfolio</p>
        <h2 id="hero-introduction" className={styles.introduction}>
          I build thoughtful software experiences with a focus on quality,
          usability, and reliable implementation.
        </h2>
        <p className={styles.supportingText}>
          Testing, technical problem solving, and user experience—brought
          together with care.
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
