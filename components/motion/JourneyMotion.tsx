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
import { helixChapterIds } from "@/data/helix-chapters";
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

function setJourneyState(targets: MotionTargets, activeIndex: number) {
  const activeChapter = helixChapterIds[activeIndex];

  if (targets.journey.dataset.activeChapter === activeChapter) {
    return;
  }

  targets.journey.dataset.activeChapter = activeChapter;
  targets.journeyChapters.forEach((chapter, index) => {
    chapter.dataset.journeyState =
      index < activeIndex ? "past" : index === activeIndex ? "active" : "future";
  });
  targets.journeyNodes.forEach((node, index) => {
    node.dataset.nodeState =
      index < activeIndex ? "past" : index === activeIndex ? "active" : "future";
  });
}

function setStaticJourneyState(targets: MotionTargets) {
  targets.journey.dataset.activeChapter = "static";
  targets.journeyChapters.forEach((chapter) => {
    chapter.dataset.journeyState = "static";
  });
  targets.journeyNodes.forEach((node) => {
    node.dataset.nodeState = "static";
  });
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
  targets.journeyChapters.forEach((chapter, index) => {
    const activate = () => setJourneyState(targets, index);
    const timeline = gsap.timeline({
      defaults: { ease: "none", overwrite: "auto" },
      scrollTrigger: {
        end: profile.chapterEnd,
        invalidateOnRefresh: true,
        onEnter: activate,
        onEnterBack: activate,
        onLeaveBack: () => setJourneyState(targets, Math.max(0, index - 1)),
        onUpdate: (self) => {
          if (self.isActive) {
            activate();
          }
        },
        scrub: profile.scrub,
        start: profile.chapterStart,
        trigger: chapter,
      },
    });

    timeline
      .fromTo(
        targets.journeyNodes[index],
        { opacity: profile.nodeOpacityFrom, scale: profile.nodeScaleFrom },
        { opacity: 1, scale: 1, duration: 0.28 },
        0.06,
      )
      .fromTo(
        targets.journeyConnectors[index],
        { opacity: profile.connectorOpacityFrom, scaleX: 0 },
        { opacity: 0.68, scaleX: 1, duration: 0.3 },
        0.12,
      )
      .fromTo(
        targets.journeyContents[index],
        { y: profile.contentTravel },
        { y: 0, duration: 0.42 },
        0.18,
      );

    if (index === targets.journeyChapters.length - 1) {
      timeline.fromTo(
        targets.journeyContinuation,
        { opacity: profile.connectorOpacityFrom, y: profile.contentTravel * 0.5 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.58,
      );
    }
  });
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
        setJourneyState(targets, 0);

        if (conditions.desktop) {
          createSpatialTimeline(
            targets,
            journeyMotionConfig.desktop,
            journeyMotionConfig.handoff.desktop,
          );
          createJourneyPathTimeline(targets, journeyMotionConfig.journey.desktop);
          createChapterTimelines(targets, journeyMotionConfig.journey.desktop);
        } else if (conditions.tablet) {
          createSpatialTimeline(
            targets,
            journeyMotionConfig.tablet,
            journeyMotionConfig.handoff.tablet,
          );
          createJourneyPathTimeline(targets, journeyMotionConfig.journey.tablet);
          createChapterTimelines(targets, journeyMotionConfig.journey.tablet);
        } else if (conditions.mobile) {
          createMobileTimeline(targets);
          createJourneyPathTimeline(targets, journeyMotionConfig.journey.mobile);
          createChapterTimelines(targets, journeyMotionConfig.journey.mobile);
        }
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
