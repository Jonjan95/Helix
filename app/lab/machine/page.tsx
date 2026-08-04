import type { Metadata } from "next";
import { MachineLab } from "@/components/lab/machine/MachineLab";

export const metadata: Metadata = {
  description:
    "An isolated 3D prototype for the Helix laptop opening and screen approach.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Machine Lab | Helix",
};

export default function MachineLabPage() {
  return <MachineLab />;
}
