import { CubicBezierCurve3, Vector3 } from "three";
import type { MachineSequenceDefinition } from "@/lib/machine-lab/sequence";

const cameraStart = new Vector3(4.6, 2.8, 6.4);
const cameraReframe = new Vector3(0.28, 0.82, 6.05);
const cameraDollyEnd = new Vector3(0.04, 0.67, 4.15);
const cameraMobileReframe = new Vector3(0.42, 0.96, 6.1);
const cameraMobileEnd = new Vector3(0.18, 0.82, 4.6);
const lookStart = new Vector3(0, 0.55, 0.3);
const screenCenter = new Vector3(0, 0.6, -0.64);

const cameraPaths = {
  desktop: {
    dolly: new CubicBezierCurve3(
      cameraReframe,
      new Vector3(0.16, 0.74, 5.42),
      new Vector3(0.08, 0.69, 4.78),
      cameraDollyEnd,
    ),
    reframe: new CubicBezierCurve3(
      cameraStart,
      new Vector3(3.28, 2.26, 6.42),
      new Vector3(1.22, 1.28, 6.22),
      cameraReframe,
    ),
  },
  mobile: {
    dolly: new CubicBezierCurve3(
      cameraMobileReframe,
      new Vector3(0.32, 0.9, 5.6),
      new Vector3(0.22, 0.84, 5.02),
      cameraMobileEnd,
    ),
    reframe: new CubicBezierCurve3(
      cameraStart,
      new Vector3(3.34, 2.3, 6.43),
      new Vector3(1.34, 1.4, 6.26),
      cameraMobileReframe,
    ),
  },
} as const;

const lookPath = new CubicBezierCurve3(
  lookStart,
  new Vector3(0, 0.56, 0.02),
  new Vector3(0, 0.59, -0.48),
  screenCenter,
);

export const cameraDebugPosition = new Vector3(7.4, 5.7, 9.2);
export const cameraDebugTarget = new Vector3(1.4, 1.2, 4.8);
export const cameraDebugPath = [
  ...cameraPaths.desktop.reframe.getPoints(32),
  ...cameraPaths.desktop.dolly.getPoints(24).slice(1),
];

type CameraOwner = "hold" | "reframe" | "shared" | "dolly";

export type CameraPose = {
  blend: number;
  dollyProgress: number;
  lookProgress: number;
  owner: CameraOwner;
  position: Vector3;
  reframeProgress: number;
  target: Vector3;
};

function rawStageProgress(
  value: number,
  range: { readonly end: number; readonly start: number },
) {
  return Math.min(1, Math.max(0, (value - range.start) / (range.end - range.start)));
}

function physicalEase(value: number) {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

export function getCameraPose(
  progress: number,
  sequence: MachineSequenceDefinition,
  compact = false,
): CameraPose {
  const reframeRaw = rawStageProgress(progress, sequence.cameraReframe);
  const dollyRaw = rawStageProgress(progress, sequence.cameraDolly);
  const reframeProgress = physicalEase(reframeRaw);
  const dollyProgress = physicalEase(dollyRaw);
  const lookProgress = physicalEase(Math.min(1, reframeRaw * 1.12));
  const activePath = compact ? cameraPaths.mobile : cameraPaths.desktop;
  const reframePosition = activePath.reframe.getPoint(reframeProgress);
  const dollyPosition = activePath.dolly.getPoint(dollyProgress);
  const ownershipBlend = physicalEase(Math.min(1, dollyRaw / 0.2));
  const position = reframePosition.clone().lerp(dollyPosition, ownershipBlend);
  const target = lookPath.getPoint(lookProgress);
  const enteringShared = rawStageProgress(progress, {
    start: sequence.cameraReframe.end -
      (sequence.cameraReframe.end - sequence.cameraReframe.start) * 0.2,
    end: sequence.cameraReframe.end,
  });
  const leavingShared = rawStageProgress(progress, {
    start: sequence.cameraDolly.start,
    end: sequence.cameraDolly.start +
      (sequence.cameraDolly.end - sequence.cameraDolly.start) * 0.2,
  });
  const blend = Math.max(enteringShared * (1 - leavingShared), leavingShared > 0 && leavingShared < 1 ? 1 - leavingShared : 0);
  let owner: CameraOwner = "hold";

  if (reframeRaw > 0 && enteringShared === 0) owner = "reframe";
  if (enteringShared > 0 && leavingShared < 1) owner = "shared";
  if (dollyRaw > 0 && leavingShared >= 1) owner = "dolly";

  return {
    blend,
    dollyProgress,
    lookProgress,
    owner,
    position,
    reframeProgress,
    target,
  };
}

export function auditCameraContinuity(
  sequence: MachineSequenceDefinition,
  samples = 1000,
) {
  let previous = getCameraPose(0, sequence);
  let maxPositionDelta = 0;
  let maxTargetDelta = 0;
  let maxViewAngle = 0;

  for (let index = 1; index <= samples; index += 1) {
    const pose = getCameraPose(index / samples, sequence);
    const previousDirection = previous.target.clone().sub(previous.position).normalize();
    const direction = pose.target.clone().sub(pose.position).normalize();
    maxPositionDelta = Math.max(
      maxPositionDelta,
      previous.position.distanceTo(pose.position),
    );
    maxTargetDelta = Math.max(
      maxTargetDelta,
      previous.target.distanceTo(pose.target),
    );
    maxViewAngle = Math.max(maxViewAngle, previousDirection.angleTo(direction));
    previous = pose;
  }

  return { maxPositionDelta, maxTargetDelta, maxViewAngle };
}
