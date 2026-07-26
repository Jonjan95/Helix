import styles from "@/styles/lab/SpatialLab.module.css";

type LabLaptopProps = {
  layered?: boolean;
};

export function LabLaptop({ layered = false }: LabLaptopProps) {
  return (
    <div
      className={styles.labLaptop}
      data-lab-laptop=""
      data-layered={layered}
      aria-hidden="true"
    >
      <div className={styles.labDisplay}>
        <div className={styles.labShell} data-css-layer="shell" />
        <div className={styles.labScreen} data-css-layer="screen">
          <div className={styles.labScreenGrid} />
          <div className={styles.labIdentity} data-css-layer="identity">
            <span>JONATHAN JANSSON / PORTFOLIO</span>
            <strong>Enter the workspace.</strong>
            <i />
          </div>
          <div className={styles.labThreshold} data-css-layer="threshold">
            <span>SCREEN PLANE / 01</span>
            <div />
            <small>HELIX REVEAL</small>
          </div>
        </div>
      </div>
      <div className={styles.labBase} data-css-layer="base" />
    </div>
  );
}
