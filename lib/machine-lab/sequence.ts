export const machineModelPath = "/models/helix-machine.glb";

export const machineSequence = {
  cameraDolly: { end: 1, start: 0.84 },
  cameraReframe: { end: 0.84, start: 0.7 },
  identity: { end: 0.76, start: 0.58 },
  identityExit: { end: 0.97, start: 0.9 },
  opening: { end: 0.5, start: 0.2 },
  screen: { end: 0.65, start: 0.45 },
} as const;

export const reducedMachineProgress = 0.68;

export type MachineIdentityCandidate = "semantic" | "texture";
export type MachinePlaybackDirection = "forward" | "reverse";

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function stageProgress(
  value: number,
  range: { readonly end: number; readonly start: number },
) {
  const normalized = clampProgress(
    (value - range.start) / (range.end - range.start),
  );

  return normalized * normalized * (3 - 2 * normalized);
}

export function getMachineStage(value: number) {
  if (value < machineSequence.opening.start) return "Closed";
  if (value < machineSequence.screen.start) return "Opening";
  if (value < machineSequence.identity.start) return "Screen activation";
  if (value < machineSequence.cameraReframe.start) return "Identity";
  if (value < machineSequence.cameraDolly.start) return "Camera reframe";
  return "Camera dolly";
}
