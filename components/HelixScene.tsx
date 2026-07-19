import styles from "@/styles/HelixScene.module.css";

export type HelixNodeName =
  | "orientation"
  | "engineering"
  | "selected-work"
  | "proof"
  | "future"
  | "continuation";

type HelixSceneProps = {
  activeNode: HelixNodeName;
};

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

export function HelixScene({ activeNode }: HelixSceneProps) {
  return (
    <div
      className={styles.scene}
      data-motion="helix-scene"
      data-testid="helix-scene"
      data-active-node={activeNode}
      aria-hidden="true"
    >
      <p className={styles.pathLabel}>PATH / 02</p>

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
                className={y === 362 ? styles.activeRung : undefined}
                data-node-connection={y === 362 ? "engineering" : undefined}
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
              <g
                key={slot}
                className={activeNode === slot ? styles.activeNode : undefined}
                data-helix-node={slot}
                data-node-state={activeNode === slot ? "active" : "inactive"}
                data-motion={
                  activeNode === slot ? "engineering-node" : undefined
                }
                data-testid={
                  activeNode === slot ? "engineering-node" : undefined
                }
              >
                <circle cx={cx} cy={cy} r="10" />
                <circle className={styles.nodeCore} cx={cx} cy={cy} r="2.5" />
              </g>
            ))}
          </g>
        </svg>
      </div>

    </div>
  );
}
