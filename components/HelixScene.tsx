import styles from "@/styles/HelixScene.module.css";

const rungs = [
  [314, 406, 48],
  [421, 302, 124],
  [436, 291, 202],
  [348, 382, 282],
  [170, 560, 362],
  [82, 648, 442],
  [91, 639, 522],
  [193, 537, 602],
  [394, 336, 682],
  [507, 224, 762],
  [503, 232, 842],
  [394, 350, 922],
] as const;

const nodes = [
  { cx: 421, cy: 124, slot: "orientation" },
  { cx: 560, cy: 362, slot: "engineering" },
  { cx: 91, cy: 522, slot: "selected-work" },
  { cx: 336, cy: 682, slot: "proof" },
  { cx: 503, cy: 842, slot: "future" },
  { cx: 350, cy: 922, slot: "continuation" },
] as const;

export function HelixScene() {
  return (
    <div
      className={styles.scene}
      data-motion="helix-scene"
      data-testid="helix-scene"
      aria-hidden="true"
    >
      <div className={styles.telemetry}>
        <span>HELIX / STRUCTURE 01</span>
        <span>RELATION MAP / PROTOTYPE</span>
      </div>

      <div className={styles.stage}>
        <svg
          className={styles.structure}
          data-testid="helix-structure"
          viewBox="0 0 720 970"
          fill="none"
          focusable="false"
        >
          <line className={styles.axis} x1="360" y1="8" x2="360" y2="962" />

          <g className={styles.backRail} data-motion="helix-back-rail">
            <path
              d="M220 8C500 112 520 224 250 326C-10 424 28 556 310 650C590 742 590 854 300 962"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g className={styles.rungs} data-motion="helix-rungs">
            {rungs.map(([x1, x2, y]) => (
              <line
                key={y}
                data-helix-rung=""
                x1={x1}
                x2={x2}
                y1={y}
                y2={y}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          <g className={styles.frontRail} data-motion="helix-front-rail">
            <path
              d="M500 8C220 112 210 224 480 326C740 424 702 556 420 650C140 742 140 854 450 962"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g className={styles.nodes} data-motion="helix-nodes">
            {nodes.map(({ cx, cy, slot }) => (
              <g key={slot} data-helix-node={slot}>
                <circle cx={cx} cy={cy} r="10" />
                <circle className={styles.nodeCore} cx={cx} cy={cy} r="2.5" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <p className={styles.continuation}>PATH CONTINUES / ENGINEERING</p>
    </div>
  );
}
