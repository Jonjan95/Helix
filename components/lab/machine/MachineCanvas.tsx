"use client";

import { createPortal, Canvas, useThree } from "@react-three/fiber";
import { Html, Line, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  ACESFilmicToneMapping,
  BackSide,
  CubicBezierCurve3,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from "three";
import {
  machineModelPath,
  stageProgress,
  type MachineSequenceDefinition,
} from "@/lib/machine-lab/sequence";
import styles from "@/styles/lab/MachineLab.module.css";

export type MachineModelMetrics = {
  objectCount: number;
  triangleCount: number;
};

type MachineCanvasProps = {
  cameraDebug?: boolean;
  identitySemantic?: boolean;
  onReady: (metrics: MachineModelMetrics) => void;
  progress: number;
  sequence: MachineSequenceDefinition;
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
const cameraReframe = new Vector3(0.28, 0.82, 6.05);
const cameraDollyEnd = new Vector3(0.04, 0.67, 4.15);
const cameraMobileReframe = new Vector3(0.42, 0.96, 6.1);
const cameraMobileEnd = new Vector3(0.18, 0.82, 4.6);
const lookStart = new Vector3(0, 0.55, 0.3);
const screenCenter = new Vector3(0, 0.6, -0.64);
const cameraDebugPosition = new Vector3(7.4, 5.7, 9.2);
const cameraDebugTarget = new Vector3(1.4, 1.2, 4.8);
const cameraPath = {
  desktop: {
    dolly: new CubicBezierCurve3(
      cameraReframe,
      new Vector3(0.12, 0.72, 5.92),
      new Vector3(0.06, 0.68, 4.58),
      cameraDollyEnd,
    ),
    reframe: new CubicBezierCurve3(
      cameraStart,
      new Vector3(4.7, 2.82, 6.48),
      new Vector3(1.58, 1.24, 6.18),
      cameraReframe,
    ),
  },
  mobile: {
    dolly: new CubicBezierCurve3(
      cameraMobileReframe,
      new Vector3(0.31, 0.88, 5.95),
      new Vector3(0.21, 0.83, 4.88),
      cameraMobileEnd,
    ),
    reframe: new CubicBezierCurve3(
      cameraStart,
      new Vector3(4.68, 2.82, 6.47),
      new Vector3(1.7, 1.38, 6.24),
      cameraMobileReframe,
    ),
  },
} as const;
const cameraDebugPath = [
  ...cameraPath.desktop.reframe.getPoints(32),
  ...cameraPath.desktop.dolly.getPoints(24).slice(1),
];
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
const screenAnchorY = 0.098;
const screenAnchorZ = -0.0067;

function getScreenAnchorX(canvasWidth: number) {
  return Math.min(0.019, Math.max(-0.024, (canvasWidth - 961) * 0.000297));
}

function getRawStageProgress(
  value: number,
  range: { readonly end: number; readonly start: number },
) {
  return Math.min(1, Math.max(0, (value - range.start) / (range.end - range.start)));
}

function physicalEase(value: number) {
  return value * value * value * (value * (value * 6 - 15) + 10);
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
  cameraDebug = false,
  htmlPortal,
  identitySemantic = true,
  onReady,
  progress,
  sequence,
}: MachineSceneWithPortalProps) {
  const gltf = useGLTF(machineModelPath);
  const runtime = useMemo(
    () => createModelRuntime(gltf.scene as Group),
    [gltf.scene],
  );
  const hingeRef = useRef(runtime.hinge);
  const cameraMarkerRef = useRef<Mesh>(null);
  const lookMarkerRef = useRef<Mesh>(null);
  const screenMaterialRef = useRef<MeshStandardMaterial>(null);
  const { camera, invalidate, size } = useThree();
  const reveal = stageProgress(progress, sequence.machineReveal);
  const screenPower = stageProgress(progress, sequence.screen);
  const screenDetails = stageProgress(progress, sequence.screenSettled);
  const identityIn = stageProgress(progress, sequence.identity);
  const identityOut = stageProgress(progress, sequence.identityExit);
  const identityVisibility = identityIn * (1 - identityOut);
  const screenAnchorX = getScreenAnchorX(size.width);

  useEffect(() => {
    onReady({
      objectCount: runtime.objectCount,
      triangleCount: runtime.triangleCount,
    });
  }, [onReady, runtime.objectCount, runtime.triangleCount]);

  useEffect(() => {
    const opening = stageProgress(progress, sequence.opening);
    const currentScreenPower = stageProgress(progress, sequence.screen);
    const reframeRaw = getRawStageProgress(progress, sequence.cameraReframe);
    const reframe = physicalEase(reframeRaw);
    const dolly = physicalEase(
      getRawStageProgress(progress, sequence.cameraDolly),
    );
    const screenMaterial = screenMaterialRef.current;
    const compact = size.width < 768;
    const activePath = compact ? cameraPath.mobile : cameraPath.desktop;
    const physicalPosition =
      dolly > 0
        ? activePath.dolly.getPoint(dolly)
        : activePath.reframe.getPoint(reframe);
    const lookProgress = physicalEase(Math.min(1, reframeRaw * 1.18));
    const lookTarget = lookStart.clone().lerp(screenCenter, lookProgress);

    hingeRef.current.rotation.x = closedLidAngle * (1 - opening);
    hingeRef.current.updateMatrixWorld(true);

    if (screenMaterial) {
      screenMaterial.color.copy(screenOff).lerp(screenOn, currentScreenPower);
      screenMaterial.emissive.copy(accent);
      screenMaterial.emissiveIntensity = currentScreenPower * 0.11;
    }

    cameraMarkerRef.current?.position.copy(physicalPosition);
    lookMarkerRef.current?.position.copy(lookTarget);

    if (cameraDebug) {
      camera.position.copy(cameraDebugPosition);
      camera.lookAt(cameraDebugTarget);
    } else {
      camera.position.copy(physicalPosition);
      camera.lookAt(lookTarget);
    }
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, cameraDebug, invalidate, progress, sequence, size.width]);

  useEffect(
    () => () => {
      runtime.graphiteMaterials.forEach((material) => material.dispose());
      disposeImportedScene(gltf.scene);
      useGLTF.clear(machineModelPath);
    },
    [gltf.scene, runtime],
  );

  return (
    <>
      <ambientLight intensity={0.04 + reveal * 0.32} />
      <directionalLight
        color="#f4f0e8"
        intensity={0.08 + reveal * 1.57}
        position={[4.5, 7, 5.5]}
      />

      {cameraDebug ? (
        <group>
          <Line
            color="#69d3e7"
            dashed
            dashScale={10}
            lineWidth={1.2}
            points={cameraDebugPath}
          />
          <mesh ref={cameraMarkerRef}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color="#f4f0e8" />
          </mesh>
          <mesh ref={lookMarkerRef}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#69d3e7" />
          </mesh>
        </group>
      ) : null}
      <directionalLight
        color="#69d3e7"
        intensity={reveal * 0.38}
        position={[-4, 2.5, -3]}
      />

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
            <group
              position={[screenAnchorX, screenAnchorY, screenAnchorZ]}
              rotation={screenPlane.rotation}
            >
              <Html
                center
                distanceFactor={0.282}
                portal={htmlPortal}
                rotation={[0, Math.PI, 0]}
                transform
                zIndexRange={[3, 3]}
              >
                <div
                  aria-hidden={identitySemantic ? undefined : true}
                  className={styles.screenIdentityFrame}
                  data-screen-active={screenPower > 0.05}
                  data-screen-settled={screenDetails > 0.95}
                  data-identity-visible={identityVisibility > 0.05}
                  data-machine-identity=""
                >
                  <div
                    className={styles.screenIdentity}
                    style={{ opacity: identityVisibility }}
                  >
                    <span>MALMÖ, SWEDEN / PORTFOLIO</span>
                    {identitySemantic ? (
                      <h2>Jonathan Jansson</h2>
                    ) : (
                      <div className={styles.identityName}>Jonathan Jansson</div>
                    )}
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
          <meshBasicMaterial color="#000000" depthWrite={false} opacity={reveal * 0.08} transparent />
        </mesh>
        <mesh position={[0, 0, -0.002]} scale={[2.02, 1.02, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial color="#000000" depthWrite={false} opacity={reveal * 0.045} transparent />
        </mesh>
        <mesh position={[0, 0, -0.004]} scale={[2.28, 1.2, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial color="#000000" depthWrite={false} opacity={reveal * 0.025} transparent />
        </mesh>
      </group>
    </>
  );
}

export function MachineCanvas({
  cameraDebug = false,
  identitySemantic = true,
  onReady,
  progress,
  sequence,
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
          cameraDebug={cameraDebug}
          htmlPortal={htmlPortal}
          identitySemantic={identitySemantic}
          onReady={onReady}
          progress={progress}
          sequence={sequence}
        />
      </Canvas>
      <div
        ref={htmlPortal}
        className={styles.htmlPortal}
        data-camera-debug={cameraDebug}
        data-camera-language="physical"
        data-machine-html-layer=""
      />
    </>
  );
}

useGLTF.preload(machineModelPath);
