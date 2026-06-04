import type { SceneCopy } from "@/types";

export const sections: SceneCopy[] = [
  {
    sceneId: "hero",
    heading: "Solène",
    body: "Light passing through warm skin, citrus, and a quiet amber trail.",
  },
  {
    sceneId: "sequence",
    captions: [
      { atProgress: 0.18, text: "Top: Bergamot · Pink Pepper" },
      { atProgress: 0.5, text: "Heart: Jasmine Sambac · Orris" },
      { atProgress: 0.78, text: "Base: Amber Resin · White Musk" },
    ],
  },
  {
    sceneId: "notes",
    heading: "A pyramid written in light.",
    body: "Bright citrus opens into sheer florals, then settles into a polished amber veil.",
  },
  {
    sceneId: "craft",
    heading: "Composed at dusk.",
    body: "A translucent floral amber shaped around negative space, polished woods, and the hush after rain.",
  },
  {
    sceneId: "product",
    heading: "Solène Eau de Parfum",
    body: "A luminous signature fragrance for evenings that begin before sunset.",
  },
];

export const getSection = (sceneId: SceneCopy["sceneId"]) =>
  sections.find((section) => section.sceneId === sceneId);
