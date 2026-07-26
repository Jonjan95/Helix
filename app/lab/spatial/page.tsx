import type { Metadata } from "next";
import { SpatialLab } from "@/components/lab/spatial/SpatialLab";

export const metadata: Metadata = {
  description:
    "An isolated comparison of CSS, SVG, and Three.js spatial directions for Helix.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Spatial Design Lab | Helix",
};

export default function SpatialLabPage() {
  return <SpatialLab />;
}
