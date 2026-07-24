import { Laptop } from "@/components/Laptop";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { arrivalIdentity } from "@/data/early-journey";
import styles from "@/styles/HeroSection.module.css";

export function HeroSection() {
  return (
    <section
      className={styles.hero}
      data-chapter="arrival"
      aria-labelledby="hero-introduction"
    >
      <div
        className={styles.frame}
        data-motion="arrival-frame"
        aria-hidden="true"
      >
        <span>01 / ENTRY</span>
        <span>{arrivalIdentity.focus}</span>
      </div>

      <div className={styles.visual}>
        <Laptop />
      </div>

      <div
        className={styles.copy}
        data-arrival-identity
        data-motion="arrival-copy"
      >
        <p className={styles.eyebrow}>
          {arrivalIdentity.location} · {arrivalIdentity.focus}
        </p>
        <h2 id="hero-introduction" className={styles.introduction}>
          {arrivalIdentity.title}
        </h2>
        <p className={styles.supportingText}>
          {arrivalIdentity.summary}
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
