"use client";

import type {
  SpatialDepth,
  SpatialDirection,
} from "@/lib/spatial/prototype-data";
import styles from "@/styles/lab/SpatialLab.module.css";

type ThreeSpatialPrototypeProps = {
  depth: SpatialDepth;
  direction: SpatialDirection;
  forceFallback: boolean;
  playToken: number;
  reduced: boolean;
  resetToken: number;
};

export function ThreeSpatialPrototype({
  forceFallback,
  reduced,
}: ThreeSpatialPrototypeProps) {
  return (
    <section
      className={styles.prototype}
      data-spatial-prototype="three"
      data-webgl-state="pending"
      aria-labelledby="three-prototype-title"
    >
      <div className={styles.scene}>
        <div className={styles.prototypeLoading} data-webgl-fallback="">
          {forceFallback
            ? "WebGL fallback requested."
            : reduced
              ? "Static Three.js preview is being prepared."
              : "Contained Three.js proof of concept is being prepared."}
        </div>
      </div>
      <div className={styles.prototypeNotes}>
        <p className={styles.prototypeLabel}>C / THREE.JS</p>
        <h2 id="three-prototype-title">Real depth, deliberately contained.</h2>
        <p>
          This boundary will test one screen plane, one Helix curve, and one
          camera move without moving portfolio content into canvas.
        </p>
      </div>
    </section>
  );
}
