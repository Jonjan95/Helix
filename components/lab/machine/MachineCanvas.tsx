"use client";

import { createPortal, Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from "three";
import {
  machineModelPath,
  machineSequence,
  stageProgress,
} from "@/lib/machine-lab/sequence";
import styles from "@/styles/lab/MachineLab.module.css";

export type MachineModelMetrics = {
  objectCount: number;
  triangleCount: number;
};

type MachineCanvasProps = {
  onReady: (metrics: MachineModelMetrics) => void;
  progress: number;
};

type MachineSceneProps = MachineCanvasProps;

type ModelRuntime = {
  base: Object3D;
  graphiteMaterials: MeshStandardMaterial[];
  hinge: Group;
  lid: Object3D;
  objectCount: number;
  root: Group;
  triangleCount: number;
};

const accent = new Color("#69d3e7");
const screenOff = new Color("#0b1012");
const screenOn = new Color("#10252a");
const cameraStart = new Vector3(4.6, 2.8, 6.4);
const cameraEnd = new Vector3(0, 0.82, 1.08);
const lookStart = new Vector3(0, 0.55, 0.3);
const lookEnd = new Vector3(0, 0.72, -0.56);
const machineScale = 0.115;
const closedLidAngle = Math.PI * 0.48;
const hingeOffsetY = 0.195;

function createModelRuntime(source: Group): ModelRuntime {
  const root = source.clone(true);
  const base = root.getObjectByName("Frame");
  const lid = root.getObjectByName("Screen");

  if (!base || !lid || !lid.parent) {
    throw new Error("The supplied GLB does not expose Frame and Screen nodes.");
  }

  const graphiteMaterials: MeshStandardMaterial[] = [];
  let objectCount = 0;
  let triangleCount = 0;

  root.traverse((object) => {
    objectCount += 1;

    if (!(object instanceof Mesh)) {
      return;
    }

    const position = object.geometry.getAttribute("position");
    triangleCount += object.geometry.index
      ? object.geometry.index.count / 3
      : position.count / 3;

    const isLid = lid.getObjectById(object.id) !== undefined || object === lid;
    const material = new MeshStandardMaterial({
      color: isLid ? "#20262a" : "#242a2e",
      metalness: 0.18,
      roughness: isLid ? 0.64 : 0.7,
    });
    material.name = isLid ? "MachineLidGraphite" : "MachineBaseGraphite";
    object.material = material;
    object.castShadow = false;
    object.receiveShadow = false;
    graphiteMaterials.push(material);
  });

  const parent = lid.parent;
  const originalPosition = lid.position.clone();
  const originalQuaternion = lid.quaternion.clone();
  const originalScale = lid.scale.clone();
  const hinge = new Group();
  hinge.name = "RuntimeHingePivot";
  hinge.position.set(
    originalPosition.x,
    originalPosition.y - hingeOffsetY,
    originalPosition.z,
  );

  parent.remove(lid);
  parent.add(hinge);
  hinge.add(lid);
  lid.position.set(0, hingeOffsetY, 0);
  lid.quaternion.copy(originalQuaternion);
  lid.scale.copy(originalScale);

  return {
    base,
    graphiteMaterials,
    hinge,
    lid,
    objectCount: objectCount + 1,
    root,
    triangleCount,
  };
}

function MachineScene({ onReady, progress }: MachineSceneProps) {
  const gltf = useGLTF(machineModelPath);
  const runtime = useMemo(
    () => createModelRuntime(gltf.scene as Group),
    [gltf.scene],
  );
  const hingeRef = useRef(runtime.hinge);
  const screenMaterialRef = useRef<MeshStandardMaterial>(null);
  const shadowMaterialRef = useRef<MeshStandardMaterial>(null);
  const shadowRef = useRef<Mesh>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    onReady({
      objectCount: runtime.objectCount,
      triangleCount: runtime.triangleCount,
    });
  }, [onReady, runtime.objectCount, runtime.triangleCount]);

  useEffect(() => {
    const opening = stageProgress(progress, machineSequence.opening);
    const screenPower = stageProgress(progress, machineSequence.screen);
    const approach = stageProgress(progress, machineSequence.camera);
    const screenMaterial = screenMaterialRef.current;
    const shadow = shadowRef.current;
    const shadowMaterial = shadowMaterialRef.current;

    hingeRef.current.rotation.x = closedLidAngle * (1 - opening);
    hingeRef.current.updateMatrixWorld(true);

    if (screenMaterial) {
      screenMaterial.color.copy(screenOff).lerp(screenOn, screenPower);
      screenMaterial.emissive.copy(accent);
      screenMaterial.emissiveIntensity = screenPower * 0.08;
      screenMaterial.opacity = 0.72 + screenPower * 0.26;
    }

    if (shadow) {
      shadow.scale.set(0.82 + opening * 0.18, 0.78 + opening * 0.22, 1);
    }

    if (shadowMaterial) {
      shadowMaterial.opacity = 0.2 + opening * 0.14;
    }

    camera.position.copy(cameraStart).lerp(cameraEnd, approach);
    camera.lookAt(lookStart.clone().lerp(lookEnd, approach));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, progress]);

  useEffect(
    () => () => {
      runtime.graphiteMaterials.forEach((material) => material.dispose());
    },
    [runtime],
  );

  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight color="#f4f0e8" intensity={2.2} position={[4, 6, 5]} />
      <directionalLight color="#69d3e7" intensity={0.32} position={[-4, 2, -3]} />

      <group position={[0, -0.58, 0.62]} scale={machineScale}>
        <primitive object={runtime.root} dispose={null} />
        {createPortal(
          <>
            <mesh position={[0, 0.096, -0.0068]}>
              <planeGeometry args={[0.286, 0.181]} />
              <meshStandardMaterial
                ref={screenMaterialRef}
                color={screenOff}
                emissive={accent}
                emissiveIntensity={0}
                opacity={0.72}
                roughness={0.78}
                side={DoubleSide}
                transparent
              />
            </mesh>
          </>,
          runtime.lid,
        )}
      </group>

      <mesh ref={shadowRef} position={[0, -0.6, 0.36]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.9, 2.25]} />
        <meshStandardMaterial
          ref={shadowMaterialRef}
          color="#000000"
          opacity={0.2}
          roughness={1}
          transparent
        />
      </mesh>
    </>
  );
}

export function MachineCanvas({ onReady, progress }: MachineCanvasProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ far: 40, fov: 38, near: 0.1, position: [4.6, 2.8, 6.4] }}
      className={styles.canvas}
      data-machine-canvas=""
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
        gl.toneMappingExposure = 0.9;
        gl.setClearColor("#101315", 1);
      }}
    >
      <MachineScene onReady={onReady} progress={progress} />
    </Canvas>
  );
}

useGLTF.preload(machineModelPath);
