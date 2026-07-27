import styles from "@/styles/HelixPath.module.css";

const railGeometry = {
  a: "M500 -140C220 0 220 300 500 458C820 760 820 1230 500 1534C180 1880 180 2400 500 2739C820 3050 820 3530 500 3835C180 4110 180 4560 500 4803C750 5000 750 5200 500 5390",
  b: "M500 -140C780 0 780 300 500 458C180 760 180 1230 500 1534C820 1880 820 2400 500 2739C180 3050 180 3530 500 3835C820 4110 820 4560 500 4803C250 5000 250 5200 500 5390",
} as const;

const nearBands = {
  a: [
    [0, 458],
    [1534, 2739],
    [3835, 4803],
  ],
  b: [
    [458, 1534],
    [2739, 3835],
    [4803, 5260],
  ],
} as const;

const crossings = [
  { rail: "b", y: 458 },
  { rail: "a", y: 1534 },
  { rail: "b", y: 2739 },
  { rail: "a", y: 3835 },
  { rail: "b", y: 4803 },
] as const;

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
      data-helix-depth="layered"
      data-helix-mode="static"
      data-mobile-treatment="static-axis"
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
        <defs>
          <path id="helix-rail-a" d={railGeometry.a} />
          <path id="helix-rail-b" d={railGeometry.b} />

          <clipPath id="helix-near-a" clipPathUnits="userSpaceOnUse">
            {nearBands.a.map(([start, end]) => (
              <rect
                key={`${start}-${end}`}
                x="0"
                y={start}
                width="1000"
                height={end - start}
              />
            ))}
          </clipPath>

          <clipPath id="helix-near-b" clipPathUnits="userSpaceOnUse">
            {nearBands.b.map(([start, end]) => (
              <rect
                key={`${start}-${end}`}
                x="0"
                y={start}
                width="1000"
                height={end - start}
              />
            ))}
          </clipPath>

          {crossings.map(({ y }) => (
            <clipPath
              key={y}
              id={`helix-crossing-${y}`}
              clipPathUnits="userSpaceOnUse"
            >
              <rect x="0" y={y - 34} width="1000" height="68" />
            </clipPath>
          ))}
        </defs>

        <line className={styles.axis} x1="500" y1="0" x2="500" y2="5260" />

        <g
          className={styles.baseRails}
          data-helix-depth-layer="base"
          data-motion="journey-back-rail"
        >
          <use
            className={`${styles.baseRail} ${styles.railA}`}
            href="#helix-rail-a"
          />
          <use
            className={`${styles.baseRail} ${styles.railB}`}
            href="#helix-rail-b"
          />
        </g>

        <g
          className={styles.rungs}
          data-helix-depth-layer="connectors"
          data-motion="journey-rungs"
        >
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

        <g
          className={styles.nearRails}
          data-helix-depth-layer="near"
          data-motion="journey-front-rail"
        >
          <g
            className={`${styles.nearPhase} ${styles.nearPhaseA}`}
            data-helix-ambient="animated"
          >
            <use
              className={`${styles.nearRail} ${styles.railA}`}
              href="#helix-rail-a"
              clipPath="url(#helix-near-a)"
            />
          </g>
          <g
            className={`${styles.nearPhase} ${styles.nearPhaseB}`}
            data-helix-ambient="animated"
          >
            <use
              className={`${styles.nearRail} ${styles.railB}`}
              href="#helix-rail-b"
              clipPath="url(#helix-near-b)"
            />
          </g>

          <g
            className={styles.crossings}
            data-helix-depth-layer="crossings"
          >
            {crossings.map(({ rail, y }) => (
              <g
                key={y}
                data-depth-crossing={rail}
                clipPath={`url(#helix-crossing-${y})`}
              >
                <use
                  className={styles.crossingGap}
                  href={`#helix-rail-${rail}`}
                />
                <use
                  className={`${styles.crossingFront} ${
                    rail === "a" ? styles.railA : styles.railB
                  }`}
                  href={`#helix-rail-${rail}`}
                />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
