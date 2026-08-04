export const machineModelPath = "/models/helix-machine.glb";

export type MachineSequenceCandidate = "cinematic" | "editorial";

type StageRange = {
  readonly end: number;
  readonly start: number;
};

export type MachineSequenceDefinition = {
  readonly cameraDolly: StageRange;
  readonly cameraReframe: StageRange;
  readonly identity: StageRange;
  readonly identityExit: StageRange;
  readonly identityHold: StageRange;
  readonly lidSettled: StageRange;
  readonly machineReveal: StageRange;
  readonly machineSettled: StageRange;
  readonly opening: StageRange;
  readonly screen: StageRange;
  readonly screenSettled: StageRange;
};

export const machineSequences = {
  cinematic: {
    cameraDolly: { end: 1, start: 0.96 },
    cameraReframe: { end: 0.94, start: 0.87 },
    identity: { end: 0.8, start: 0.72 },
    identityExit: { end: 0.96, start: 0.94 },
    identityHold: { end: 0.87, start: 0.8 },
    lidSettled: { end: 0.54, start: 0.46 },
    machineReveal: { end: 0.12, start: 0 },
    machineSettled: { end: 0.2, start: 0.12 },
    opening: { end: 0.46, start: 0.2 },
    screen: { end: 0.66, start: 0.54 },
    screenSettled: { end: 0.72, start: 0.66 },
  },
  editorial: {
    cameraDolly: { end: 1, start: 0.89 },
    cameraReframe: { end: 0.86, start: 0.76 },
    identity: { end: 0.69, start: 0.61 },
    identityExit: { end: 0.89, start: 0.86 },
    identityHold: { end: 0.76, start: 0.69 },
    lidSettled: { end: 0.45, start: 0.4 },
    machineReveal: { end: 0.09, start: 0 },
    machineSettled: { end: 0.13, start: 0.09 },
    opening: { end: 0.4, start: 0.13 },
    screen: { end: 0.57, start: 0.45 },
    screenSettled: { end: 0.61, start: 0.57 },
  },
} as const satisfies Record<MachineSequenceCandidate, MachineSequenceDefinition>;

export const reducedMachineProgress = {
  cinematic: 0.84,
  editorial: 0.73,
} as const satisfies Record<MachineSequenceCandidate, number>;

export type MachinePlaybackDirection = "forward" | "reverse";

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function stageProgress(value: number, range: StageRange) {
  const normalized = clampProgress(
    (value - range.start) / (range.end - range.start),
  );

  return normalized * normalized * (3 - 2 * normalized);
}

export function getMachineStage(
  value: number,
  candidate: MachineSequenceCandidate,
) {
  const sequence = machineSequences[candidate];

  if (value < sequence.machineReveal.end) return "Machine reveal";
  if (value < sequence.opening.start) return "Machine settled";
  if (value < sequence.opening.end) return "Lid opening";
  if (value < sequence.screen.start) return "Lid settled";
  if (value < sequence.screen.end) return "Screen activation";
  if (value < sequence.identity.start) return "Screen settled";
  if (value < sequence.identity.end) return "Identity reveal";
  if (value < sequence.cameraReframe.start) return "Identity hold";
  if (value < sequence.cameraReframe.end) return "Camera reframe";
  if (value < sequence.cameraDolly.start) return "Identity departure";
  return "Camera dolly";
}
