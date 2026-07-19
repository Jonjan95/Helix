import styles from "@/styles/Laptop.module.css";

export function Laptop() {
  return (
    <div
      className={styles.laptop}
      data-motion="laptop"
      data-testid="laptop-hero"
    >
      <div className={styles.display}>
        <div
          className={styles.shell}
          data-motion="laptop-shell"
          aria-hidden="true"
        />
        <div
          className={styles.camera}
          data-motion="laptop-camera"
          aria-hidden="true"
        />
        <div className={styles.screen} data-motion="laptop-screen">
          <div className={styles.screenIdentity} data-motion="screen-identity">
            <span className={styles.systemLabel}>
              JONATHAN JANSSON / PORTFOLIO
            </span>
            <h1 className={styles.name}>Jonathan</h1>
            <span className={styles.cursor} aria-hidden="true" />
            <span className={styles.status}>Quality · Testing · Usability</span>
          </div>

          <div
            className={styles.workspaceThreshold}
            data-motion="workspace-threshold"
            aria-hidden="true"
          >
            <span className={styles.thresholdLabel}>
              ORIENTATION / WORKSPACE
            </span>
            <span className={styles.thresholdPath} />
            <span className={styles.thresholdStatus}>ENTRY LAYER READY</span>
          </div>
        </div>
      </div>
      <div className={styles.base} data-motion="laptop-base" aria-hidden="true">
        <div className={styles.notch} />
      </div>
    </div>
  );
}
