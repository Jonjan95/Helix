import { arrivalIdentity } from "@/data/early-journey";
import styles from "@/styles/Laptop.module.css";

export function Laptop() {
  return (
    <div
      className={styles.laptop}
      data-machine-direction="refined-workstation"
      data-motion="laptop"
      data-testid="laptop-hero"
    >
      <div className={styles.display}>
        <div
          className={styles.shell}
          data-motion="laptop-shell"
          aria-hidden="true"
        >
          <span className={styles.lidEdge} />
          <span className={styles.hingeRail}>
            <span
              className={styles.hingeCap}
              data-machine-detail="hinge-caps"
            />
            <span
              className={styles.hingeCap}
              data-machine-detail="hinge-caps"
            />
          </span>
        </div>
        <div
          className={styles.camera}
          data-motion="laptop-camera"
          aria-hidden="true"
        />
        <div className={styles.screen} data-motion="laptop-screen">
          <div
            className={styles.screenGrid}
            data-motion="screen-grid"
            aria-hidden="true"
          />
          <div className={styles.screenIdentity} data-motion="screen-identity">
            <span className={styles.systemLabel}>
              {arrivalIdentity.location} / Portfolio
            </span>
            <h1 className={styles.name}>{arrivalIdentity.name}</h1>
            <span className={styles.cursor} aria-hidden="true" />
            <span className={styles.status}>Software · Testing · Quality</span>
          </div>

          <div className={styles.screenDepth} aria-hidden="true">
            <div
              className={styles.screenGlass}
              data-motion="screen-glass"
              aria-hidden="true"
            />
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
      </div>
      <div
        className={styles.base}
        data-motion="laptop-base"
        aria-hidden="true"
      >
        <div className={styles.deckSurface}>
          <span
            className={styles.keyboard}
            data-machine-detail="keyboard"
          />
          <span
            className={styles.trackpad}
            data-machine-detail="trackpad"
          />
          <span
            className={styles.deckAccent}
            data-machine-detail="deck-accent"
          />
        </div>
        <div className={styles.frontEdge}>
          <div className={styles.notch} />
        </div>
      </div>
    </div>
  );
}
