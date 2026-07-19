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

export type JourneyMotionProfile = {
  chapterEnd: string;
  chapterStart: string;
  connectorOpacityFrom: number;
  contentTravel: number;
  nodeOpacityFrom: number;
  nodeScaleFrom: number;
  pathBackOpacityFrom: number;
  pathEnd: string;
  pathFrontOpacityFrom: number;
  pathOpacityFrom: number;
  pathRungOpacityFrom: number;
  pathScaleFrom: number;
  pathStart: string;
  pathTravelFrom: number;
  scrub: number;
};

export const journeyMotionConfig = {
  selectors: {
    arrival: '[data-chapter="arrival"]',
    copy: '[data-motion="arrival-copy"]',
    frame: '[data-motion="arrival-frame"]',
    indicator: '[data-motion="arrival-indicator"]',
    journey: '[data-helix-journey]',
    journeyBackRail: '[data-motion="journey-back-rail"]',
    journeyChapter: '[data-journey-chapter]',
    journeyConnector: '[data-motion="journey-connector"]',
    journeyContent: '[data-motion="journey-content"]',
    journeyContinuation: '[data-motion="journey-continuation"]',
    journeyFrontRail: '[data-motion="journey-front-rail"]',
    journeyNode: '[data-motion="journey-node"]',
    journeyPath: '[data-motion="journey-path"]',
    journeyRungs: '[data-motion="journey-rungs"]',
    laptop: '[data-motion="laptop"]',
    laptopBase: '[data-motion="laptop-base"]',
    laptopCamera: '[data-motion="laptop-camera"]',
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
      identityOpacity: 0,
      shellOpacity: 0.12,
      start: 0.72,
      thresholdOpacity: 1,
    } satisfies WorkspaceHandoffProfile,
    tablet: {
      baseTravel: 14,
      duration: 0.2,
      identityOpacity: 0.02,
      shellOpacity: 0.24,
      start: 0.76,
      thresholdOpacity: 0.92,
    } satisfies WorkspaceHandoffProfile,
    mobile: {
      baseTravel: 8,
      duration: 0.34,
      identityOpacity: 0.18,
      shellOpacity: 0.58,
      start: 0.56,
      thresholdOpacity: 0.82,
    } satisfies WorkspaceHandoffProfile,
  },
  journey: {
    desktop: {
      chapterEnd: "bottom 38%",
      chapterStart: "top 72%",
      connectorOpacityFrom: 0.08,
      contentTravel: 28,
      nodeOpacityFrom: 0.38,
      nodeScaleFrom: 0.74,
      pathBackOpacityFrom: 0.2,
      pathEnd: "top 28%",
      pathFrontOpacityFrom: 0.3,
      pathOpacityFrom: 0.46,
      pathRungOpacityFrom: 0.16,
      pathScaleFrom: 0.985,
      pathStart: "top 92%",
      pathTravelFrom: 48,
      scrub: 0.46,
    } satisfies JourneyMotionProfile,
    tablet: {
      chapterEnd: "bottom 42%",
      chapterStart: "top 78%",
      connectorOpacityFrom: 0.16,
      contentTravel: 20,
      nodeOpacityFrom: 0.5,
      nodeScaleFrom: 0.82,
      pathBackOpacityFrom: 0.32,
      pathEnd: "top 34%",
      pathFrontOpacityFrom: 0.42,
      pathOpacityFrom: 0.58,
      pathRungOpacityFrom: 0.25,
      pathScaleFrom: 0.992,
      pathStart: "top 94%",
      pathTravelFrom: 28,
      scrub: 0.34,
    } satisfies JourneyMotionProfile,
    mobile: {
      chapterEnd: "bottom 46%",
      chapterStart: "top 88%",
      connectorOpacityFrom: 0.42,
      contentTravel: 10,
      nodeOpacityFrom: 0.72,
      nodeScaleFrom: 0.94,
      pathBackOpacityFrom: 1,
      pathEnd: "top 62%",
      pathFrontOpacityFrom: 1,
      pathOpacityFrom: 0.72,
      pathRungOpacityFrom: 1,
      pathScaleFrom: 1,
      pathStart: "top 96%",
      pathTravelFrom: 12,
      scrub: 0.2,
    } satisfies JourneyMotionProfile,
  },
  timeline: {
    cameraDuration: 0.76,
    cameraStart: 0.12,
    recedeDuration: 0.52,
    recedeStart: 0.18,
  },
} as const;
