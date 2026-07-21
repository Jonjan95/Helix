import type { HelixChapterPacing } from "@/data/helix-chapters";

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
  screenFrameOpacity: number;
  shellOpacity: number;
  start: number;
  thresholdOpacity: number;
};

export type ChapterMotionRange = {
  approachStart: string;
  contentTravel: number;
  focusStart: string;
  nodeScaleFrom: number;
};

export type JourneyMotionProfile = {
  chapters: Record<HelixChapterPacing, ChapterMotionRange>;
  continuationOpacityFrom: number;
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
    contentOpacity: 0.16,
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
      screenFrameOpacity: 0,
      shellOpacity: 0.12,
      start: 0.72,
      thresholdOpacity: 1,
    } satisfies WorkspaceHandoffProfile,
    tablet: {
      baseTravel: 14,
      duration: 0.2,
      identityOpacity: 0.02,
      screenFrameOpacity: 0.08,
      shellOpacity: 0.12,
      start: 0.76,
      thresholdOpacity: 0.92,
    } satisfies WorkspaceHandoffProfile,
    mobile: {
      baseTravel: 8,
      duration: 0.34,
      identityOpacity: 0.18,
      screenFrameOpacity: 0.3,
      shellOpacity: 0.58,
      start: 0.56,
      thresholdOpacity: 0.82,
    } satisfies WorkspaceHandoffProfile,
  },
  journey: {
    desktop: {
      chapters: {
        entry: {
          approachStart: "top 96%",
          contentTravel: 22,
          focusStart: "top 62%",
          nodeScaleFrom: 0.84,
        },
        featured: {
          approachStart: "top 90%",
          contentTravel: 28,
          focusStart: "top 64%",
          nodeScaleFrom: 0.8,
        },
        expanded: {
          approachStart: "top 92%",
          contentTravel: 26,
          focusStart: "top 66%",
          nodeScaleFrom: 0.82,
        },
        standard: {
          approachStart: "top 90%",
          contentTravel: 22,
          focusStart: "top 64%",
          nodeScaleFrom: 0.84,
        },
        exit: {
          approachStart: "top 94%",
          contentTravel: 18,
          focusStart: "top 70%",
          nodeScaleFrom: 0.86,
        },
      },
      continuationOpacityFrom: 0.16,
      pathBackOpacityFrom: 0.2,
      pathEnd: "top 58%",
      pathFrontOpacityFrom: 0.3,
      pathOpacityFrom: 0.46,
      pathRungOpacityFrom: 0.16,
      pathScaleFrom: 0.985,
      pathStart: "top 104%",
      pathTravelFrom: 36,
      scrub: 0.46,
    } satisfies JourneyMotionProfile,
    tablet: {
      chapters: {
        entry: {
          approachStart: "top 98%",
          contentTravel: 14,
          focusStart: "top 70%",
          nodeScaleFrom: 0.9,
        },
        featured: {
          approachStart: "top 92%",
          contentTravel: 20,
          focusStart: "top 68%",
          nodeScaleFrom: 0.86,
        },
        expanded: {
          approachStart: "top 94%",
          contentTravel: 18,
          focusStart: "top 70%",
          nodeScaleFrom: 0.88,
        },
        standard: {
          approachStart: "top 92%",
          contentTravel: 16,
          focusStart: "top 68%",
          nodeScaleFrom: 0.9,
        },
        exit: {
          approachStart: "top 96%",
          contentTravel: 12,
          focusStart: "top 74%",
          nodeScaleFrom: 0.92,
        },
      },
      continuationOpacityFrom: 0.24,
      pathBackOpacityFrom: 0.32,
      pathEnd: "top 62%",
      pathFrontOpacityFrom: 0.42,
      pathOpacityFrom: 0.58,
      pathRungOpacityFrom: 0.25,
      pathScaleFrom: 0.992,
      pathStart: "top 104%",
      pathTravelFrom: 22,
      scrub: 0.34,
    } satisfies JourneyMotionProfile,
    mobile: {
      chapters: {
        entry: {
          approachStart: "top 96%",
          contentTravel: 8,
          focusStart: "top 64%",
          nodeScaleFrom: 0.96,
        },
        featured: {
          approachStart: "top 92%",
          contentTravel: 10,
          focusStart: "top 68%",
          nodeScaleFrom: 0.94,
        },
        expanded: {
          approachStart: "top 92%",
          contentTravel: 10,
          focusStart: "top 70%",
          nodeScaleFrom: 0.94,
        },
        standard: {
          approachStart: "top 92%",
          contentTravel: 8,
          focusStart: "top 68%",
          nodeScaleFrom: 0.96,
        },
        exit: {
          approachStart: "top 94%",
          contentTravel: 6,
          focusStart: "top 72%",
          nodeScaleFrom: 0.96,
        },
      },
      continuationOpacityFrom: 0.48,
      pathBackOpacityFrom: 1,
      pathEnd: "top 70%",
      pathFrontOpacityFrom: 1,
      pathOpacityFrom: 0.72,
      pathRungOpacityFrom: 1,
      pathScaleFrom: 1,
      pathStart: "top 98%",
      pathTravelFrom: 8,
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
