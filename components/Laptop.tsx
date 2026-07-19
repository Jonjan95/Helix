import styles from "@/styles/Laptop.module.css";

export function Laptop() {
  return (
    <div className={styles.laptop} data-testid="laptop-hero">
      <div className={styles.display}>
        <div className={styles.camera} aria-hidden="true" />
        <div className={styles.screen}>
          <span className={styles.systemLabel}>JONATHAN JANSSON / PORTFOLIO</span>
          <h1 className={styles.name}>Jonathan</h1>
          <span className={styles.cursor} aria-hidden="true" />
          <span className={styles.status}>Quality · Testing · Usability</span>
        </div>
      </div>
      <div className={styles.base} aria-hidden="true">
        <div className={styles.notch} />
      </div>
    </div>
  );
}
