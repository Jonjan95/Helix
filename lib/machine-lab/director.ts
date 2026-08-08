export const directorStorageKey = "helix.arrival-director.poses.v1";

export const directorViewportPresets = [
  { height: 1000, id: "1440x1000", label: "1440 × 1000", width: 1440 },
  { height: 800, id: "1280x800", label: "1280 × 800", width: 1280 },
  { height: 768, id: "1024x768", label: "1024 × 768", width: 1024 },
  { height: 1024, id: "768x1024", label: "768 × 1024", width: 768 },
  { height: 844, id: "390x844", label: "390 × 844", width: 390 },
] as const;

export type DirectorViewportId = (typeof directorViewportPresets)[number]["id"];

export type DirectorVector3 = {
  x: number;
  y: number;
  z: number;
};

export type DirectorPose = {
  cameraPosition: DirectorVector3;
  cameraTarget: DirectorVector3;
  fov: number;
  id: string;
  identityOffset: {
    x: number;
    y: number;
  };
  identityOpacity: number;
  identityScale: number;
  lidAngle: number;
  machinePosition: DirectorVector3;
  machineScale: number;
  name: string;
  screenLuminance: number;
};

export type DirectorPoseCollection = {
  poses: DirectorPose[];
  version: 1;
};

export const directorControlRanges = {
  cameraPosition: { max: 12, min: -12, step: 0.01 },
  cameraTarget: { max: 5, min: -5, step: 0.01 },
  fov: { max: 75, min: 20, step: 1 },
  identityOffset: { max: 2, min: -2, step: 0.01 },
  identityOpacity: { max: 1, min: 0, step: 0.01 },
  identityScale: { max: 2, min: 0.4, step: 0.01 },
  lidAngle: { max: 1.55, min: 0, step: 0.01 },
  machinePosition: { max: 5, min: -5, step: 0.01 },
  machineScale: { max: 0.25, min: 0.04, step: 0.001 },
  screenLuminance: { max: 1, min: 0, step: 0.01 },
} as const;

const initialSlotNames = [
  "closed-dark",
  "opening-midpoint",
  "open-hero",
  "identity-hold",
  "front-facing",
  "threshold-entry",
] as const;

const neutralPose = {
  cameraPosition: { x: 4.6, y: 2.8, z: 6.4 },
  cameraTarget: { x: 0, y: 0.55, z: 0.3 },
  fov: 38,
  identityOffset: { x: 0, y: 0 },
  identityOpacity: 0,
  identityScale: 1,
  lidAngle: 1.50796,
  machinePosition: { x: 0, y: -0.58, z: 0.62 },
  machineScale: 0.115,
  screenLuminance: 0,
} as const;

export const initialDirectorPoses: DirectorPose[] = initialSlotNames.map(
  (name, index) => ({
    cameraPosition: { ...neutralPose.cameraPosition },
    cameraTarget: { ...neutralPose.cameraTarget },
    fov: neutralPose.fov,
    id: `slot-${index + 1}`,
    identityOffset: { ...neutralPose.identityOffset },
    identityOpacity: neutralPose.identityOpacity,
    identityScale: neutralPose.identityScale,
    lidAngle: neutralPose.lidAngle,
    machinePosition: { ...neutralPose.machinePosition },
    machineScale: neutralPose.machineScale,
    name,
    screenLuminance: neutralPose.screenLuminance,
  }),
);

export function cloneDirectorPose(pose: DirectorPose): DirectorPose {
  return {
    ...pose,
    cameraPosition: { ...pose.cameraPosition },
    cameraTarget: { ...pose.cameraTarget },
    identityOffset: { ...pose.identityOffset },
    machinePosition: { ...pose.machinePosition },
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isVector3(value: unknown): value is DirectorVector3 {
  if (!value || typeof value !== "object") return false;
  const vector = value as Record<string, unknown>;
  return (
    isFiniteNumber(vector.x) &&
    isFiniteNumber(vector.y) &&
    isFiniteNumber(vector.z)
  );
}

function isVector2(value: unknown): value is { x: number; y: number } {
  if (!value || typeof value !== "object") return false;
  const vector = value as Record<string, unknown>;
  return isFiniteNumber(vector.x) && isFiniteNumber(vector.y);
}

function inRange(
  value: number,
  range: { readonly max: number; readonly min: number },
) {
  return value >= range.min && value <= range.max;
}

export function normalizeDirectorPose(value: unknown): DirectorPose | null {
  if (!value || typeof value !== "object") return null;
  const pose = value as Record<string, unknown>;
  const identityOpacity = pose.identityOpacity ?? 0;

  const valid =
    typeof pose.id === "string" &&
    pose.id.trim().length > 0 &&
    typeof pose.name === "string" &&
    pose.name.trim().length > 0 &&
    isVector3(pose.cameraPosition) &&
    Object.values(pose.cameraPosition).every((entry) =>
      inRange(entry, directorControlRanges.cameraPosition),
    ) &&
    isVector3(pose.cameraTarget) &&
    Object.values(pose.cameraTarget).every((entry) =>
      inRange(entry, directorControlRanges.cameraTarget),
    ) &&
    isFiniteNumber(pose.fov) &&
    inRange(pose.fov, directorControlRanges.fov) &&
    isVector3(pose.machinePosition) &&
    Object.values(pose.machinePosition).every((entry) =>
      inRange(entry, directorControlRanges.machinePosition),
    ) &&
    isFiniteNumber(pose.machineScale) &&
    inRange(pose.machineScale, directorControlRanges.machineScale) &&
    isFiniteNumber(pose.lidAngle) &&
    inRange(pose.lidAngle, directorControlRanges.lidAngle) &&
    isFiniteNumber(pose.screenLuminance) &&
    inRange(pose.screenLuminance, directorControlRanges.screenLuminance) &&
    isVector2(pose.identityOffset) &&
    inRange(pose.identityOffset.x, directorControlRanges.identityOffset) &&
    inRange(pose.identityOffset.y, directorControlRanges.identityOffset) &&
    isFiniteNumber(identityOpacity) &&
    inRange(identityOpacity, directorControlRanges.identityOpacity) &&
    isFiniteNumber(pose.identityScale) &&
    inRange(pose.identityScale, directorControlRanges.identityScale);

  if (!valid) return null;

  return {
    cameraPosition: { ...(pose.cameraPosition as DirectorVector3) },
    cameraTarget: { ...(pose.cameraTarget as DirectorVector3) },
    fov: pose.fov as number,
    id: pose.id as string,
    identityOffset: {
      ...(pose.identityOffset as { x: number; y: number }),
    },
    identityOpacity,
    identityScale: pose.identityScale as number,
    lidAngle: pose.lidAngle as number,
    machinePosition: { ...(pose.machinePosition as DirectorVector3) },
    machineScale: pose.machineScale as number,
    name: pose.name as string,
    screenLuminance: pose.screenLuminance as number,
  };
}

export function parseDirectorPoseImport(value: string): DirectorPose[] {
  const parsed: unknown = JSON.parse(value);
  const candidates = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && "poses" in parsed
      ? (parsed as { poses: unknown }).poses
      : [parsed];

  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("The import must contain at least one pose.");
  }
  const normalized = candidates.map(normalizeDirectorPose);
  if (normalized.some((pose) => pose === null)) {
    throw new Error("The import contains an invalid or out-of-range pose.");
  }

  return normalized as DirectorPose[];
}

export function serializeDirectorPoses(poses: DirectorPose[]) {
  const collection: DirectorPoseCollection = { poses, version: 1 };
  return JSON.stringify(collection, null, 2);
}
