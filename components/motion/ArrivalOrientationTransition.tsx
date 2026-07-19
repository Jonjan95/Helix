"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  arrivalOrientationConfig,
  type HelixMotionProfile,
  type SpatialMotionProfile,
  type WorkspaceHandoffProfile,
} from "@/components/motion/arrival-orientation.config";
import styles from "@/styles/ArrivalOrientationTransition.module.css";

type ArrivalOrientationTransitionProps = {
  children: ReactNode;
};

type MotionTargets = {
  arrival: HTMLElement;
  copy: HTMLElement;
  engineeringChapter: HTMLElement;
  engineeringConnector: HTMLElement;
  engineeringContent: HTMLElement;
  engineeringNode: SVGElement;
  frame: HTMLElement;
  helixBackRail: SVGElement;
  helixFrontRail: SVGElement;
  helixNodes: SVGElement;
  helixRungs: SVGElement;
  helixScene: HTMLElement;
  helixContinuation: HTMLElement;
  indicator: HTMLElement;
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
  const { selectors } = arrivalOrientationConfig;
  const targets = {
    arrival: scope.querySelector<HTMLElement>(selectors.arrival),
    copy: scope.querySelector<HTMLElement>(selectors.copy),
    engineeringChapter: scope.querySelector<HTMLElement>(
      selectors.engineeringChapter,
    ),
    engineeringConnector: scope.querySelector<HTMLElement>(
      selectors.engineeringConnector,
    ),
    engineeringContent: scope.querySelector<HTMLElement>(
      selectors.engineeringContent,
    ),
    engineeringNode: scope.querySelector<SVGElement>(
      selectors.engineeringNode,
    ),
    frame: scope.querySelector<HTMLElement>(selectors.frame),
    helixBackRail: scope.querySelector<SVGElement>(selectors.helixBackRail),
    helixFrontRail: scope.querySelector<SVGElement>(selectors.helixFrontRail),
    helixNodes: scope.querySelector<SVGElement>(selectors.helixNodes),
    helixRungs: scope.querySelector<SVGElement>(selectors.helixRungs),
    helixScene: scope.querySelector<HTMLElement>(selectors.helixScene),
    helixContinuation: scope.querySelector<HTMLElement>(
      selectors.helixContinuation,
    ),
    indicator: scope.querySelector<HTMLElement>(selectors.indicator),
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

  if (Object.values(targets).some((target) => target === null)) {
    return null;
  }

  return targets as MotionTargets;
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
  const { timeline } = arrivalOrientationConfig;
  const getTransform = () =>
    getCameraTransform(targets.laptop, targets.screen, profile);

  const motion = gsap.timeline({
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
  });

  motion
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

  return motion;
}

function createMobileTimeline(targets: MotionTargets) {
  const { handoff, mobile } = arrivalOrientationConfig;

  const motion = gsap.timeline({
    scrollTrigger: {
      end: "bottom top",
      invalidateOnRefresh: true,
      scrub: mobile.scrub,
      start: "top top",
      trigger: targets.arrival,
    },
  });

  motion
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

  return motion;
}

function createHelixTimeline(
  targets: MotionTargets,
  profile: HelixMotionProfile,
) {
  const motion = gsap.timeline({
    defaults: { ease: "none", overwrite: "auto" },
    scrollTrigger: {
      end: profile.end,
      invalidateOnRefresh: true,
      scrub: profile.scrub,
      start: profile.start,
      trigger: targets.engineeringChapter,
    },
  });

  motion
    .fromTo(
      targets.helixScene,
      {
        force3D: true,
        scale: profile.scaleFrom,
        y: profile.travelFrom,
      },
      {
        scale: 1,
        y: profile.travelTo,
        duration: 1,
      },
      0,
    )
    .fromTo(
      targets.helixBackRail,
      { opacity: profile.backRailOpacityFrom, y: profile.depthTravel },
      { opacity: 1, y: 0, duration: 0.88 },
      0.04,
    )
    .fromTo(
      targets.helixRungs,
      { opacity: profile.rungOpacityFrom, y: profile.depthTravel * 0.75 },
      { opacity: 1, y: 0, duration: 0.78 },
      0.14,
    )
    .fromTo(
      targets.helixFrontRail,
      { opacity: profile.frontRailOpacityFrom, y: profile.depthTravel * 0.45 },
      { opacity: 1, y: 0, duration: 0.84 },
      0.08,
    )
    .fromTo(
      targets.helixNodes,
      { opacity: profile.nodeOpacityFrom, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.34 },
      0.12,
    )
    .fromTo(
      targets.engineeringNode,
      {
        opacity: profile.activeNodeOpacityFrom,
        scale: profile.activeNodeScaleFrom,
      },
      { opacity: 1, scale: 1, duration: 0.22 },
      0.18,
    )
    .fromTo(
      targets.engineeringConnector,
      {
        opacity: profile.connectorOpacityFrom,
        scaleX: 0,
        transformOrigin: "left center",
      },
      { opacity: 0.7, scaleX: 1, duration: 0.2 },
      0.24,
    )
    .fromTo(
      targets.engineeringContent,
      { opacity: profile.contentOpacityFrom, y: profile.contentTravel },
      { opacity: 1, y: 0, duration: 0.26 },
      0.3,
    )
    .fromTo(
      targets.helixContinuation,
      { opacity: profile.continuationOpacityFrom },
      { opacity: 1, duration: 0.26 },
      0.64,
    );

  return motion;
}

export function ArrivalOrientationTransition({
  children,
}: ArrivalOrientationTransitionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let media: gsap.MatchMedia | undefined;
    const context = gsap.context(() => {
      const targets = getMotionTargets(scope);

      if (!targets) {
        scope.dataset.motionState = "unavailable";
        return;
      }

      media = gsap.matchMedia();
      media.add(arrivalOrientationConfig.media, (mediaContext) => {
        const conditions = mediaContext.conditions as MotionConditions;

        if (conditions.reduced) {
          scope.dataset.motionState = "reduced";
          gsap.set(
            [
              targets.arrival,
              targets.copy,
              targets.engineeringChapter,
              targets.engineeringConnector,
              targets.engineeringContent,
              targets.engineeringNode,
              targets.frame,
              targets.helixBackRail,
              targets.helixFrontRail,
              targets.helixNodes,
              targets.helixRungs,
              targets.helixScene,
              targets.helixContinuation,
              targets.indicator,
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
          return;
        }

        scope.dataset.motionState = "ready";

        if (conditions.desktop) {
          createSpatialTimeline(
            targets,
            arrivalOrientationConfig.desktop,
            arrivalOrientationConfig.handoff.desktop,
          );
          createHelixTimeline(targets, arrivalOrientationConfig.helix.desktop);
        } else if (conditions.tablet) {
          createSpatialTimeline(
            targets,
            arrivalOrientationConfig.tablet,
            arrivalOrientationConfig.handoff.tablet,
          );
          createHelixTimeline(targets, arrivalOrientationConfig.helix.tablet);
        } else if (conditions.mobile) {
          createMobileTimeline(targets);
          createHelixTimeline(targets, arrivalOrientationConfig.helix.mobile);
        }
      });
    }, scope);

    return () => {
      delete scope.dataset.motionState;
      media?.revert();
      context.revert();
    };
  }, []);

  return (
    <div
      ref={scopeRef}
      className={styles.journey}
      data-motion-root="arrival-orientation"
      data-motion-state="idle"
    >
      {children}
    </div>
  );
}
