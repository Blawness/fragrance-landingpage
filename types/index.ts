export type ProductSize = {
  ml: 50 | 100;
  priceLabel: string;
};

export type ImageSequence = {
  basePath: string;
  frameCount: number;
  frameCountMobile: number;
  ext: "webp" | "avif";
  pad: number;
};

export type FragranceProduct = {
  id: string;
  name: string;
  house: string;
  type: string;
  tagline: string;
  sizes: ProductSize[];
  inci: string[];
  heroImage: string;
  sequence: ImageSequence;
};

export type ScentTier = "top" | "heart" | "base";

export type ScentNote = {
  tier: ScentTier;
  label: string;
  image: string;
  order: number;
};

export type SceneCopy = {
  sceneId: "hero" | "sequence" | "notes" | "craft" | "product" | "footer";
  heading?: string;
  body?: string;
  captions?: { atProgress: number; text: string }[];
};
