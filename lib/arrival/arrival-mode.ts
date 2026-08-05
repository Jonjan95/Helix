export type ArrivalMode = "css" | "machine";

export const arrivalMode: ArrivalMode =
  process.env.NEXT_PUBLIC_ARRIVAL_MODE === "css" ? "css" : "machine";

export const machineSequenceEnd = 0.62;
export const machineHandoffEnd = 0.76;

