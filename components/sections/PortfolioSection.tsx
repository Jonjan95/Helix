import type { PortfolioSectionData } from "@/data/portfolio-sections";
import { formatSectionNumber } from "@/utils/format-section-number";
import styles from "@/styles/PortfolioSection.module.css";

type PortfolioSectionProps = {
  section: PortfolioSectionData;
  index: number;
};

export function PortfolioSection({ section, index }: PortfolioSectionProps) {
  const headingId = `${section.id}-heading`;

  return (
    <section
      className={styles.section}
      id={section.id}
      aria-labelledby={headingId}
    >
      <div className={styles.index} aria-hidden="true">
        {formatSectionNumber(index)}
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>{section.eyebrow}</p>
        <h2 id={headingId}>{section.title}</h2>
        <p className={styles.description}>{section.description}</p>
        <p className={styles.detail}>{section.detail}</p>
      </div>
      <span className={styles.marker} aria-hidden="true" />
    </section>
  );
}
