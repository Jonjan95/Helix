"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MachineErrorBoundary } from "@/components/lab/machine/MachineErrorBoundary";
import {
  arrivalMode,
  machineHandoffEnd,
  machineSequenceEnd,
  type ArrivalMode,
} from "@/lib/arrival/arrival-mode";
import { subscribeToArrivalProgress } from "@/lib/arrival/arrival-progress";
import {
  clampProgress,
  machineSequences,
  reducedMachineProgress,
} from "@/lib/machine-lab/sequence";
import styles from "@/styles/ProductionArrivalMachine.module.css";

const MachineCanvas = dynamic(
  () =>
    import("@/components/lab/machine/MachineCanvas").then(
      (module) => module.MachineCanvas,
    ),
  { ssr: false },
);

type ProductionArrivalMachineProps = {
  children: ReactNode;
};

type ArrivalDiagnosticMode = "combined" | "css" | "current" | "webgl";
type ArrivalMachineStyle = CSSProperties & {
  "--fallback-opacity": number;
  "--machine-opacity": number;
};
type RuntimeState = "css" | "loading" | "ready";
const machineActivationDeadline = 0.04;

function supportsWebgl() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    const loseContext = context?.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

function getRequestedMode(): ArrivalMode {
  const requested = new URLSearchParams(window.location.search).get("arrival");
  return requested === "css" || requested === "machine"
    ? requested
    : arrivalMode;
}

export function ProductionArrivalMachine({
  children,
}: ProductionArrivalMachineProps) {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>("css");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [diagnosticMode, setDiagnosticMode] =
    useState<ArrivalDiagnosticMode>("current");
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);
  const progressRef = useRef(0);

  useEffect(
    () =>
      subscribeToArrivalProgress((nextProgress) => {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }),
    [],
  );

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 64.001rem)");
    const params = new URLSearchParams(window.location.search);
    const forcedOff = params.get("webgl") === "off";
    const loadFailure = params.get("machine") === "error";
    const requestedDiagnostic = params.get("arrivalDiagnostic");
    const requestedDiagnostics = params.get("arrivalDiagnostics") === "on";
    const requestedMode = getRequestedMode();
    const updateReduced = () => setReduced(motion.matches);

    const hasDiagnosticMode =
      requestedDiagnostic === "combined" ||
      requestedDiagnostic === "css" ||
      requestedDiagnostic === "webgl";
    const diagnosticFrame =
      hasDiagnosticMode || requestedDiagnostics
        ? window.requestAnimationFrame(() => {
            if (hasDiagnosticMode) {
              setDiagnosticMode(requestedDiagnostic);
            }
            setDiagnosticsEnabled(true);
          })
        : null;

    updateReduced();

    if (
      requestedMode === "css" ||
      (!desktop.matches && !motion.matches) ||
      forcedOff ||
      loadFailure ||
      !supportsWebgl()
    ) {
      window.requestAnimationFrame(() => setRuntimeState("css"));
      return () => {
        if (diagnosticFrame !== null) {
          window.cancelAnimationFrame(diagnosticFrame);
        }
      };
    }

    window.requestAnimationFrame(() => setRuntimeState("loading"));
    const idleWindow = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
    };
    const handle = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(() => setShouldLoad(true), {
          timeout: 1400,
        })
      : window.setTimeout(() => setShouldLoad(true), 240);

    motion.addEventListener("change", updateReduced);

    return () => {
      if (diagnosticFrame !== null) {
        window.cancelAnimationFrame(diagnosticFrame);
      }
      motion.removeEventListener("change", updateReduced);
      if (idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, []);

  const handleReady = useCallback(() => {
    setRuntimeState(
      reduced || progressRef.current <= machineActivationDeadline
        ? "ready"
        : "css",
    );
  }, [reduced]);
  const machineProgress = reduced
    ? reducedMachineProgress.cinematic
    : clampProgress(progress / machineSequenceEnd);
  const handoff = clampProgress(
    (progress - machineSequenceEnd) / (machineHandoffEnd - machineSequenceEnd),
  );
  const machineStyle = useMemo(() => {
    let fallbackOpacity = reduced ? 0 : handoff;
    let machineOpacity = reduced ? 1 : 1 - handoff;

    if (runtimeState !== "ready") {
      fallbackOpacity = 1;
      machineOpacity = 0;
    } else if (diagnosticMode === "css") {
      fallbackOpacity = 1;
      machineOpacity = 0;
    } else if (diagnosticMode === "webgl") {
      fallbackOpacity = 0;
      machineOpacity = 1;
    }

    return {
      "--fallback-opacity": fallbackOpacity,
      "--machine-opacity": machineOpacity,
    } as ArrivalMachineStyle;
  }, [diagnosticMode, handoff, reduced, runtimeState]);

  const activeOwner =
    runtimeState !== "ready"
      ? "css-loading"
      : diagnosticMode !== "current"
        ? diagnosticMode
        : handoff <= 0
          ? "webgl"
          : handoff >= 1
            ? "threshold"
            : "webgl-threshold";

  return (
    <div
      className={styles.root}
      data-arrival-diagnostic={diagnosticMode}
      data-arrival-diagnostics={diagnosticsEnabled}
      data-arrival-mode={runtimeState === "ready" ? "machine" : "css"}
      data-arrival-owner={activeOwner}
      data-arrival-progress={progress.toFixed(4)}
      data-arrival-runtime={runtimeState}
      data-css-opacity={machineStyle["--fallback-opacity"]}
      data-machine-progress={machineProgress.toFixed(3)}
      data-webgl-opacity={machineStyle["--machine-opacity"]}
      style={machineStyle}
    >
      <div className={styles.cssFallback} data-arrival-css-fallback="">
        {children}
      </div>
      {shouldLoad && runtimeState !== "css" ? (
        <div
          className={styles.machine}
          data-production-machine=""
        >
          <MachineErrorBoundary onError={() => setRuntimeState("css")}>
            <MachineCanvas
              diagnostics={diagnosticsEnabled}
              identitySemantic={false}
              onReady={handleReady}
              progress={machineProgress}
              sequence={machineSequences.cinematic}
            />
          </MachineErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
