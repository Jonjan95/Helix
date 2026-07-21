"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  journeyMotionConfig,
  type JourneyMotionProfile,
  type SpatialMotionProfile,
  type WorkspaceHandoffProfile,
} from "@/components/motion/journey-motion.config";
import {
  helixChapterIds,
  helixChapters,
  type HelixChapterId,
} from "@/data/helix-chapters";
import styles from "@/styles/JourneyMotion.module.css";

type JourneyMotionProps = {
  children: ReactNode;
};

type MotionTargets = {
  arrival: HTMLElement;
  copy: HTMLElement;
  frame: HTMLElement;
  indicator: HTMLElement;
  journey: HTMLElement;
  journeyBackRail: SVGElement;
  journeyChapters: HTMLElement[];
  journeyConnectors: HTMLElement[];
  journeyContents: HTMLElement[];
  journeyContinuation: HTMLElement;
  journeyFrontRail: SVGElement;
  journeyNodes: HTMLElement[];
  journeyPath: HTMLElement;
  journeyRungs: SVGElement;
  laptop: HTMLElement;
  laptopBase: HTMLElement;
  laptopCamera: HTMLElement;
  laptopShell: HTMLElement;
  screen: HTMLElement;
  screenIdentity: HTMLElement;
  workspace: HTMLElement;
  workspaceThreshold: HTMLElement;
};

type MotionConditions = {
  desktop?: boolean;
  mobile?: boolean;
  reduced?: boolean;
  tablet?: boolean;
};

type JourneyChapterState =
  | "upcoming"
  | "approaching"
  | "active"
  | "departing"
  | "passed"
  | "static";

type JourneyStatePhase =
  | "before-journey"
  | "transitioning"
  | "focused"
  | "static";

type ChapterTrigger = {
  index: number;
  trigger: ScrollTrigger;
};

function getMotionTargets(scope: HTMLElement): MotionTargets | null {
  const { selectors } = journeyMotionConfig;
  const singleTargets = {
    arrival: scope.querySelector<HTMLElement>(selectors.arrival),
    copy: scope.querySelector<HTMLElement>(selectors.copy),
    frame: scope.querySelector<HTMLElement>(selectors.frame),
    indicator: scope.querySelector<HTMLElement>(selectors.indicator),
    journey: scope.querySelector<HTMLElement>(selectors.journey),
    journeyBackRail: scope.querySelector<SVGElement>(selectors.journeyBackRail),
    journeyContinuation: scope.querySelector<HTMLElement>(
      selectors.journeyContinuation,
    ),
    journeyFrontRail: scope.querySelector<SVGElement>(
      selectors.journeyFrontRail,
    ),
    journeyPath: scope.querySelector<HTMLElement>(selectors.journeyPath),
    journeyRungs: scope.querySelector<SVGElement>(selectors.journeyRungs),
    laptop: scope.querySelector<HTMLElement>(selectors.laptop),
    laptopBase: scope.querySelector<HTMLElement>(selectors.laptopBase),
    laptopCamera: scope.querySelector<HTMLElement>(selectors.laptopCamera),
    laptopShell: scope.querySelector<HTMLElement>(selectors.laptopShell),
    screen: scope.querySelector<HTMLElement>(selectors.screen),
    screenIdentity: scope.querySelector<HTMLElement>(selectors.screenIdentity),
    workspace: scope.querySelector<HTMLElement>(selectors.workspace),
    workspaceThreshold: scope.querySelector<HTMLElement>(
      selectors.workspaceThreshold,
    ),
  };
  const groupedTargets = {
    journeyChapters: gsap.utils.toArray<HTMLElement>(
      selectors.journeyChapter,
      scope,
    ),
    journeyConnectors: gsap.utils.toArray<HTMLElement>(
      selectors.journeyConnector,
      scope,
    ),
    journeyContents: gsap.utils.toArray<HTMLElement>(
      selectors.journeyContent,
      scope,
    ),
    journeyNodes: gsap.utils.toArray<HTMLElement>(selectors.journeyNode, scope),
  };

  const hasMissingSingleTarget = Object.values(singleTargets).some(
    (target) => target === null,
  );
  const hasIncompleteChapterGroup = Object.values(groupedTargets).some(
    (targets) => targets.length !== helixChapterIds.length,
  );

  if (hasMissingSingleTarget || hasIncompleteChapterGroup) {
    return null;
  }

  return { ...singleTargets, ...groupedTargets } as MotionTargets;
}

function getCameraTransform(
  laptop: HTMLElement,
  screen: HTMLElement,
  profile: SpatialMotionProfile,
) {
  const laptopBounds = laptop.getBoundingClientRect();
  const screenBounds = screen.getBoundingClientRect();
  const screenCenterX = screenBounds.left + screenBounds.width / 2;
  const screenCenterY = screenBounds.top + screenBounds.height / 2;
  const scaleToCover =
    Math.max(
      window.innerWidth / screenBounds.width,
      window.innerHeight / screenBounds.height,
    ) * profile.screenCoverage;

  return {
    scale: Math.min(
      profile.maxScale,
      Math.max(profile.minScale, scaleToCover),
    ),
    transformOrigin: `${screenCenterX - laptopBounds.left}px ${
      screenCenterY - laptopBounds.top
    }px`,
    x: window.innerWidth / 2 - screenCenterX,
    y: window.innerHeight / 2 - screenCenterY,
  };
}

function createSpatialTimeline(
  targets: MotionTargets,
  profile: SpatialMotionProfile,
  handoff: WorkspaceHandoffProfile,
) {
  const { timeline } = journeyMotionConfig;
  const getTransform = () =>
    getCameraTransform(targets.laptop, targets.screen, profile);

  return gsap
    .timeline({
      defaults: { overwrite: "auto" },
      scrollTrigger: {
        anticipatePin: 1,
        end: () => {
          const distance = window.innerHeight * profile.scrollDistanceViewport;

          return `+=${Math.min(
            profile.scrollDistanceMax,
            Math.max(profile.scrollDistanceMin, distance),
          )}`;
        },
        invalidateOnRefresh: true,
        pin: targets.arrival,
        scrub: profile.scrub,
        start: "top top",
        trigger: targets.arrival,
      },
    })
    .to(
      targets.laptop,
      {
        force3D: true,
        scale: () => getTransform().scale,
        transformOrigin: () => getTransform().transformOrigin,
        x: () => getTransform().x,
        y: () => getTransform().y,
        duration: timeline.cameraDuration,
        ease: "power1.inOut",
      },
      timeline.cameraStart,
    )
    .to(
      [targets.copy, targets.frame, targets.indicator],
      {
        opacity: profile.contentOpacity,
        y: profile.contentTravel,
        duration: timeline.recedeDuration,
        ease: "power1.inOut",
      },
      timeline.recedeStart,
    )
    .to(
      targets.screenIdentity,
      {
        opacity: handoff.identityOpacity,
        scale: 1.025,
        duration: handoff.duration,
        ease: "power1.inOut",
      },
      handoff.start,
    )
    .to(
      targets.workspaceThreshold,
      {
        opacity: handoff.thresholdOpacity,
        scale: 1,
        duration: handoff.duration,
        ease: "power1.inOut",
      },
      handoff.start,
    )
    .to(
      targets.screen,
      {
        "--screen-frame-opacity": handoff.screenFrameOpacity,
        duration: handoff.duration,
        ease: "power1.inOut",
      },
      handoff.start,
    )
    .to(
      [targets.laptopShell, targets.laptopCamera],
      {
        opacity: handoff.shellOpacity,
        duration: handoff.duration,
        ease: "power1.inOut",
      },
      handoff.start,
    )
    .to(
      targets.laptopBase,
      {
        opacity: handoff.shellOpacity,
        y: handoff.baseTravel,
        duration: handoff.duration,
        ease: "power1.inOut",
      },
      handoff.start,
    );
}

function createMobileTimeline(targets: MotionTargets) {
  const { handoff, mobile } = journeyMotionConfig;

  return gsap
    .timeline({
      scrollTrigger: {
        end: "bottom top",
        invalidateOnRefresh: true,
        scrub: mobile.scrub,
        start: "top top",
        trigger: targets.arrival,
      },
    })
    .to(
      targets.laptop,
      {
        force3D: true,
        scale: mobile.laptopScale,
        y: mobile.laptopTravel,
        duration: 1,
        ease: "none",
      },
      0,
    )
    .to(
      [targets.frame, targets.indicator],
      {
        opacity: mobile.contentOpacity,
        y: mobile.contentTravel,
        duration: 0.7,
        ease: "none",
      },
      0.3,
    )
    .to(
      targets.screenIdentity,
      {
        opacity: handoff.mobile.identityOpacity,
        duration: handoff.mobile.duration,
        ease: "none",
      },
      handoff.mobile.start,
    )
    .to(
      targets.workspaceThreshold,
      {
        opacity: handoff.mobile.thresholdOpacity,
        scale: 1,
        duration: handoff.mobile.duration,
        ease: "none",
      },
      handoff.mobile.start,
    )
    .to(
      targets.screen,
      {
        "--screen-frame-opacity": handoff.mobile.screenFrameOpacity,
        duration: handoff.mobile.duration,
        ease: "none",
      },
      handoff.mobile.start,
    )
    .to(
      [targets.laptopShell, targets.laptopCamera],
      {
        opacity: handoff.mobile.shellOpacity,
        duration: handoff.mobile.duration,
        ease: "none",
      },
      handoff.mobile.start,
    )
    .to(
      targets.laptopBase,
      {
        opacity: handoff.mobile.shellOpacity,
        y: handoff.mobile.baseTravel,
        duration: handoff.mobile.duration,
        ease: "none",
      },
      handoff.mobile.start,
    );
}

function applyJourneyState(
  targets: MotionTargets,
  activeChapter: HelixChapterId | "none" | "static",
  phase: JourneyStatePhase,
  getState: (index: number) => JourneyChapterState,
) {
  targets.journey.dataset.activeChapter = activeChapter;
  targets.journey.dataset.journeyPhase = phase;
  targets.journeyChapters.forEach((chapter, index) => {
    chapter.dataset.journeyState = getState(index);
  });
  targets.journeyNodes.forEach((node, index) => {
    node.dataset.nodeState = getState(index);
  });
}

function setUpcomingJourneyState(targets: MotionTargets) {
  applyJourneyState(targets, "none", "before-journey", () => "upcoming");
}

function setApproachingJourneyState(targets: MotionTargets, index: number) {
  const previousIndex = index - 1;

  applyJourneyState(
    targets,
    previousIndex >= 0 ? helixChapterIds[previousIndex] : "none",
    "transitioning",
    (chapterIndex) => {
      if (chapterIndex < previousIndex) {
        return "passed";
      }
      if (chapterIndex === previousIndex) {
        return "departing";
      }
      if (chapterIndex === index) {
        return "approaching";
      }

      return "upcoming";
    },
  );
}

function setActiveJourneyState(targets: MotionTargets, activeIndex: number) {
  applyJourneyState(
    targets,
    helixChapterIds[activeIndex],
    "focused",
    (index) => {
      if (index < activeIndex) {
        return "passed";
      }
      if (index === activeIndex) {
        return "active";
      }

      return "upcoming";
    },
  );
}

function setStaticJourneyState(targets: MotionTargets) {
  applyJourneyState(targets, "static", "static", () => "static");
}

function createJourneyPathTimeline(
  targets: MotionTargets,
  profile: JourneyMotionProfile,
) {
  return gsap
    .timeline({
      defaults: { ease: "none", overwrite: "auto" },
      scrollTrigger: {
        end: profile.pathEnd,
        invalidateOnRefresh: true,
        scrub: profile.scrub,
        start: profile.pathStart,
        trigger: targets.journey,
      },
    })
    .fromTo(
      targets.journeyPath,
      {
        force3D: true,
        opacity: profile.pathOpacityFrom,
        scale: profile.pathScaleFrom,
        y: profile.pathTravelFrom,
      },
      { opacity: 1, scale: 1, y: 0, duration: 1 },
      0,
    )
    .fromTo(
      targets.journeyBackRail,
      { opacity: profile.pathBackOpacityFrom, y: profile.pathTravelFrom * 0.4 },
      { opacity: 1, y: 0, duration: 0.82 },
      0.04,
    )
    .fromTo(
      targets.journeyRungs,
      { opacity: profile.pathRungOpacityFrom, y: profile.pathTravelFrom * 0.25 },
      { opacity: 1, y: 0, duration: 0.72 },
      0.14,
    )
    .fromTo(
      targets.journeyFrontRail,
      { opacity: profile.pathFrontOpacityFrom, y: profile.pathTravelFrom * 0.18 },
      { opacity: 1, y: 0, duration: 0.78 },
      0.08,
    );
}

function createChapterTimelines(
  targets: MotionTargets,
  profile: JourneyMotionProfile,
) {
  return targets.journeyChapters.map((chapter, index): ChapterTrigger => {
    const range = profile.chapters[helixChapters[index].pacing];
    const timeline = gsap.timeline({
      defaults: { ease: "none", overwrite: "auto" },
      scrollTrigger: {
        end: range.focusStart,
        invalidateOnRefresh: true,
        onEnter: () => setApproachingJourneyState(targets, index),
        onEnterBack: () => setApproachingJourneyState(targets, index),
        onLeave: () => setActiveJourneyState(targets, index),
        onLeaveBack: () =>
          index === 0
            ? setUpcomingJourneyState(targets)
            : setActiveJourneyState(targets, index - 1),
        scrub: profile.scrub,
        start: range.approachStart,
        trigger: chapter,
      },
    });

    timeline
      .fromTo(
        targets.journeyNodes[index],
        { scale: range.nodeScaleFrom },
        { scale: 1, duration: 0.3 },
        0.06,
      )
      .fromTo(
        targets.journeyConnectors[index],
        { scaleX: 0 },
        { scaleX: 1, duration: 0.32 },
        0.12,
      )
      .fromTo(
        targets.journeyContents[index],
        { y: range.contentTravel },
        { y: 0, duration: 0.46 },
        0.18,
      );

    if (index === targets.journeyChapters.length - 1) {
      timeline.fromTo(
        targets.journeyContinuation,
        {
          opacity: profile.continuationOpacityFrom,
          y: range.contentTravel * 0.5,
        },
        { opacity: 1, y: 0, duration: 0.3 },
        0.58,
      );
    }

    return {
      index,
      trigger: timeline.scrollTrigger as ScrollTrigger,
    };
  });
}

function syncJourneyState(
  targets: MotionTargets,
  chapterTriggers: ChapterTrigger[],
) {
  const scrollPosition = window.scrollY;
  let activeIndex = -1;
  let approachingIndex = -1;

  for (const chapterTrigger of chapterTriggers) {
    if (scrollPosition >= chapterTrigger.trigger.end) {
      activeIndex = chapterTrigger.index;
      continue;
    }
    if (scrollPosition >= chapterTrigger.trigger.start) {
      approachingIndex = chapterTrigger.index;
    }
    break;
  }

  if (approachingIndex >= 0) {
    setApproachingJourneyState(targets, approachingIndex);
  } else if (activeIndex >= 0) {
    setActiveJourneyState(targets, activeIndex);
  } else {
    setUpcomingJourneyState(targets);
  }
}

function scheduleInitialJourneySync(
  targets: MotionTargets,
  chapterTriggers: ChapterTrigger[],
) {
  let hashFrame = 0;
  let restoreFrame = 0;
  let syncFrame = 0;
  const sync = () => syncJourneyState(targets, chapterTriggers);
  const restoreHashPosition = () => {
    const hash = window.location.hash.slice(1);
    const hashTarget = hash ? document.getElementById(hash) : null;

    if (hashTarget && targets.journey.contains(hashTarget)) {
      const documentRoot = document.documentElement;
      const previousScrollBehavior = documentRoot.style.scrollBehavior;
      const targetTop =
        hashTarget.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight * 0.34;

      documentRoot.style.scrollBehavior = "auto";
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
      documentRoot.style.scrollBehavior = previousScrollBehavior;
      ScrollTrigger.update();
    }
    sync();
  };
  const handleHashChange = () => {
    window.cancelAnimationFrame(hashFrame);
    hashFrame = window.requestAnimationFrame(restoreHashPosition);
  };

  ScrollTrigger.addEventListener("refresh", sync);
  window.addEventListener("hashchange", handleHashChange);
  restoreFrame = window.requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    syncFrame = window.requestAnimationFrame(restoreHashPosition);
  });

  return () => {
    window.cancelAnimationFrame(hashFrame);
    window.cancelAnimationFrame(restoreFrame);
    window.cancelAnimationFrame(syncFrame);
    window.removeEventListener("hashchange", handleHashChange);
    ScrollTrigger.removeEventListener("refresh", sync);
  };
}

function clearMotionStyles(targets: MotionTargets) {
  gsap.set(
    [
      targets.arrival,
      targets.copy,
      targets.frame,
      targets.indicator,
      targets.journey,
      targets.journeyBackRail,
      ...targets.journeyChapters,
      ...targets.journeyConnectors,
      ...targets.journeyContents,
      targets.journeyContinuation,
      targets.journeyFrontRail,
      ...targets.journeyNodes,
      targets.journeyPath,
      targets.journeyRungs,
      targets.laptop,
      targets.laptopBase,
      targets.laptopCamera,
      targets.laptopShell,
      targets.screen,
      targets.screenIdentity,
      targets.workspace,
      targets.workspaceThreshold,
    ],
    { clearProps: "all" },
  );
}

export function JourneyMotion({ children }: JourneyMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let media: gsap.MatchMedia | undefined;
    let targets: MotionTargets | null = null;
    const context = gsap.context(() => {
      targets = getMotionTargets(scope);

      if (!targets) {
        scope.dataset.motionState = "unavailable";
        return;
      }

      media = gsap.matchMedia();
      media.add(journeyMotionConfig.media, (mediaContext) => {
        const conditions = mediaContext.conditions as MotionConditions;

        if (!targets) {
          return;
        }

        if (conditions.reduced) {
          scope.dataset.motionState = "reduced";
          setStaticJourneyState(targets);
          clearMotionStyles(targets);
          return;
        }

        scope.dataset.motionState = "ready";
        setUpcomingJourneyState(targets);

        let chapterTriggers: ChapterTrigger[] = [];

        if (conditions.desktop) {
          createSpatialTimeline(
            targets,
            journeyMotionConfig.desktop,
            journeyMotionConfig.handoff.desktop,
          );
          createJourneyPathTimeline(targets, journeyMotionConfig.journey.desktop);
          chapterTriggers = createChapterTimelines(
            targets,
            journeyMotionConfig.journey.desktop,
          );
        } else if (conditions.tablet) {
          createSpatialTimeline(
            targets,
            journeyMotionConfig.tablet,
            journeyMotionConfig.handoff.tablet,
          );
          createJourneyPathTimeline(targets, journeyMotionConfig.journey.tablet);
          chapterTriggers = createChapterTimelines(
            targets,
            journeyMotionConfig.journey.tablet,
          );
        } else if (conditions.mobile) {
          createMobileTimeline(targets);
          createJourneyPathTimeline(targets, journeyMotionConfig.journey.mobile);
          chapterTriggers = createChapterTimelines(
            targets,
            journeyMotionConfig.journey.mobile,
          );
        }

        return scheduleInitialJourneySync(targets, chapterTriggers);
      });
    }, scope);

    return () => {
      delete scope.dataset.motionState;
      if (targets) {
        setStaticJourneyState(targets);
      }
      media?.revert();
      context.revert();
    };
  }, []);

  return (
    <div
      ref={scopeRef}
      className={styles.journey}
      data-motion-root="helix-experience"
      data-motion-state="idle"
    >
      {children}
    </div>
  );
}
