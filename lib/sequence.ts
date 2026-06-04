import type { ImageSequence } from "@/types";

export function framePath(sequence: ImageSequence, index: number) {
  const frame = String(index + 1).padStart(sequence.pad, "0");
  return `${sequence.basePath}${frame}.${sequence.ext}`;
}

export function generatedBottleFrame(index: number, total: number) {
  const progress = total <= 1 ? 0 : index / (total - 1);
  const angle = progress * Math.PI * 2;
  const width = 900;
  const height = 1200;
  const bodyWidth = 270 + Math.cos(angle) * 54;
  const capShift = Math.sin(angle) * 20;
  const shineX = 430 + Math.sin(angle) * 105;
  const amber = 42 + Math.sin(angle) * 14;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="bg" cx="50%" cy="45%" r="64%">
        <stop offset="0%" stop-color="#2a1711"/>
        <stop offset="58%" stop-color="#0f0b09"/>
        <stop offset="100%" stop-color="#070605"/>
      </radialGradient>
      <linearGradient id="glass" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stop-color="#f7efe2" stop-opacity=".12"/>
        <stop offset="18%" stop-color="#f7efe2" stop-opacity=".34"/>
        <stop offset="48%" stop-color="#d4a35f" stop-opacity=".12"/>
        <stop offset="78%" stop-color="#f7efe2" stop-opacity=".25"/>
        <stop offset="100%" stop-color="#f7efe2" stop-opacity=".08"/>
      </linearGradient>
      <linearGradient id="liquid" x1="0%" x2="0%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#f0c47a" stop-opacity=".48"/>
        <stop offset="100%" stop-color="#9b552e" stop-opacity=".82"/>
      </linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="22"/></filter>
    </defs>
    <rect width="900" height="1200" fill="url(#bg)"/>
    <ellipse cx="450" cy="1040" rx="${210 + Math.cos(angle) * 18}" ry="44" fill="#000" opacity=".42" filter="url(#blur)"/>
    <rect x="${450 - bodyWidth / 2}" y="365" width="${bodyWidth}" height="555" rx="82" fill="url(#glass)" stroke="#f7efe2" stroke-opacity=".28" stroke-width="3"/>
    <path d="M${450 - bodyWidth / 2 + 28} 725 C 340 ${735 + amber}, 550 ${695 - amber}, ${450 + bodyWidth / 2 - 28} 720 L ${450 + bodyWidth / 2 - 28} 875 C 520 910, 380 910, ${450 - bodyWidth / 2 + 28} 875 Z" fill="url(#liquid)" opacity=".84"/>
    <rect x="${shineX}" y="392" width="35" height="470" rx="18" fill="#fff7e8" opacity=".38"/>
    <rect x="${405 + capShift}" y="245" width="90" height="130" rx="22" fill="#ead6aa" opacity=".78"/>
    <rect x="${384 + capShift * 0.7}" y="198" width="132" height="64" rx="16" fill="#f4dfaf" opacity=".86"/>
    <text x="450" y="612" text-anchor="middle" font-family="Georgia, serif" font-size="76" fill="#f7efe2" opacity=".94">Nué</text>
    <text x="450" y="668" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" letter-spacing="8" fill="#ead6aa" opacity=".84">SOLENE</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
