"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { LabLaptop } from "@/components/lab/spatial/LabLaptop";
import type {
  SpatialDepth,
  SpatialDirection,
} from "@/lib/spatial/prototype-data";
import styles from "@/styles/lab/SpatialLab.module.css";

type CssSpatialPrototypeProps = {
  depth: SpatialDepth;
  direction: SpatialDirection;
  playToken: number;
  reduced: boolean;
  resetToken: number;
};

export function CssSpatialPrototype({
  depth,
  direction,
  playToken,
  reduced,
  resetToken,
}: CssSpatialPrototypeProps) {
  const scopeRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set("[data-css-layer]", { clearProps: "all" });
      gsap.set("[data-css-workspace]", { clearProps: "all" });
    }, scope);

    return () => context.revert();
  }, [resetToken]);

  useLayoutEffect(() => {
    const scope = scopeRef.current;

    if (!scope || playToken === 0 || reduced) {
      return;
    }

    const strong = depth === "strong";
    const reverse = direction === "reverse";
    const timeline = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: "power2.inOut",
        overwrite: "auto",
      },
    });
    const laptop = scope.querySelector("[data-lab-laptop]");
    const shell = scope.querySelector('[data-css-layer="shell"]');
    const base = scope.querySelector('[data-css-layer="base"]');
    const identity = scope.querySelector('[data-css-layer="identity"]');
    const threshold = scope.querySelector('[data-css-layer="threshold"]');
    const workspace = scope.querySelector("[data-css-workspace]");

    if (!laptop || !shell || !base || !identity || !threshold || !workspace) {
      return;
    }

    const from = reverse
      ? {
          laptop: {
            rotateX: strong ? -7 : -4,
            scale: strong ? 1.64 : 1.42,
            y: -20,
            z: strong ? 170 : 110,
          },
          shellOpacity: 0.15,
          workspaceOpacity: 1,
          workspaceScale: 1,
        }
      : {
          laptop: { rotateX: 0, scale: 1, y: 0, z: 0 },
          shellOpacity: 1,
          workspaceOpacity: 0.08,
          workspaceScale: 0.82,
        };
    const to = reverse
      ? {
          laptop: { rotateX: 0, scale: 1, y: 0, z: 0 },
          shellOpacity: 1,
          workspaceOpacity: 0.08,
          workspaceScale: 0.82,
        }
      : {
          laptop: {
            rotateX: strong ? -7 : -4,
            scale: strong ? 1.64 : 1.42,
            y: -20,
            z: strong ? 170 : 110,
          },
          shellOpacity: 0.15,
          workspaceOpacity: 1,
          workspaceScale: 1,
        };

    gsap.set(laptop, from.laptop);
    gsap.set([shell, base], { opacity: from.shellOpacity });
    gsap.set(workspace, {
      opacity: from.workspaceOpacity,
      scale: from.workspaceScale,
    });
    gsap.set(identity, { opacity: reverse ? 0 : 1, z: 18 });
    gsap.set(threshold, { opacity: reverse ? 1 : 0, z: 28 });

    timeline
      .to(laptop, to.laptop, 0)
      .to([shell, base], { opacity: to.shellOpacity }, 0.2)
      .to(identity, { opacity: reverse ? 1 : 0, z: reverse ? 18 : -30 }, 0.1)
      .to(threshold, { opacity: reverse ? 0 : 1, z: reverse ? 28 : 70 }, 0.18)
      .to(
        workspace,
        {
          opacity: to.workspaceOpacity,
          scale: to.workspaceScale,
          z: strong && !reverse ? 34 : 0,
        },
        0.28,
      );

    return () => {
      timeline.kill();
    };
  }, [depth, direction, playToken, reduced]);

  return (
    <section
      ref={scopeRef}
      className={styles.prototype}
      data-spatial-prototype="css"
      data-spatial-reduced={reduced}
      aria-labelledby="css-prototype-title"
    >
      <div className={`${styles.scene} ${styles.cssScene}`}>
        <div className={styles.cssCamera}>
          <LabLaptop layered />
          <div
            className={styles.cssWorkspace}
            data-css-workspace=""
            aria-hidden="true"
          >
            <span className={styles.workspacePlane} />
            <span className={styles.workspaceRail} />
            <span className={styles.workspaceNode} />
          </div>
        </div>
      </div>
      <div className={styles.prototypeNotes}>
        <p className={styles.prototypeLabel}>A / CSS + GSAP</p>
        <h2 id="css-prototype-title">The screen becomes a physical plane.</h2>
        <p>
          Perspective gives the shell, identity, threshold, and workspace
          separate depth roles. The movement remains DOM-based, scoped, and
          reversible.
        </p>
        {reduced && (
          <p className={styles.reducedNote}>
            Static interpretation: the threshold and workspace remain visible
            without camera travel.
          </p>
        )}
      </div>
    </section>
  );
}
