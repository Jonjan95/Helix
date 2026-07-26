"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type * as Three from "three";
import type {
  SpatialDepth,
  SpatialDirection,
} from "@/lib/spatial/prototype-data";
import styles from "@/styles/lab/SpatialLab.module.css";

type ThreeSpatialPrototypeProps = {
  depth: SpatialDepth;
  direction: SpatialDirection;
  forceFallback: boolean;
  playToken: number;
  reduced: boolean;
  resetToken: number;
};

type WebglState = "loading" | "ready" | "fallback";

type SceneRuntime = {
  play: (direction: SpatialDirection) => void;
  reset: () => void;
  dispose: () => void;
};

export function ThreeSpatialPrototype({
  depth,
  direction,
  forceFallback,
  playToken,
  reduced,
  resetToken,
}: ThreeSpatialPrototypeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const [webglState, setWebglState] = useState<WebglState>(
    forceFallback ? "fallback" : "loading",
  );

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount || forceFallback) {
      return;
    }

    let cancelled = false;
    let runtime: SceneRuntime | null = null;

    async function createScene() {
      try {
        const THREE = await import("three");

        if (cancelled || !mount) {
          return;
        }

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.setAttribute("data-spatial-canvas", "");
        mount.replaceChildren(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
        const progress = { value: reduced ? 0.38 : 0 };
        const disposableGeometries: Three.BufferGeometry[] = [];
        const disposableMaterials: Three.Material[] = [];
        const accent = new THREE.Color(0x69d3e7);
        const warm = new THREE.Color(0xf4f0e8);
        const graphite = new THREE.Color(0x171b1e);
        const strength = depth === "strong" ? 1 : 0.68;
        let tween: gsap.core.Tween | null = null;
        let visible = !document.hidden;

        const screen = new THREE.Group();
        const screenGeometry = new THREE.PlaneGeometry(6.2, 3.7);
        const screenMaterial = new THREE.MeshBasicMaterial({
          color: graphite,
          opacity: 0.96,
          side: THREE.DoubleSide,
          transparent: true,
        });
        const screenPlane = new THREE.Mesh(screenGeometry, screenMaterial);
        const screenEdgesGeometry = new THREE.EdgesGeometry(screenGeometry);
        const screenEdgesMaterial = new THREE.LineBasicMaterial({
          color: warm,
          opacity: 0.42,
          transparent: true,
        });
        const screenEdges = new THREE.LineSegments(
          screenEdgesGeometry,
          screenEdgesMaterial,
        );
        const gridPoints: Three.Vector3[] = [];
        for (let x = -2.4; x <= 2.4; x += 0.8) {
          gridPoints.push(
            new THREE.Vector3(x, -1.45, 0.01),
            new THREE.Vector3(x, 1.45, 0.01),
          );
        }
        for (let y = -1.2; y <= 1.2; y += 0.6) {
          gridPoints.push(
            new THREE.Vector3(-2.75, y, 0.01),
            new THREE.Vector3(2.75, y, 0.01),
          );
        }
        const gridGeometry = new THREE.BufferGeometry().setFromPoints(
          gridPoints,
        );
        const gridMaterial = new THREE.LineBasicMaterial({
          color: accent,
          opacity: 0.24,
          transparent: true,
        });
        const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        screen.add(screenPlane, grid, screenEdges);
        scene.add(screen);
        disposableGeometries.push(
          screenGeometry,
          screenEdgesGeometry,
          gridGeometry,
        );
        disposableMaterials.push(
          screenMaterial,
          screenEdgesMaterial,
          gridMaterial,
        );

        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, -0.6),
          new THREE.Vector3(-1.4, 0.75, -3),
          new THREE.Vector3(1.25, -0.6, -5.7),
          new THREE.Vector3(-0.85, 0.25, -8.5),
          new THREE.Vector3(0.25, 0, -12),
        ]);
        const railGeometry = new THREE.TubeGeometry(curve, 72, 0.035, 8, false);
        const railMaterial = new THREE.MeshBasicMaterial({
          color: accent,
          opacity: 0.9,
          transparent: true,
        });
        const rail = new THREE.Mesh(railGeometry, railMaterial);
        scene.add(rail);
        disposableGeometries.push(railGeometry);
        disposableMaterials.push(railMaterial);

        const nodeGeometry = new THREE.SphereGeometry(0.055, 12, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: warm });
        for (const point of [0.2, 0.47, 0.73, 0.94]) {
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          node.position.copy(curve.getPoint(point));
          scene.add(node);
        }
        disposableGeometries.push(nodeGeometry);
        disposableMaterials.push(nodeMaterial);

        const updateComposition = () => {
          const value = progress.value;
          const eased = value * value * (3 - 2 * value);
          const cameraTravel = depth === "strong" ? 5 : 4.4;
          camera.position.set(
            eased * 2.3 * strength,
            0.18 + eased * 0.72 * strength,
            8 - eased * cameraTravel,
          );
          camera.lookAt(
            0,
            0,
            -0.25 - eased * (5.4 * strength),
          );
          screen.scale.setScalar(1 + eased * 0.08 * strength);
          screenMaterial.opacity = 0.92 - eased * 0.78;
          screenEdgesMaterial.opacity = 0.42 - eased * 0.32;
          railMaterial.opacity = 0.42 + eased * 0.5;
          rail.rotation.z = Math.sin(eased * Math.PI) * 0.035 * strength;

          if (visible) {
            renderer.render(scene, camera);
          }
        };

        const resize = () => {
          const { width, height } = mount.getBoundingClientRect();
          const safeWidth = Math.max(1, width);
          const safeHeight = Math.max(1, height);
          renderer.setSize(safeWidth, safeHeight, false);
          camera.aspect = safeWidth / safeHeight;
          camera.updateProjectionMatrix();
          updateComposition();
        };

        const resizeObserver = new ResizeObserver(resize);
        const handleVisibility = () => {
          visible = !document.hidden;
          if (visible) {
            updateComposition();
          }
        };
        const handleContextLost = (event: Event) => {
          event.preventDefault();
          tween?.kill();
          setWebglState("fallback");
        };

        resizeObserver.observe(mount);
        document.addEventListener("visibilitychange", handleVisibility);
        renderer.domElement.addEventListener(
          "webglcontextlost",
          handleContextLost,
        );
        resize();

        runtime = {
          play(nextDirection) {
            if (reduced) {
              return;
            }

            tween?.kill();
            tween = gsap.to(progress, {
              value: nextDirection === "forward" ? 1 : 0,
              duration: depth === "strong" ? 1.65 : 1.35,
              ease: "power2.inOut",
              onUpdate: updateComposition,
            });
          },
          reset() {
            tween?.kill();
            progress.value = reduced ? 0.38 : 0;
            updateComposition();
          },
          dispose() {
            tween?.kill();
            resizeObserver.disconnect();
            document.removeEventListener("visibilitychange", handleVisibility);
            renderer.domElement.removeEventListener(
              "webglcontextlost",
              handleContextLost,
            );
            disposableGeometries.forEach((geometry) => geometry.dispose());
            disposableMaterials.forEach((material) => material.dispose());
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
          },
        };
        runtimeRef.current = runtime;
        setWebglState("ready");
      } catch {
        if (!cancelled) {
          setWebglState("fallback");
        }
      }
    }

    void createScene();

    return () => {
      cancelled = true;
      runtime?.dispose();
      runtimeRef.current = null;
    };
  }, [depth, forceFallback, reduced]);

  useEffect(() => {
    if (playToken > 0) {
      runtimeRef.current?.play(direction);
    }
  }, [direction, playToken]);

  useEffect(() => {
    runtimeRef.current?.reset();
  }, [resetToken]);

  const fallback = forceFallback || webglState === "fallback";

  return (
    <section
      className={styles.prototype}
      data-spatial-prototype="three"
      data-spatial-reduced={reduced}
      data-webgl-state={fallback ? "fallback" : webglState}
      aria-labelledby="three-prototype-title"
    >
      <div className={`${styles.scene} ${styles.threeScene}`}>
        <div ref={mountRef} className={styles.webglMount} aria-hidden="true" />
        {webglState === "loading" && !forceFallback && (
          <p className={styles.prototypeLoading} role="status">
            Preparing the contained WebGL scene…
          </p>
        )}
        {fallback && (
          <div className={styles.webglFallback} data-webgl-fallback="">
            <span aria-hidden="true" />
            <strong>Spatial preview unavailable</strong>
            <p>
              The experiment falls back to a static screen-and-path
              composition. The comparison notes remain available.
            </p>
          </div>
        )}
        {reduced && webglState === "ready" && (
          <p className={styles.staticState}>Static spatial state</p>
        )}
      </div>
      <div className={styles.prototypeNotes}>
        <p className={styles.prototypeLabel}>C / THREE.JS</p>
        <h2 id="three-prototype-title">Real depth, deliberately contained.</h2>
        <p>
          One screen plane, one Helix curve, and one controlled camera move test
          whether true depth materially improves the threshold. Portfolio
          content remains semantic HTML outside canvas.
        </p>
        {reduced && (
          <p className={styles.reducedNote}>
            Reduced-motion interpretation: a single static frame shows the
            spatial relationship without camera travel.
          </p>
        )}
      </div>
    </section>
  );
}
