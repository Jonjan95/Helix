"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MachineErrorBoundary } from "@/components/lab/machine/MachineErrorBoundary";
import { MachineFallback } from "@/components/lab/machine/MachineFallback";
import type { MachineModelMetrics } from "@/components/lab/machine/MachineCanvas";
import {
  getMachineStage,
  reducedMachineProgress,
  type MachinePlaybackDirection,
} from "@/lib/machine-lab/sequence";
import styles from "@/styles/lab/MachineLab.module.css";

const MachineCanvas = dynamic(
  () =>
    import("@/components/lab/machine/MachineCanvas").then(
      (module) => module.MachineCanvas,
    ),
  { ssr: false },
);

type RuntimeState = "fallback" | "loading" | "ready";

function supportsWebgl() {
  const canvas = document.createElement("canvas");
  const context =
    canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  const loseContext = context?.getExtension("WEBGL_lose_context");
  loseContext?.loseContext();

  return context !== null;
}

export function MachineLab() {
  const [progress, setProgress] = useState(0);
  const [runtimeState, setRuntimeState] =
    useState<RuntimeState>("loading");
  const [metrics, setMetrics] = useState<MachineModelMetrics | null>(null);
  const [simulateReduced, setSimulateReduced] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const animationRef = useRef<number | null>(null);
  const reduced = systemReduced || simulateReduced;
  const fallback = runtimeState === "fallback";
  const effectiveProgress = reduced ? reducedMachineProgress : progress;
  const stage = reduced ? "Reduced-motion preview" : getMachineStage(progress);

  const stopPlayback = useCallback(() => {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setSystemReduced(media.matches);

    updateReduced();
    const forceFallback =
      new URLSearchParams(window.location.search).get("webgl") === "off";
    if (forceFallback || !supportsWebgl()) {
      window.requestAnimationFrame(() => setRuntimeState("fallback"));
    }
    media.addEventListener("change", updateReduced);

    return () => {
      media.removeEventListener("change", updateReduced);
      stopPlayback();
    };
  }, [stopPlayback]);

  useEffect(() => {
    if (reduced || fallback) {
      stopPlayback();
    }
  }, [fallback, reduced, stopPlayback]);

  const handleReady = useCallback((nextMetrics: MachineModelMetrics) => {
    setMetrics(nextMetrics);
    setRuntimeState("ready");
  }, []);

  function play(direction: MachinePlaybackDirection) {
    if (reduced || fallback) {
      return;
    }

    stopPlayback();
    const startValue = progress;
    const target = direction === "forward" ? 1 : 0;
    const distance = Math.abs(target - startValue);

    if (distance < 0.001) {
      return;
    }

    const duration = 4200 * distance;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      setProgress(startValue + (target - startValue) * eased);

      if (elapsed < 1) {
        animationRef.current = window.requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = window.requestAnimationFrame(tick);
  }

  function reset() {
    stopPlayback();
    setProgress(0);
  }

  return (
    <div
      className={styles.lab}
      data-machine-lab=""
      data-machine-progress={effectiveProgress.toFixed(3)}
      data-machine-reduced={reduced}
      data-model-objects={metrics?.objectCount ?? ""}
      data-model-state={runtimeState}
      data-model-triangles={metrics?.triangleCount ?? ""}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>EXPERIMENT / PR 28</p>
          <h1>The Helix Machine</h1>
          <p className={styles.introduction}>
            A contained 3D study of one physical transition: closed machine,
            powered identity, then a controlled approach toward the display.
          </p>
        </div>
        {/* The lab intentionally avoids production-route prefetching. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className={styles.backLink} href="/">
          Return to production portfolio
        </a>
      </header>

      <aside className={styles.boundary} aria-label="Experiment boundary">
        <strong>Isolated experiment.</strong>
        <span>
          The prototype does not change the production homepage or its scroll
          architecture.
        </span>
      </aside>

      <main className={styles.prototype}>
        <section
          className={styles.stage}
          data-machine-stage=""
          aria-label="Machine sequence preview"
        >
          {runtimeState === "loading" ? (
            <p className={styles.loading} data-model-loading="" role="status">
              Inspecting the machine model…
            </p>
          ) : null}

          {fallback ? (
            <MachineFallback />
          ) : (
            <MachineErrorBoundary
              onError={() => setRuntimeState("fallback")}
            >
              <MachineCanvas
                onReady={handleReady}
                progress={effectiveProgress}
              />
            </MachineErrorBoundary>
          )}

          <div className={styles.stageReadout} aria-live="off">
            <span>{stage}</span>
            <output htmlFor="machine-progress">
              {effectiveProgress.toFixed(2)}
            </output>
          </div>
        </section>

        <form className={styles.controls} aria-label="Machine sequence controls">
          <label className={styles.progressControl} htmlFor="machine-progress">
            <span>Sequence progress</span>
            <input
              id="machine-progress"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effectiveProgress}
              disabled={reduced || fallback}
              onChange={(event) => {
                stopPlayback();
                setProgress(Number(event.target.value));
              }}
            />
          </label>

          <div className={styles.transport} aria-label="Sequence playback">
            <button
              type="button"
              disabled={reduced || fallback}
              onClick={() => play("forward")}
            >
              Play forward
            </button>
            <button
              type="button"
              disabled={reduced || fallback}
              onClick={() => play("reverse")}
            >
              Play reverse
            </button>
            <button type="button" disabled={fallback} onClick={reset}>
              Reset
            </button>
          </div>

          <label className={styles.reducedControl}>
            <input
              type="checkbox"
              checked={simulateReduced}
              onChange={(event) => setSimulateReduced(event.target.checked)}
            />
            <span>Reduced-motion preview</span>
          </label>
        </form>
      </main>

      <section className={styles.notes} aria-labelledby="machine-notes-title">
        <div>
          <p className={styles.noteLabel}>MODEL / RUNTIME</p>
          <h2 id="machine-notes-title">What this prototype proves</h2>
        </div>
        <div>
          <p>
            The supplied model separates its grounded frame from its display.
            A measured runtime wrapper supplies the hinge pivot without editing
            the GLB, while the identity remains accessible HTML outside WebGL.
          </p>
          <dl className={styles.metrics}>
            <div>
              <dt>Model</dt>
              <dd>helix-machine.glb · 404,020 bytes</dd>
            </div>
            <div>
              <dt>Scene</dt>
              <dd>
                {metrics
                  ? `${metrics.objectCount} objects · ${metrics.triangleCount.toLocaleString()} triangles`
                  : "Awaiting model inspection"}
              </dd>
            </div>
            <div>
              <dt>Renderer</dt>
              <dd>Demand-driven · DPR capped at 1.5</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
