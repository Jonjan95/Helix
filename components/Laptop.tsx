import { arrivalIdentity } from "@/data/early-journey";
import styles from "@/styles/Laptop.module.css";

export function Laptop() {
  return (
    <div
      className={styles.laptop}
      data-machine-direction="opening-machine"
      data-motion="laptop"
      data-testid="laptop-hero"
    >
      <div className={styles.machineScene} data-motion="machine-scene">
        <div
          className={styles.machineShadow}
          data-motion="machine-shadow"
          aria-hidden="true"
        />

        <div
          className={styles.lidAssembly}
          data-motion="laptop-lid"
          aria-hidden="true"
        >
          <div className={styles.lidRear} />
          <div className={styles.lidFront}>
            <span className={styles.lidEdge} />
            <div className={styles.decorativeDisplay} />
            <div className={styles.camera} data-motion="laptop-camera" />
          </div>
        </div>

        <div
          className={styles.hinge}
          data-machine-detail="hinge"
          aria-hidden="true"
        >
          <span className={styles.hingeBarrel} />
          <span className={styles.hingeBarrel} />
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
          </div>
          <div className={styles.baseRear} />
          <div className={styles.frontEdge}>
            <span className={styles.notch} />
          </div>
        </div>
      </div>

      <div className={styles.displayPortal} data-motion="laptop-screen">
        <div
          className={styles.shell}
          data-motion="laptop-shell"
          aria-hidden="true"
        />
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
  );
}
