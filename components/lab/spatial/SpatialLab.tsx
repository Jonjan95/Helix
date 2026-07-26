"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BaselinePrototype } from "@/components/lab/spatial/BaselinePrototype";
import { CssSpatialPrototype } from "@/components/lab/spatial/CssSpatialPrototype";
import { SvgSpatialPrototype } from "@/components/lab/spatial/SvgSpatialPrototype";
import {
  spatialPrototypes,
  type SpatialDepth,
  type SpatialDirection,
  type SpatialPrototypeId,
} from "@/lib/spatial/prototype-data";
import styles from "@/styles/lab/SpatialLab.module.css";

const ThreeSpatialPrototype = dynamic(
  () =>
    import("@/components/lab/spatial/ThreeSpatialPrototype").then(
      (module) => module.ThreeSpatialPrototype,
    ),
  {
    loading: () => (
      <div className={styles.prototypeLoading}>Loading isolated WebGL scene…</div>
    ),
    ssr: false,
  },
);

export function SpatialLab() {
  const [mode, setMode] = useState<SpatialPrototypeId>("baseline");
  const [depth, setDepth] = useState<SpatialDepth>("subtle");
  const [simulateReduced, setSimulateReduced] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const [direction, setDirection] = useState<SpatialDirection>("forward");
  const [playToken, setPlayToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [forceWebglFallback, setForceWebglFallback] = useState(false);
  const reduced = simulateReduced || systemReduced;
  const current = useMemo(
    () => spatialPrototypes.find((prototype) => prototype.id === mode)!,
    [mode],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    queueMicrotask(() => {
      update();
      setForceWebglFallback(
        new URLSearchParams(window.location.search).get("webgl") === "off",
      );
    });
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  function run(nextDirection: SpatialDirection) {
    setDirection(nextDirection);
    setPlayToken((token) => token + 1);
  }

  function reset() {
    setDirection("forward");
    setResetToken((token) => token + 1);
  }

  return (
    <div
      className={styles.lab}
      data-spatial-lab=""
      data-spatial-mode={mode}
      data-spatial-reduced={reduced}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>EXPERIMENT / PR 19</p>
          <h1>Spatial design exploration</h1>
          <p className={styles.introduction}>
            Can spatial depth make the transition from laptop to Helix journey
            feel more intentional and memorable?
          </p>
        </div>
        <Link className={styles.backLink} href="/">
          Return to production portfolio
        </Link>
      </header>

      <aside className={styles.boundary} aria-label="Experiment boundary">
        <strong>Isolated lab.</strong>
        <span>
          Nothing selected here changes the production homepage or its journey
          motion.
        </span>
      </aside>

      <form className={styles.controls} aria-label="Spatial prototype controls">
        <fieldset>
          <legend>Compare direction</legend>
          <div className={styles.segmented}>
            {spatialPrototypes.map((prototype) => (
              <label key={prototype.id}>
                <input
                  type="radio"
                  name="prototype"
                  value={prototype.id}
                  checked={mode === prototype.id}
                  onChange={() => {
                    setMode(prototype.id);
                    reset();
                  }}
                />
                <span>
                  <small>{prototype.index}</small>
                  {prototype.shortLabel}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Depth level</legend>
          <div className={styles.inlineOptions}>
            {(["subtle", "strong"] as const).map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="depth"
                  value={option}
                  checked={depth === option}
                  onChange={() => setDepth(option)}
                  disabled={mode === "baseline"}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={styles.checkControl}>
          <input
            type="checkbox"
            checked={simulateReduced}
            onChange={(event) => setSimulateReduced(event.target.checked)}
          />
          <span>Simulate reduced motion</span>
        </label>

        <div className={styles.transport} aria-label="Prototype playback">
          <button
            type="button"
            onClick={() => run("forward")}
            disabled={mode === "baseline" || reduced}
          >
            Play forward
          </button>
          <button
            type="button"
            onClick={() => run("reverse")}
            disabled={mode === "baseline" || reduced}
          >
            Reverse
          </button>
          <button type="button" onClick={reset} disabled={mode === "baseline"}>
            Reset
          </button>
        </div>
      </form>

      <main className={styles.stage} key={`${mode}-${resetToken}`}>
        {mode === "baseline" && <BaselinePrototype />}
        {mode === "css" && (
          <CssSpatialPrototype
            depth={depth}
            direction={direction}
            playToken={playToken}
            reduced={reduced}
            resetToken={resetToken}
          />
        )}
        {mode === "svg" && (
          <SvgSpatialPrototype depth={depth} reduced={reduced} />
        )}
        {mode === "three" && (
          <ThreeSpatialPrototype
            depth={depth}
            direction={direction}
            forceFallback={forceWebglFallback}
            playToken={playToken}
            reduced={reduced}
            resetToken={resetToken}
          />
        )}
      </main>

      <section className={styles.notes} aria-labelledby="implementation-notes">
        <div>
          <p className={styles.prototypeLabel}>
            {current.index} / {current.label}
          </p>
          <h2 id="implementation-notes">What this direction tests</h2>
        </div>
        <div>
          <p>{current.summary}</p>
          <p className={styles.implementation}>{current.implementation}</p>
        </div>
      </section>
    </div>
  );
}
