export const spatialPrototypeIds = [
  "baseline",
  "css",
  "svg",
  "three",
] as const;

export type SpatialPrototypeId = (typeof spatialPrototypeIds)[number];
export type SpatialDepth = "subtle" | "strong";
export type SpatialDirection = "forward" | "reverse";

export type SpatialPrototypeDefinition = {
  id: SpatialPrototypeId;
  index: string;
  label: string;
  shortLabel: string;
  summary: string;
  implementation: string;
};

export const spatialPrototypes = [
  {
    id: "baseline",
    implementation: "Existing visual language, reproduced without new depth.",
    index: "00",
    label: "Production baseline",
    shortLabel: "Baseline",
    summary:
      "A stable reference for judging whether added depth improves the threshold or merely adds novelty.",
  },
  {
    id: "css",
    implementation: "CSS perspective and the existing scoped GSAP runtime.",
    index: "A",
    label: "CSS / GSAP pseudo-3D",
    shortLabel: "CSS / GSAP",
    summary:
      "Tests whether a few physical layers can carry the visitor through the laptop screen without introducing canvas.",
  },
  {
    id: "svg",
    implementation: "Decorative layered SVG with semantic notes outside it.",
    index: "B",
    label: "SVG spatial depth",
    shortLabel: "SVG depth",
    summary:
      "Tests whether front and back rails, controlled scale, and depth hierarchy can strengthen the Helix metaphor.",
  },
  {
    id: "three",
    implementation: "A dynamically loaded, disposable direct Three.js scene.",
    index: "C",
    label: "Three.js proof of concept",
    shortLabel: "Three.js",
    summary:
      "Tests whether real camera movement adds narrative value beyond the lighter browser-native approaches.",
  },
] as const satisfies readonly SpatialPrototypeDefinition[];
