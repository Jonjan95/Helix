import { LabLaptop } from "@/components/lab/spatial/LabLaptop";
import styles from "@/styles/lab/SpatialLab.module.css";

export function BaselinePrototype() {
  return (
    <section
      className={styles.prototype}
      data-spatial-prototype="baseline"
      aria-labelledby="baseline-prototype-title"
    >
      <div className={styles.scene} data-spatial-scene="baseline">
        <LabLaptop />
        <div className={styles.baselineWorkspace} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className={styles.prototypeNotes}>
        <p className={styles.prototypeLabel}>00 / BASELINE</p>
        <h2 id="baseline-prototype-title">The current threshold.</h2>
        <p>
          The laptop reads as a physical gateway and the workspace appears as a
          restrained continuation. This reference adds no experimental depth.
        </p>
      </div>
    </section>
  );
}
