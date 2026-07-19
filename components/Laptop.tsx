import styles from "@/styles/Laptop.module.css";

export function Laptop() {
  return (
    <div className={styles.laptop}>
      <div className={styles.display}>
        <div className={styles.camera} aria-hidden="true" />
        <div className={styles.screen}>
          <span className={styles.systemLabel}>HELIX / PORTFOLIO</span>
          <h1 className={styles.name}>Helix</h1>
          <span className={styles.cursor} aria-hidden="true" />
          <span className={styles.status}>Available for thoughtful work</span>
        </div>
      </div>
      <div className={styles.base} aria-hidden="true">
        <div className={styles.notch} />
      </div>
    </div>
  );
}
