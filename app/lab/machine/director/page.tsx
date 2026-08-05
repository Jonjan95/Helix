import type { Metadata } from "next";
import { ArrivalDirector } from "@/components/lab/machine/director/ArrivalDirector";

export const metadata: Metadata = {
  description: "An isolated pose-authoring tool for the Helix Arrival machine.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Arrival Director | Helix",
};

export default function ArrivalDirectorPage() {
  return <ArrivalDirector />;
}
