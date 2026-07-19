import styles from "@/styles/DigitalWorkspace.module.css";

export function DigitalWorkspace() {
  return (
    <div
      className={styles.workspace}
      id="about"
      data-motion="digital-workspace"
      data-testid="digital-workspace"
    >
      <div className={styles.frame}>
        <div className={styles.systemLine} aria-hidden="true">
          <span>HELIX / ENVIRONMENT 01</span>
          <span>ORIENTATION LAYER</span>
        </div>

        <div className={styles.content}>
          <p className={styles.label}>
            <span aria-hidden="true" />
            Orientation
          </p>
          <h2 id="about-heading">Inside the system</h2>
          <p className={styles.introduction}>
            A guided look at how I approach software, quality, and thoughtful
            implementation.
          </p>
        </div>

        <div className={styles.path} aria-hidden="true">
          <span />
        </div>

        <p className={styles.coordinates} aria-hidden="true">
          ENTRY 01 / CONTINUE INWARD
        </p>
      </div>
    </div>
  );
}
