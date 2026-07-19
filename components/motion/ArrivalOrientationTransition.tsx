"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  arrivalOrientationConfig,
  type SpatialMotionProfile,
} from "@/components/motion/arrival-orientation.config";
import styles from "@/styles/ArrivalOrientationTransition.module.css";

type ArrivalOrientationTransitionProps = {
  children: ReactNode;
};

type MotionTargets = {
  arrival: HTMLElement;
  copy: HTMLElement;
  frame: HTMLElement;
  indicator: HTMLElement;
  laptop: HTMLElement;
  screen: HTMLElement;
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
    frame: scope.querySelector<HTMLElement>(selectors.frame),
    indicator: scope.querySelector<HTMLElement>(selectors.indicator),
    laptop: scope.querySelector<HTMLElement>(selectors.laptop),
    screen: scope.querySelector<HTMLElement>(selectors.screen),
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
    );

  return motion;
}

function createMobileTimeline(targets: MotionTargets) {
  const { mobile } = arrivalOrientationConfig;

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
    );
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
              targets.frame,
              targets.indicator,
              targets.laptop,
              targets.screen,
            ],
            { clearProps: "all" },
          );
          return;
        }

        scope.dataset.motionState = "ready";

        if (conditions.desktop) {
          createSpatialTimeline(targets, arrivalOrientationConfig.desktop);
        } else if (conditions.tablet) {
          createSpatialTimeline(targets, arrivalOrientationConfig.tablet);
        } else if (conditions.mobile) {
          createMobileTimeline(targets);
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
