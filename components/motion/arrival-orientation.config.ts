export type SpatialMotionProfile = {
  contentOpacity: number;
  contentTravel: number;
  maxScale: number;
  minScale: number;
  screenCoverage: number;
  scrollDistanceMax: number;
  scrollDistanceMin: number;
  scrollDistanceViewport: number;
  scrub: number;
};

export const arrivalOrientationConfig = {
  selectors: {
    arrival: '[data-chapter="arrival"]',
    copy: '[data-motion="arrival-copy"]',
    frame: '[data-motion="arrival-frame"]',
    indicator: '[data-motion="arrival-indicator"]',
    laptop: '[data-motion="laptop"]',
    screen: '[data-motion="laptop-screen"]',
  },
  media: {
    desktop:
      "(min-width: 64.001rem) and (prefers-reduced-motion: no-preference)",
    mobile:
      "(max-width: 47.999rem) and (prefers-reduced-motion: no-preference)",
    reduced: "(prefers-reduced-motion: reduce)",
    tablet:
      "(min-width: 48rem) and (max-width: 64rem) and (prefers-reduced-motion: no-preference)",
  },
  desktop: {
    contentOpacity: 0.16,
    contentTravel: -32,
    maxScale: 2.65,
    minScale: 1.7,
    screenCoverage: 1.035,
    scrollDistanceMax: 1320,
    scrollDistanceMin: 760,
    scrollDistanceViewport: 1.15,
    scrub: 0.55,
  } satisfies SpatialMotionProfile,
  tablet: {
    contentOpacity: 0.24,
    contentTravel: -24,
    maxScale: 2.05,
    minScale: 1.4,
    screenCoverage: 0.92,
    scrollDistanceMax: 940,
    scrollDistanceMin: 560,
    scrollDistanceViewport: 0.82,
    scrub: 0.45,
  } satisfies SpatialMotionProfile,
  mobile: {
    contentOpacity: 0.62,
    contentTravel: -12,
    laptopScale: 1.08,
    laptopTravel: -18,
    scrub: 0.25,
  },
  timeline: {
    cameraDuration: 0.76,
    cameraStart: 0.12,
    recedeDuration: 0.52,
    recedeStart: 0.18,
  },
} as const;
