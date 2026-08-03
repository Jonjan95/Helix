"use client";

import { createPortal, Canvas, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  ACESFilmicToneMapping,
  BackSide,
  CanvasTexture,
  Color,
  FrontSide,
  Group,
  LinearFilter,
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
  type MachineIdentityCandidate,
} from "@/lib/machine-lab/sequence";
import styles from "@/styles/lab/MachineLab.module.css";

export type MachineModelMetrics = {
  objectCount: number;
  triangleCount: number;
};

type MachineCanvasProps = {
  identityCandidate: MachineIdentityCandidate;
  onReady: (metrics: MachineModelMetrics) => void;
  progress: number;
};

type MachineSceneProps = MachineCanvasProps;

type MachineSceneWithPortalProps = MachineSceneProps & {
  htmlPortal: RefObject<HTMLElement>;
};

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
const screenOn = new Color("#123038");
const cameraStart = new Vector3(4.6, 2.8, 6.4);
const cameraReframe = new Vector3(0.75, 1.2, 6);
const cameraDollyEnd = new Vector3(0.04, 0.67, 4.15);
const cameraMobileReframe = new Vector3(0.8, 1.3, 6.1);
const cameraMobileEnd = new Vector3(0.18, 0.82, 4.6);
const lookStart = new Vector3(0, 0.55, 0.3);
const screenCenter = new Vector3(0, 0.6, -0.64);
const machineScale = 0.115;
const closedLidAngle = Math.PI * 0.48;
const hingeOffsetY = 0.195;
const screenPlane = {
  bezelMargin: [0.011, 0.0125] as const,
  depthOffset: 0.0062,
  height: 0.176,
  position: [0, 0.098, -0.0062] as const,
  rotation: [0, 0, 0] as const,
  width: 0.282,
};
const screenAnchorPosition = [0, 0.098, -0.0067] as const;

function createIdentityTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The identity fallback texture could not be created.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = "left";
  context.fillStyle = "rgba(244, 240, 232, 0.62)";
  context.font = "500 24px monospace";
  context.fillText("MALMÖ, SWEDEN / PORTFOLIO", 156, 192);
  context.fillStyle = "rgba(244, 240, 232, 0.86)";
  context.font = "500 82px sans-serif";
  context.fillText("Jonathan", 150, 312);
  context.fillText("Jansson", 150, 390);
  context.fillStyle = "rgba(244, 240, 232, 0.58)";
  context.font = "500 22px monospace";
  context.fillText("SOFTWARE DEVELOPMENT / TESTING / QUALITY", 154, 472);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

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
      color: isLid ? "#1d2327" : "#242b2f",
      metalness: isLid ? 0.32 : 0.28,
      roughness: isLid ? 0.54 : 0.58,
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

function disposeImportedScene(scene: Object3D) {
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (
          value &&
          typeof value === "object" &&
          "isTexture" in value &&
          value.isTexture &&
          "dispose" in value &&
          typeof value.dispose === "function"
        ) {
          value.dispose();
        }
      });
      material.dispose();
    });
  });
}

function MachineScene({
  htmlPortal,
  identityCandidate,
  onReady,
  progress,
}: MachineSceneWithPortalProps) {
  const gltf = useGLTF(machineModelPath);
  const runtime = useMemo(
    () => createModelRuntime(gltf.scene as Group),
    [gltf.scene],
  );
  const hingeRef = useRef(runtime.hinge);
  const screenMaterialRef = useRef<MeshStandardMaterial>(null);
  const { camera, invalidate, size } = useThree();
  const identityIn = stageProgress(progress, machineSequence.identity);
  const identityOut = stageProgress(progress, machineSequence.identityExit);
  const identityVisibility = identityIn * (1 - identityOut);
  const identityTexture = useMemo(
    () =>
      identityCandidate === "texture" ? createIdentityTexture() : null,
    [identityCandidate],
  );

  useEffect(() => {
    onReady({
      objectCount: runtime.objectCount,
      triangleCount: runtime.triangleCount,
    });
  }, [onReady, runtime.objectCount, runtime.triangleCount]);

  useEffect(() => {
    const opening = stageProgress(progress, machineSequence.opening);
    const screenPower = stageProgress(progress, machineSequence.screen);
    const reframe = stageProgress(progress, machineSequence.cameraReframe);
    const dolly = stageProgress(progress, machineSequence.cameraDolly);
    const screenMaterial = screenMaterialRef.current;
    const compact = size.width < 768;
    const reframeTarget = compact ? cameraMobileReframe : cameraReframe;
    const dollyTarget = compact ? cameraMobileEnd : cameraDollyEnd;

    hingeRef.current.rotation.x = closedLidAngle * (1 - opening);
    hingeRef.current.updateMatrixWorld(true);

    if (screenMaterial) {
      screenMaterial.color.copy(screenOff).lerp(screenOn, screenPower);
      screenMaterial.emissive.copy(accent);
      screenMaterial.emissiveIntensity = screenPower * 0.11;
    }

    camera.position.copy(cameraStart).lerp(reframeTarget, reframe);
    if (dolly > 0) {
      camera.position.copy(reframeTarget).lerp(dollyTarget, dolly);
    }
    camera.lookAt(lookStart.clone().lerp(screenCenter, reframe));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, progress, size.width]);

  useEffect(
    () => () => {
      identityTexture?.dispose();
      runtime.graphiteMaterials.forEach((material) => material.dispose());
      disposeImportedScene(gltf.scene);
      useGLTF.clear(machineModelPath);
    },
    [gltf.scene, identityTexture, runtime],
  );

  return (
    <>
      <ambientLight intensity={0.36} />
      <directionalLight color="#f4f0e8" intensity={1.65} position={[4.5, 7, 5.5]} />
      <directionalLight color="#69d3e7" intensity={0.38} position={[-4, 2.5, -3]} />

      <group position={[0, -0.58, 0.62]} scale={machineScale}>
        <primitive object={runtime.root} dispose={null} />
        {createPortal(
          <>
            <mesh
              position={screenPlane.position}
              rotation={screenPlane.rotation}
            >
              <planeGeometry args={[screenPlane.width, screenPlane.height]} />
              <meshStandardMaterial
                ref={screenMaterialRef}
                color={screenOff}
                emissive={accent}
                emissiveIntensity={0}
                roughness={0.72}
                side={BackSide}
              />
            </mesh>
            <group position={screenAnchorPosition} rotation={screenPlane.rotation}>
              {identityTexture ? (
                <mesh position={[0, 0, -0.0002]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[screenPlane.width, screenPlane.height]} />
                  <meshBasicMaterial
                    alphaMap={identityTexture}
                    color="#f4f0e8"
                    map={identityTexture}
                    opacity={identityVisibility * 0.72}
                    side={FrontSide}
                    toneMapped={false}
                    transparent
                  />
                </mesh>
              ) : null}
              <Html
                center
                distanceFactor={0.282}
                portal={htmlPortal}
                rotation={[0, Math.PI, 0]}
                transform
                zIndexRange={[3, 3]}
              >
                <div
                  className={`${styles.screenIdentityFrame} ${
                    identityCandidate === "texture"
                      ? styles.semanticOnly
                      : ""
                  }`}
                  data-identity-visible={identityVisibility > 0.05}
                  data-identity-candidate={identityCandidate}
                  data-machine-identity=""
                  style={{ opacity: identityVisibility }}
                >
                  <div className={styles.screenIdentity}>
                    <span>MALMÖ, SWEDEN / PORTFOLIO</span>
                    <h2>Jonathan Jansson</h2>
                    <p>Software development / testing / quality</p>
                  </div>
                </div>
              </Html>
            </group>
          </>,
          runtime.lid,
        )}
      </group>

      <group position={[0, -0.595, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh scale={[1.78, 0.84, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial color="#000000" depthWrite={false} opacity={0.08} transparent />
        </mesh>
        <mesh position={[0, 0, -0.002]} scale={[2.02, 1.02, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial color="#000000" depthWrite={false} opacity={0.045} transparent />
        </mesh>
        <mesh position={[0, 0, -0.004]} scale={[2.28, 1.2, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial color="#000000" depthWrite={false} opacity={0.025} transparent />
        </mesh>
      </group>
    </>
  );
}

export function MachineCanvas({
  identityCandidate,
  onReady,
  progress,
}: MachineCanvasProps) {
  const htmlPortal = useRef<HTMLDivElement>(null!);

  return (
    <>
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
          gl.toneMappingExposure = 0.92;
          gl.setClearColor("#101315", 1);
        }}
        shadows
      >
        <MachineScene
          htmlPortal={htmlPortal}
          identityCandidate={identityCandidate}
          onReady={onReady}
          progress={progress}
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

useGLTF.preload(machineModelPath);
