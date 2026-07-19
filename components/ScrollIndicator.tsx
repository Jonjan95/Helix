import styles from "@/styles/ScrollIndicator.module.css";

export function ScrollIndicator() {
  return (
    <a className={styles.indicator} href="#about" aria-label="Scroll to About">
      <span>Scroll to enter</span>
      <span className={styles.line} aria-hidden="true" />
    </a>
  );
}
