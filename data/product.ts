import type { FragranceProduct } from "@/types";

export const product: FragranceProduct = {
  id: "solene",
  name: "Solène",
  house: "Nué",
  type: "Eau de Parfum",
  tagline: "Light, made scent",
  sizes: [
    { ml: 50, priceLabel: "Rp 1.480.000" },
    { ml: 100, priceLabel: "Rp 2.240.000" },
  ],
  inci: [
    "Alcohol Denat.",
    "Parfum",
    "Aqua",
    "Limonene",
    "Linalool",
    "Citral",
    "Geraniol",
  ],
  heroImage: "/images/solene-bottle.svg",
  sequence: {
    basePath: "/sequence/solene/",
    frameCount: 72,
    frameCountMobile: 36,
    ext: "webp",
    pad: 4,
  },
};
