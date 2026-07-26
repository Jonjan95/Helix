import type { SpatialDepth } from "@/lib/spatial/prototype-data";
import styles from "@/styles/lab/SpatialLab.module.css";

type SvgSpatialPrototypeProps = {
  depth: SpatialDepth;
  reduced: boolean;
};

const nodes = [
  [300, 165],
  [510, 315],
  [270, 485],
  [500, 645],
] as const;

export function SvgSpatialPrototype({
  depth,
  reduced,
}: SvgSpatialPrototypeProps) {
  return (
    <section
      className={styles.prototype}
      data-spatial-prototype="svg"
      data-spatial-depth={depth}
      data-spatial-reduced={reduced}
      aria-labelledby="svg-prototype-title"
    >
      <div className={`${styles.scene} ${styles.svgScene}`}>
        <svg
          className={styles.spatialSvg}
          viewBox="0 0 800 760"
          fill="none"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lab-depth-front" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#69d3e7" stopOpacity="0.16" />
              <stop offset="0.48" stopColor="#69d3e7" stopOpacity="0.78" />
              <stop offset="1" stopColor="#69d3e7" stopOpacity="0.28" />
            </linearGradient>
            <linearGradient id="lab-depth-back" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#a8adb2" stopOpacity="0.08" />
              <stop offset="0.5" stopColor="#a8adb2" stopOpacity="0.42" />
              <stop offset="1" stopColor="#a8adb2" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <g className={styles.svgScreenPlane}>
            <path d="M240 60H560L640 170H160L240 60Z" />
            <line x1="400" y1="170" x2="400" y2="238" />
          </g>
          <g className={styles.svgBack}>
            <path d="M400 185C145 275 690 365 400 455C120 540 690 635 400 735" />
          </g>
          <g className={styles.svgRungs}>
            {nodes.map(([x, y]) => (
              <line key={y} x1={x} x2={800 - x} y1={y} y2={y} />
            ))}
          </g>
          <g className={styles.svgFront}>
            <path d="M400 185C655 275 110 365 400 455C680 540 110 635 400 735" />
          </g>
          <g className={styles.svgNodes}>
            {nodes.map(([x, y], index) => (
              <g key={y}>
                <circle cx={index % 2 === 0 ? x : 800 - x} cy={y} r="17" />
                <circle cx={index % 2 === 0 ? x : 800 - x} cy={y} r="4" />
              </g>
            ))}
          </g>
        </svg>
        <div className={styles.svgDepthKey} aria-hidden="true">
          <span>BACK RAIL</span>
          <span>SCREEN PLANE</span>
          <span>FRONT RAIL</span>
        </div>
      </div>
      <div className={styles.prototypeNotes}>
        <p className={styles.prototypeLabel}>B / SVG DEPTH</p>
        <h2 id="svg-prototype-title">Depth through hierarchy, not a camera.</h2>
        <p>
          Layer order, changing stroke weight, and restrained opacity make the
          path pass behind and in front while all meaning stays in normal HTML.
        </p>
        <p className={styles.reducedNote}>
          {reduced
            ? "Static interpretation: depth cues remain, rotation and travel are removed."
            : `${depth === "strong" ? "Stronger" : "Subtle"} depth treatment selected.`}
        </p>
      </div>
    </section>
  );
}
