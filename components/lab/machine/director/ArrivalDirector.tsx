"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MachineErrorBoundary } from "@/components/lab/machine/MachineErrorBoundary";
import { MachineFallback } from "@/components/lab/machine/MachineFallback";
import type {
  DirectorGuideState,
  MachineModelMetrics,
} from "@/components/lab/machine/MachineCanvas";
import {
  cloneDirectorPose,
  directorControlRanges,
  directorStorageKey,
  directorViewportPresets,
  initialDirectorPoses,
  normalizeDirectorPose,
  parseDirectorPoseImport,
  serializeDirectorPoses,
  type DirectorPose,
  type DirectorVector3,
  type DirectorViewportId,
} from "@/lib/machine-lab/director";
import styles from "@/styles/lab/ArrivalDirector.module.css";

const DirectorMachineCanvas = dynamic(
  () =>
    import("@/components/lab/machine/director/DirectorMachineCanvas").then(
      (module) => module.DirectorMachineCanvas,
    ),
  { ssr: false },
);

type RuntimeState = "fallback" | "loading" | "ready";

type NumberControlProps = {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
};

const emptyGuides: DirectorGuideState = {
  cameraTarget: false,
  projectedScreenBounds: false,
  safeTextRegion: false,
  screenCenter: false,
};

function supportsWebgl() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  const loseContext = context?.getExtension("WEBGL_lose_context");
  loseContext?.loseContext();
  return context !== null;
}

function NumberControl({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: NumberControlProps) {
  const id = `director-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <label className={styles.numberControl} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <input
        aria-label={`${label} numeric value`}
        max={max}
        min={min}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (Number.isFinite(nextValue)) onChange(nextValue);
        }}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}

function ControlGroup({ children, title }: { children: ReactNode; title: string }) {
  return (
    <fieldset className={styles.controlGroup}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

function ViewportGuides({ guides }: { guides: DirectorGuideState & { thirds: boolean; viewportCenter: boolean } }) {
  return (
    <div className={styles.viewportGuides} aria-hidden="true">
      {guides.thirds ? (
        <div className={styles.thirdsGrid} data-director-guide="thirds-grid" />
      ) : null}
      {guides.viewportCenter ? (
        <span className={styles.viewportCenter} data-director-guide="viewport-center" />
      ) : null}
    </div>
  );
}

function PosePreview({
  guides,
  label,
  onError,
  onReady,
  pose,
  runtimeState,
}: {
  guides: DirectorGuideState & { thirds: boolean; viewportCenter: boolean };
  label: string;
  onError: () => void;
  onReady: (metrics: MachineModelMetrics) => void;
  pose: DirectorPose;
  runtimeState: RuntimeState;
}) {
  return (
    <section className={styles.preview} aria-label={`${label} pose preview`}>
      <p className={styles.previewLabel}>{label}</p>
      {runtimeState === "loading" ? (
        <p className={styles.loading} role="status">Loading machine model…</p>
      ) : null}
      {runtimeState === "fallback" ? (
        <MachineFallback />
      ) : (
        <MachineErrorBoundary onError={onError}>
          <DirectorMachineCanvas
            guides={guides}
            onReady={onReady}
            pose={pose}
          />
        </MachineErrorBoundary>
      )}
      <ViewportGuides guides={guides} />
    </section>
  );
}

function uniqueImportedPoses(imported: DirectorPose[], existing: DirectorPose[]) {
  const existingIds = new Set(existing.map((pose) => pose.id));
  return imported.map((pose, index) => {
    let id = pose.id;
    let suffix = 1;
    while (existingIds.has(id)) {
      id = `${pose.id}-import-${suffix}`;
      suffix += 1;
    }
    existingIds.add(id);
    return { ...cloneDirectorPose(pose), id, name: pose.name || `Imported ${index + 1}` };
  });
}

export function ArrivalDirector() {
  const [poses, setPoses] = useState<DirectorPose[]>(() =>
    initialDirectorPoses.map(cloneDirectorPose),
  );
  const [selectedId, setSelectedId] = useState(initialDirectorPoses[0].id);
  const [workingPose, setWorkingPose] = useState<DirectorPose>(() =>
    cloneDirectorPose(initialDirectorPoses[0]),
  );
  const [runtimeState, setRuntimeState] = useState<RuntimeState>("loading");
  const [metrics, setMetrics] = useState<MachineModelMetrics | null>(null);
  const [viewportId, setViewportId] = useState<DirectorViewportId>("1440x1000");
  const [guides, setGuides] = useState({
    ...emptyGuides,
    thirds: false,
    viewportCenter: false,
  });
  const [renameValue, setRenameValue] = useState(initialDirectorPoses[0].name);
  const [importValue, setImportValue] = useState("");
  const [status, setStatus] = useState("No unsaved changes.");
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareAId, setCompareAId] = useState(initialDirectorPoses[0].id);
  const [compareBId, setCompareBId] = useState(initialDirectorPoses[1].id);
  const [systemReduced, setSystemReduced] = useState(false);
  const viewport = directorViewportPresets.find((preset) => preset.id === viewportId)!;
  const selectedPose = poses.find((pose) => pose.id === selectedId) ?? poses[0];
  const compareA = poses.find((pose) => pose.id === compareAId) ?? poses[0];
  const compareB = poses.find((pose) => pose.id === compareBId) ?? poses[1] ?? poses[0];

  const persist = useCallback((nextPoses: DirectorPose[]) => {
    window.localStorage.setItem(directorStorageKey, serializeDirectorPoses(nextPoses));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setSystemReduced(media.matches);
    updateReduced();
    media.addEventListener("change", updateReduced);

    const forceFallback = new URLSearchParams(window.location.search).get("webgl") === "off";
    if (forceFallback || !supportsWebgl()) {
      window.requestAnimationFrame(() => setRuntimeState("fallback"));
    }

    const stored = window.localStorage.getItem(directorStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { poses?: unknown };
        if (Array.isArray(parsed.poses) && parsed.poses.length > 0) {
          const normalized = parsed.poses.map(normalizeDirectorPose);
          if (normalized.some((pose) => pose === null)) {
            throw new Error("Stored pose data is invalid.");
          }
          const restored = normalized as DirectorPose[];
          window.requestAnimationFrame(() => {
            setPoses(restored);
            setSelectedId(restored[0].id);
            setWorkingPose(cloneDirectorPose(restored[0]));
            setRenameValue(restored[0].name);
            setCompareAId(restored[0].id);
            setCompareBId(restored[1]?.id ?? restored[0].id);
            setStatus("Restored locally saved poses.");
          });
        }
      } catch {
        window.requestAnimationFrame(() =>
          setStatus("Stored pose data was invalid; neutral slots were restored."),
        );
      }
    }

    return () => media.removeEventListener("change", updateReduced);
  }, []);

  const updateWorkingPose = useCallback((updater: (pose: DirectorPose) => DirectorPose) => {
    setWorkingPose((current) => updater(cloneDirectorPose(current)));
    setStatus("Unsaved changes.");
  }, []);

  function selectPose(id: string) {
    const pose = poses.find((entry) => entry.id === id);
    if (!pose) return;
    setSelectedId(id);
    setWorkingPose(cloneDirectorPose(pose));
    setRenameValue(pose.name);
    setCompareEnabled(false);
    setStatus("Loaded saved pose.");
  }

  function setVectorValue(
    key: "cameraPosition" | "cameraTarget" | "machinePosition",
    axis: keyof DirectorVector3,
    value: number,
  ) {
    updateWorkingPose((pose) => ({
      ...pose,
      [key]: { ...pose[key], [axis]: value },
    }));
  }

  function savePose() {
    const nextPoses = poses.map((pose) =>
      pose.id === selectedId ? cloneDirectorPose(workingPose) : pose,
    );
    setPoses(nextPoses);
    persist(nextPoses);
    setStatus("Pose saved locally.");
  }

  function resetPose() {
    if (!selectedPose) return;
    setWorkingPose(cloneDirectorPose(selectedPose));
    setRenameValue(selectedPose.name);
    setStatus("Unsaved changes reset.");
  }

  function duplicatePose() {
    const id = `pose-${Date.now()}`;
    const duplicate = {
      ...cloneDirectorPose(workingPose),
      id,
      name: `${workingPose.name} copy`,
    };
    const nextPoses = [...poses, duplicate];
    setPoses(nextPoses);
    setSelectedId(id);
    setWorkingPose(cloneDirectorPose(duplicate));
    setRenameValue(duplicate.name);
    persist(nextPoses);
    setStatus("Pose duplicated and saved locally.");
  }

  function renamePose() {
    const nextName = renameValue.trim();
    if (!nextName) {
      setStatus("A pose name cannot be empty.");
      return;
    }
    const renamedWorking = { ...workingPose, name: nextName };
    const nextPoses = poses.map((pose) =>
      pose.id === selectedId ? cloneDirectorPose(renamedWorking) : pose,
    );
    setWorkingPose(renamedWorking);
    setPoses(nextPoses);
    persist(nextPoses);
    setStatus("Pose renamed and saved locally.");
  }

  function deletePose() {
    if (poses.length <= 1) {
      setStatus("At least one saved pose must remain.");
      return;
    }
    const nextPoses = poses.filter((pose) => pose.id !== selectedId);
    const nextSelected = nextPoses[0];
    setPoses(nextPoses);
    setSelectedId(nextSelected.id);
    setWorkingPose(cloneDirectorPose(nextSelected));
    setRenameValue(nextSelected.name);
    setCompareAId(nextSelected.id);
    setCompareBId(nextPoses[1]?.id ?? nextSelected.id);
    setCompareEnabled(false);
    persist(nextPoses);
    setStatus("Pose deleted locally.");
  }

  async function copyJson(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(message);
    } catch {
      setStatus("Clipboard access was unavailable. Use the import/export field instead.");
      setImportValue(value);
    }
  }

  function importPoses() {
    try {
      const imported = uniqueImportedPoses(parseDirectorPoseImport(importValue), poses);
      const nextPoses = [...poses, ...imported];
      setPoses(nextPoses);
      setSelectedId(imported[0].id);
      setWorkingPose(cloneDirectorPose(imported[0]));
      setRenameValue(imported[0].name);
      setCompareAId(imported[0].id);
      setCompareBId(imported[1]?.id ?? poses[0].id);
      setImportValue("");
      persist(nextPoses);
      setStatus(`${imported.length} pose${imported.length === 1 ? "" : "s"} imported locally.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The pose import is invalid.");
    }
  }

  const onReady = useCallback((nextMetrics: MachineModelMetrics) => {
    setMetrics(nextMetrics);
    setRuntimeState("ready");
  }, []);

  const editorControls = useMemo(() => ({
    cameraPosition: directorControlRanges.cameraPosition,
    cameraTarget: directorControlRanges.cameraTarget,
    machinePosition: directorControlRanges.machinePosition,
  }), []);

  return (
    <div
      className={styles.director}
      data-arrival-director=""
      data-director-reduced={systemReduced}
      data-director-runtime={runtimeState}
      data-director-selected={selectedId}
      data-director-viewport={viewportId}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ISOLATED TOOL / PR 32</p>
          <h1>Arrival Director</h1>
          <p className={styles.introduction}>
            Define, compare, and export machine poses without changing the
            production Arrival sequence. Every value moves only when you edit it.
          </p>
        </div>
        {/* The lab intentionally avoids production-route prefetching. */}
        <a className={styles.backLink} href="/lab/machine">Return to Machine Lab</a>
      </header>

      <aside className={styles.boundary} aria-label="Director boundary">
        <strong>Local authoring only.</strong>
        <span>Saved poses stay in this browser and do not alter production code.</span>
      </aside>

      <main className={styles.workspace}>
        <section className={styles.viewer} aria-label="Pose viewer">
          <div className={styles.viewerToolbar}>
            <label>
              <span>Viewport preset</span>
              <select value={viewportId} onChange={(event) => setViewportId(event.target.value as DirectorViewportId)}>
                {directorViewportPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>{preset.label}</option>
                ))}
              </select>
            </label>
            <p>{metrics ? `${metrics.objectCount} objects / ${metrics.triangleCount.toLocaleString()} triangles` : "Awaiting model"}</p>
          </div>
          <div
            className={styles.viewportShell}
            style={{ aspectRatio: `${viewport.width} / ${viewport.height}` }}
          >
            {compareEnabled ? (
              <div className={styles.comparison} data-director-comparison="">
                <PosePreview guides={guides} label={compareA.name} onError={() => setRuntimeState("fallback")} onReady={onReady} pose={compareA} runtimeState={runtimeState} />
                <PosePreview guides={guides} label={compareB.name} onError={() => setRuntimeState("fallback")} onReady={onReady} pose={compareB} runtimeState={runtimeState} />
              </div>
            ) : (
              <PosePreview guides={guides} label={workingPose.name} onError={() => setRuntimeState("fallback")} onReady={onReady} pose={workingPose} runtimeState={runtimeState} />
            )}
          </div>
        </section>

        <aside className={styles.editor} aria-label="Pose editor">
          <section className={styles.poseLibrary} aria-labelledby="pose-library-title">
            <h2 id="pose-library-title">Saved poses</h2>
            <label>
              <span>Active pose</span>
              <select value={selectedId} onChange={(event) => selectPose(event.target.value)}>
                {poses.map((pose) => <option key={pose.id} value={pose.id}>{pose.name}</option>)}
              </select>
            </label>
            <div className={styles.actions}>
              <button type="button" onClick={resetPose}>Reset</button>
              <button type="button" onClick={duplicatePose}>Duplicate pose</button>
              <button className={styles.primaryAction} type="button" onClick={savePose}>Save pose locally</button>
            </div>
            <div className={styles.renameRow}>
              <label htmlFor="director-pose-name">Pose name</label>
              <input id="director-pose-name" value={renameValue} onChange={(event) => setRenameValue(event.target.value)} />
              <button type="button" onClick={renamePose}>Rename pose</button>
            </div>
            <button className={styles.dangerAction} disabled={poses.length <= 1} type="button" onClick={deletePose}>Delete pose</button>
          </section>

          <form className={styles.controls} onSubmit={(event) => event.preventDefault()}>
            <ControlGroup title="Camera position">
              {(["x", "y", "z"] as const).map((axis) => <NumberControl key={axis} label={`Camera position ${axis.toUpperCase()}`} {...editorControls.cameraPosition} value={workingPose.cameraPosition[axis]} onChange={(value) => setVectorValue("cameraPosition", axis, value)} />)}
            </ControlGroup>
            <ControlGroup title="Camera target">
              {(["x", "y", "z"] as const).map((axis) => <NumberControl key={axis} label={`Camera target ${axis.toUpperCase()}`} {...editorControls.cameraTarget} value={workingPose.cameraTarget[axis]} onChange={(value) => setVectorValue("cameraTarget", axis, value)} />)}
              <NumberControl label="Camera FOV" {...directorControlRanges.fov} value={workingPose.fov} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, fov: value }))} />
            </ControlGroup>
            <ControlGroup title="Machine">
              {(["x", "y", "z"] as const).map((axis) => <NumberControl key={axis} label={`Machine position ${axis.toUpperCase()}`} {...editorControls.machinePosition} value={workingPose.machinePosition[axis]} onChange={(value) => setVectorValue("machinePosition", axis, value)} />)}
              <NumberControl label="Machine scale" {...directorControlRanges.machineScale} value={workingPose.machineScale} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, machineScale: value }))} />
              <NumberControl label="Lid angle" {...directorControlRanges.lidAngle} value={workingPose.lidAngle} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, lidAngle: value }))} />
              <NumberControl label="Screen luminance" {...directorControlRanges.screenLuminance} value={workingPose.screenLuminance} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, screenLuminance: value }))} />
            </ControlGroup>
            <ControlGroup title="Semantic identity">
              {(["x", "y"] as const).map((axis) => <NumberControl key={axis} label={`Identity ${axis.toUpperCase()} offset`} {...directorControlRanges.identityOffset} value={workingPose.identityOffset[axis]} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, identityOffset: { ...pose.identityOffset, [axis]: value } }))} />)}
              <NumberControl label="Identity scale" {...directorControlRanges.identityScale} value={workingPose.identityScale} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, identityScale: value }))} />
              <NumberControl label="Identity opacity" {...directorControlRanges.identityOpacity} value={workingPose.identityOpacity} onChange={(value) => updateWorkingPose((pose) => ({ ...pose, identityOpacity: value }))} />
            </ControlGroup>
          </form>

          <section className={styles.utilitySection} aria-labelledby="guides-title">
            <h2 id="guides-title">Visual guides</h2>
            <div className={styles.checkList}>
              {([
                ["viewportCenter", "Viewport center"],
                ["thirds", "Thirds grid"],
                ["projectedScreenBounds", "Projected screen bounds"],
                ["screenCenter", "Screen center"],
                ["cameraTarget", "Camera target"],
                ["safeTextRegion", "Safe text region"],
              ] as const).map(([key, label]) => (
                <label key={key}>
                  <input checked={guides[key]} onChange={(event) => setGuides((current) => ({ ...current, [key]: event.target.checked }))} type="checkbox" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.utilitySection} aria-labelledby="compare-title">
            <h2 id="compare-title">Compare saved poses</h2>
            <div className={styles.compareSelectors}>
              <label><span>Pose A</span><select value={compareAId} onChange={(event) => setCompareAId(event.target.value)}>{poses.map((pose) => <option key={pose.id} value={pose.id}>{pose.name}</option>)}</select></label>
              <label><span>Pose B</span><select value={compareBId} onChange={(event) => setCompareBId(event.target.value)}>{poses.map((pose) => <option key={pose.id} value={pose.id}>{pose.name}</option>)}</select></label>
            </div>
            <button type="button" onClick={() => setCompareEnabled((current) => !current)}>{compareEnabled ? "Return to editor preview" : "Compare two saved poses"}</button>
          </section>

          <section className={styles.utilitySection} aria-labelledby="transfer-title">
            <h2 id="transfer-title">Import and export</h2>
            <div className={styles.actions}>
              <button type="button" onClick={() => copyJson(JSON.stringify(workingPose, null, 2), "Current pose copied as JSON.")}>Copy current pose as JSON</button>
              <button type="button" onClick={() => copyJson(serializeDirectorPoses(poses), "All poses copied as JSON.")}>Copy all poses as JSON</button>
            </div>
            <label className={styles.importField} htmlFor="director-import">
              <span>Pose JSON</span>
              <textarea id="director-import" value={importValue} onChange={(event) => setImportValue(event.target.value)} rows={7} />
            </label>
            <button type="button" onClick={importPoses}>Import pose JSON</button>
          </section>

          <p className={styles.status} role="status">{status}</p>
        </aside>
      </main>
    </div>
  );
}
