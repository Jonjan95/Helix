import styles from "@/styles/HelixPath.module.css";

const rungs = [
  [330, 670, 190],
  [250, 750, 420],
  [210, 790, 720],
  [280, 720, 1010],
  [350, 650, 1280],
  [300, 700, 1740],
  [220, 780, 2050],
  [255, 745, 2360],
  [340, 660, 2580],
  [320, 680, 2920],
  [235, 765, 3220],
  [270, 730, 3510],
  [350, 650, 3740],
  [310, 690, 4110],
  [225, 775, 4370],
  [275, 725, 4610],
  [345, 655, 4900],
  [300, 700, 5160],
] as const;

export function HelixPath() {
  return (
    <div
      className={styles.path}
      data-motion="journey-path"
      data-testid="helix-path"
      aria-hidden="true"
    >
      <svg
        className={styles.structure}
        viewBox="0 0 1000 5260"
        fill="none"
        focusable="false"
        preserveAspectRatio="none"
      >
        <line className={styles.axis} x1="500" y1="0" x2="500" y2="5260" />

        <g className={styles.backRail} data-motion="journey-back-rail">
          <path
            d="M500 -140C220 0 220 300 500 458C820 760 820 1230 500 1534C180 1880 180 2400 500 2739C820 3050 820 3530 500 3835C180 4110 180 4560 500 4803C750 5000 750 5200 500 5390"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g className={styles.rungs} data-motion="journey-rungs">
          {rungs.map(([x1, x2, y]) => (
            <line
              key={y}
              x1={x1}
              x2={x2}
              y1={y}
              y2={y}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g className={styles.frontRail} data-motion="journey-front-rail">
          <path
            d="M500 -140C780 0 780 300 500 458C180 760 180 1230 500 1534C820 1880 820 2400 500 2739C180 3050 180 3530 500 3835C820 4110 820 4560 500 4803C250 5000 250 5200 500 5390"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
