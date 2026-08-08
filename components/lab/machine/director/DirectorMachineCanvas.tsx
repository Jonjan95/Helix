"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
} from "three";
import {
  MachineScene,
  type DirectorGuideState,
  type MachineModelMetrics,
} from "@/components/lab/machine/MachineCanvas";
import type { DirectorPose } from "@/lib/machine-lab/director";
import { machineSequences } from "@/lib/machine-lab/sequence";
import styles from "@/styles/lab/MachineLab.module.css";
import directorStyles from "@/styles/lab/ArrivalDirector.module.css";

type DirectorMachineCanvasProps = {
  guides: DirectorGuideState;
  onReady: (metrics: MachineModelMetrics) => void;
  pose: DirectorPose;
};

export function DirectorMachineCanvas({
  guides,
  onReady,
  pose,
}: DirectorMachineCanvasProps) {
  const htmlPortal = useRef<HTMLDivElement>(null!);

  return (
    <>
      <Canvas
        aria-hidden="true"
        camera={{
          far: 40,
          fov: pose.fov,
          near: 0.1,
          position: [
            pose.cameraPosition.x,
            pose.cameraPosition.y,
            pose.cameraPosition.z,
          ],
        }}
        className={styles.canvas}
        data-director-machine-canvas=""
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
          gl.setClearColor("#101315", 1);
        }}
      >
        <MachineScene
          directorGuideClassNames={{
            projectedScreenBounds: directorStyles.projectedScreenBounds,
            safeTextRegion: directorStyles.safeTextRegionGuide,
            screenCenter: directorStyles.screenCenterGuide,
          }}
          directorGuides={guides}
          directorPose={pose}
          htmlPortal={htmlPortal}
          identitySemantic
          onReady={onReady}
          progress={0}
          sequence={machineSequences.cinematic}
        />
      </Canvas>
      <div
        ref={htmlPortal}
        className={styles.htmlPortal}
        data-machine-html-layer=""
      />
    </>
  );
}
