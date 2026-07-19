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

export type WorkspaceHandoffProfile = {
  baseTravel: number;
  duration: number;
  identityOpacity: number;
  shellOpacity: number;
  start: number;
  thresholdOpacity: number;
};

export const arrivalOrientationConfig = {
  selectors: {
    arrival: '[data-chapter="arrival"]',
    copy: '[data-motion="arrival-copy"]',
    frame: '[data-motion="arrival-frame"]',
    indicator: '[data-motion="arrival-indicator"]',
    laptopBase: '[data-motion="laptop-base"]',
    laptopCamera: '[data-motion="laptop-camera"]',
    laptop: '[data-motion="laptop"]',
    laptopShell: '[data-motion="laptop-shell"]',
    screen: '[data-motion="laptop-screen"]',
    screenIdentity: '[data-motion="screen-identity"]',
    workspace: '[data-motion="digital-workspace"]',
    workspaceThreshold: '[data-motion="workspace-threshold"]',
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
  handoff: {
    desktop: {
      baseTravel: 22,
      duration: 0.24,
      identityOpacity: 0.04,
      shellOpacity: 0.12,
      start: 0.72,
      thresholdOpacity: 1,
    } satisfies WorkspaceHandoffProfile,
    tablet: {
      baseTravel: 14,
      duration: 0.2,
      identityOpacity: 0.12,
      shellOpacity: 0.24,
      start: 0.76,
      thresholdOpacity: 0.92,
    } satisfies WorkspaceHandoffProfile,
    mobile: {
      baseTravel: 8,
      duration: 0.34,
      identityOpacity: 0.36,
      shellOpacity: 0.58,
      start: 0.56,
      thresholdOpacity: 0.82,
    } satisfies WorkspaceHandoffProfile,
  },
  timeline: {
    cameraDuration: 0.76,
    cameraStart: 0.12,
    recedeDuration: 0.52,
    recedeStart: 0.18,
  },
} as const;
