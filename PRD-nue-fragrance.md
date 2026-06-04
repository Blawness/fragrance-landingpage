# PRD: Nué — Solène (Scroll-Cinematic Fragrance Landing)

**Version:** 1.0
**Date:** 2026-06-04
**Author:** Yudha Hafiz (Vorca Studio)
**Status:** Draft
**Internal codename:** Flagship P1 — Scroll-Cinematic

---

## 1. Overview

### 1.1 Product Summary

Single-page, scroll-cinematic landing page untuk **Nué**, sebuah fictional maison de parfum, dengan hero product **Solène** (Eau de Parfum). Tujuan utama proyek ini **bukan** menjual produk — ini adalah **flagship portfolio piece** untuk memamerkan craft frontend kelas Awwwards/Dribbble SOTD: motion choreography berbasis scroll, pinned image-sequence scrub, parallax berlapis, dan typographic reveal — semua tetap 60fps dan accessible. Art direction: **dark editorial** (noir + champagne/amber), glassy bottle yang menangkap cahaya. Tidak ada backend/auth/DB — semua konten statis dari file lokal.

### 1.2 Goals

- Hero → scroll experience yang "menahan jari" reviewer dalam 3 detik pertama (intro reveal + hero motion).
- Centerpiece: pinned scroll-driven product sequence (scrub bottle rotation/liquid) yang mulus tanpa jank.
- Lighthouse Performance ≥ 90 (mobile) **walaupun** motion berat; LCP < 2.5s; CLS < 0.1.
- Animasi konsisten 60fps; tidak ada long task > 50ms selama scroll.
- `prefers-reduced-motion` berfungsi penuh (fallback statis yang tetap rapi).
- Hand-crafted — tanpa Aceternity/Magic UI; semua motion ditulis sendiri (GSAP/Motion).

### 1.3 Non-Goals (Out of Scope for v1)

- Tidak ada e-commerce nyata (cart, checkout, payment) — tombol CTA hanya simulasi/visual.
- Tidak ada CMS / admin — konten hardcoded di file data lokal.
- Tidak ada WebGL/3D (itu jatah Flagship P3). P1 murni 2D + image-sequence scrub.
- Tidak ada multi-page / routing kompleks — single page + (opsional) modal product detail.
- Tidak ada i18n / multi-bahasa di v1.
- Tidak ada backend nyata untuk newsletter — route handler hanya mock validasi.

---

## 2. Users & Roles

> Tidak ada sistem auth/role. "Roles" di sini = audience persona untuk kalibrasi UX.

| Role | Description | Apa yang mereka lakukan |
|------|-------------|--------------------------|
| `Visitor` | Pengunjung umum di desktop/mobile | Scroll dari atas ke bawah, lihat experience, klik CTA (mock) |
| `Reviewer` | Recruiter / creative director / studio yang menilai portfolio | Cek kualitas motion, perf (DevTools), responsiveness, a11y |
| `ReducedMotionUser` | User dengan `prefers-reduced-motion: reduce` | Mendapat versi statis/transisi minimal, konten tetap lengkap & terbaca |

---

## 3. Core Features (MVP)

> Tiap feature = satu scroll scene atau sistem motion. Acceptance criteria mencakup spesifikasi animasi yang eksplisit agar agent bisa implement langsung.

### Feature 1: Global Motion System & Smooth Scroll

**Description:**
Fondasi animasi untuk seluruh halaman. Setup Lenis smooth scroll yang disinkronkan dengan GSAP `ScrollTrigger` lewat satu RAF loop. Semua animasi dibungkus dalam `useGSAP()` (`@gsap/react`) dengan scoping + auto-cleanup. Easing global custom (bukan linear / default). Satu `gsap.matchMedia()` context menangani breakpoint dan `prefers-reduced-motion`.

**Acceptance Criteria:**
- [ ] Lenis terpasang dan `ScrollTrigger.update()` dipanggil di Lenis `scroll` event; `gsap.ticker` men-drive Lenis `raf` (lerp ~0.1).
- [ ] Semua animasi memakai `useGSAP({ scope })`; tidak ada animasi yang bocor saat unmount/route change.
- [ ] Easing global didefinisikan sekali (mis. `CustomEase` / cubic-bezier khas) dan dipakai konsisten.
- [ ] `gsap.matchMedia()` membungkus seluruh setup; punya branch `(prefers-reduced-motion: reduce)` yang menonaktifkan scrub/parallax dan menggantinya dengan fade sederhana atau tanpa animasi.
- [ ] `ScrollTrigger.refresh()` dipanggil setelah font & image dimuat (hindari posisi trigger meleset).

**Out of Scope:**
ScrollSmoother berbayar setup khusus (pakai Lenis); scroll-snapping per-section; horizontal scroll global.

---

### Feature 2: Preloader & Intro Reveal

**Description:**
Saat halaman load, tampil preloader noir dengan brand mark "Nué" dan counter 0→100. Setelah aset hero siap, counter selesai → mask/curtain reveal membuka ke Hero. Brand name di-reveal dengan SplitText (per-character stagger). Scroll dikunci selama preloader aktif.

**Acceptance Criteria:**
- [ ] Counter 0→100 ter-drive oleh progress loading aset hero (bukan timer hardcoded).
- [ ] Reveal transition: clip-path / `yPercent` mask, durasi ~1.2s, easing custom.
- [ ] Brand name pakai GSAP **SplitText** (chars), stagger ~0.03s.
- [ ] Lenis `stop()` saat preloader, `start()` setelah reveal selesai.
- [ ] Preloader hanya tampil sekali per session (boleh pakai `sessionStorage` flag — opsional).
- [ ] Reduced-motion: skip counter & mask, langsung fade-in hero (≤ 300ms).

**Out of Scope:**
Audio/sound design; preloader berbeda per device; animated SVG logo draw kompleks.

---

### Feature 3: Hero Scene

**Description:**
Viewport penuh. Bottle Solène di tengah, brand wordmark oversized di belakang/overlap (editorial layering), tagline kecil ("Light, made scent"), dan scroll cue di bawah. Ambient motion halus: bottle floating (loop yoyo lembut) + subtle grain/shimmer overlay. Saat user mulai scroll, hero copy parallax keluar dan transisi ke scene berikutnya.

**Acceptance Criteria:**
- [ ] Layout layering: wordmark (z-bawah), bottle (z-tengah), tagline + cue (z-atas) — responsive desktop & mobile.
- [ ] Ambient float: `gsap.to` yoyo, amplitudo kecil (~8–12px), durasi ~3s, infinite.
- [ ] LCP element = hero bottle image; pakai `next/image` `priority`, ukuran responsif.
- [ ] Scroll cue menghilang setelah scroll > 5% viewport.
- [ ] Pada scroll, hero copy parallax (yPercent berbeda antar layer) sebelum pin scene berikutnya.
- [ ] Reduced-motion: tanpa float/parallax; layout statis terbaca penuh.

**Out of Scope:**
Cursor-follow bottle; mouse-parallax 3D tilt (boleh masuk v1.1 kalau perf aman).

---

### Feature 4: Cinematic Product Sequence (CENTERPIECE)

**Description:**
Section pinned tinggi (mis. 300vh). Saat user scroll, sebuah **image sequence** (frame-by-frame render bottle berputar / liquid bergerak) di-scrub via `<canvas>` mengikuti progress scroll. Di milestone scroll tertentu, caption teks fade-in/out (mis. "Top: Bergamot · Pink Pepper", lalu "Heart: Jasmine Sambac · Orris"). Ini bagian "wah" utama — harus benar-benar mulus.

**Acceptance Criteria:**
- [ ] Section di-pin via `ScrollTrigger` (`pin: true`, `scrub: true`), tinggi scroll proporsional jumlah frame.
- [ ] Frame digambar ke `<canvas>` (bukan menukar `<img src>`) untuk performa; index frame = fungsi dari scroll progress.
- [ ] Semua frame **dipreload** sebelum pin aktif; tampilkan frame 0 sampai siap (no flicker).
- [ ] Caption muncul di breakpoint progress yang ditentukan (mis. 0.2 / 0.5 / 0.8) dengan fade + SplitText line reveal.
- [ ] Tidak ada layout shift; canvas `aspect-ratio` fixed, `object-fit` cover logic manual.
- [ ] Mobile: jumlah frame dikurangi (mis. 2x lebih sedikit) + resolusi lebih kecil via `matchMedia`.
- [ ] Reduced-motion: ganti scrub dengan 3–4 still image bertumpuk + cross-fade saat masuk viewport (tanpa pin scrub).

**Out of Scope:**
Video `<video>` scrubbing (pakai image sequence); WebGL shader liquid (P3); frame > 120 (jaga payload).

---

### Feature 5: Scent Notes / Pyramid

**Description:**
Section reveal untuk piramida aroma (Top / Heart / Base). Tiap tier muncul dengan staggered reveal saat masuk viewport; ingredient imagery parallax pelan di belakang teks. Layout editorial — angka/label besar, garis pemisah tipis.

**Acceptance Criteria:**
- [ ] Data notes dibaca dari file lokal (`data/notes.ts`), bukan hardcoded di JSX.
- [ ] Tiap tier reveal pakai `ScrollTrigger` (`toggleActions: 'play none none reverse'`), stagger antar item ~0.08s.
- [ ] Heading tier pakai SplitText (lines/words), masking reveal dari bawah.
- [ ] Ingredient image parallax `yPercent` ~ -10..10 terhadap scroll.
- [ ] Reduced-motion: semua tier fade-in singkat tanpa parallax/stagger berlebihan.

**Out of Scope:**
Interactive hover yang mengubah note; audio per-note; 3D ingredient model.

---

### Feature 6: Craft / Story Parallax

**Description:**
Section naratif editorial. Beberapa layer image (botol close-up, tekstur, bahan) bergerak dengan kecepatan berbeda (multi-speed parallax). Sebuah pull-quote besar di-reveal per-character/word. Whitespace dan tipografi jadi bintang.

**Acceptance Criteria:**
- [ ] Minimal 3 layer parallax dengan `data-speed` berbeda, di-drive satu ScrollTrigger.
- [ ] Pull-quote SplitText (words), reveal sequential saat memasuki viewport.
- [ ] Tidak ada CLS; semua image punya dimensi eksplisit + `next/image`.
- [ ] Reduced-motion: layer statis, quote fade-in tanpa per-char.

**Out of Scope:**
Horizontal scroll gallery (boleh dipertimbangkan untuk P2 editorial); video background.

---

### Feature 7: Product Detail & CTA

**Description:**
Kartu produk Solène: nama, ukuran (50ml/100ml mock toggle), harga (mock), ingredient/INCI list singkat, dan tombol CTA "Discover" / "Add to bag" yang **magnetic** (mengikuti cursor) dengan hover state custom. Klik CTA → micro-interaction (ripple/confirm visual) tanpa aksi nyata.

**Acceptance Criteria:**
- [ ] Magnetic button: translate mengikuti cursor dalam radius tertentu, kembali ke center dengan elastic ease (desktop only; nonaktif di touch).
- [ ] Toggle ukuran mengubah harga yang ditampilkan (state lokal React/Zustand).
- [ ] Klik CTA memicu micro-interaction visual, lalu state "added" (mock), tidak ada network call.
- [ ] Reduced-motion + touch: tombol jadi standar (tanpa magnetic), tetap fungsional & jelas.

**Out of Scope:**
Cart drawer nyata; quantity; varian aroma lain; integrasi pembayaran.

---

### Feature 8: Footer (Newsletter Mock + Marquee)

**Description:**
Footer dengan running marquee wordmark "NUÉ", input newsletter (email), social links (dummy), dan credits ("Designed & built by Vorca Studio"). Newsletter submit divalidasi (zod) dan memunculkan success state — **tanpa** kirim email nyata (opsional: hit `POST /api/newsletter` yang hanya mock-log).

**Acceptance Criteria:**
- [ ] Marquee infinite, seamless loop, pause on hover (desktop).
- [ ] Email divalidasi dengan zod; error state inline; success state setelah submit.
- [ ] Submit boleh memanggil route handler mock atau resolve lokal saja — **tidak ada** pengiriman email nyata.
- [ ] Reduced-motion: marquee statis (tidak bergerak) atau kecepatan 0.

**Out of Scope:**
Integrasi Resend/Mailchimp nyata; double opt-in; captcha.

---

## 4. Tech Stack

> **Note for AI agents:** Pakai persis stack ini kecuali di-override eksplisit. Ini frontend-only showcase; tidak ada DB/ORM/auth.

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Runtime** | Node.js 22 LTS | |
| **Framework** | Next.js 16 (App Router) | React 19; single route `/` |
| **Language** | TypeScript 5 | strict mode |
| **Styling** | Tailwind CSS v4 + shadcn/ui | shadcn hanya untuk primitives (Button, Sheet mobile menu, Input). Bukan sumber motion. |
| **Animation (core)** | GSAP + `@gsap/react` (`useGSAP`) | Plugins: ScrollTrigger, SplitText (semua gratis sejak Apr 2025) |
| **Animation (declarative)** | Motion (`motion`, eks framer-motion) | Untuk component-level / enter animation ringan |
| **Smooth Scroll** | Lenis (`lenis`) | Disinkronkan dengan ScrollTrigger |
| **State Management** | React state + Zustand (kalau perlu global, mis. menu/preloader) | Minimal |
| **Validation** | zod | Newsletter form |
| **Fonts** | `next/font` (variable) | 1 display serif (editorial) + 1 clean sans |
| **Images** | `next/image` + image sequence (canvas) | Frame sequence dipreload |
| **API Style** | Route Handler (opsional, mock) | Tidak ada API utama |
| **Database / ORM / Auth** | none | Konten statis dari `data/` |
| **Deployment** | Vercel | Static-leaning, edge-friendly |
| **Package Manager** | pnpm | |
| **Lint/Format** | ESLint + Prettier (atau Biome) | |

---

## 5. Data Models

> Konten statis dari file lokal (`/data/*.ts`). Tidak ada database.

```typescript
// data/product.ts
type FragranceProduct = {
  id: string;                 // "solene"
  name: string;               // "Solène"
  house: string;              // "Nué"
  type: string;               // "Eau de Parfum"
  tagline: string;            // "Light, made scent"
  sizes: ProductSize[];
  inci: string[];             // ingredient list singkat (mock)
  heroImage: string;          // path LCP image
  sequence: ImageSequence;    // frames untuk centerpiece
};

type ProductSize = {
  ml: 50 | 100;
  priceLabel: string;         // "Rp —" / "$—" (mock, display-only)
};

// data/notes.ts
type ScentNote = {
  tier: 'top' | 'heart' | 'base';
  label: string;              // "Bergamot"
  image: string;              // ingredient imagery
  order: number;
};

// lib/sequence.ts
type ImageSequence = {
  basePath: string;           // "/sequence/solene/"
  frameCount: number;         // mis. 90 (desktop)
  frameCountMobile: number;   // mis. 45
  ext: 'webp' | 'avif';
  pad: number;                // zero-pad digits, mis. 4 -> "0001"
};

// data/sections.ts — copy per scene (caption scrub, quotes)
type SceneCopy = {
  sceneId: 'hero' | 'sequence' | 'notes' | 'craft' | 'product' | 'footer';
  heading?: string;
  body?: string;
  captions?: { atProgress: number; text: string }[]; // untuk scrub captions
};
```

---

## 6. API Endpoints

> Hampir tidak ada. Hanya satu route handler opsional untuk newsletter (mock).

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/newsletter` | public | Validasi email (zod). **Mock**: log/echo saja, tidak kirim email. Return `{ ok: true }`. |

---

## 7. Project Structure

```
nue-solene/
├── app/
│   ├── layout.tsx              # fonts (next/font), <Lenis> provider, metadata
│   ├── page.tsx                # compose semua scene
│   ├── globals.css             # Tailwind v4 + CSS vars (palette noir/champagne)
│   └── api/
│       └── newsletter/route.ts # mock handler (opsional)
├── components/
│   ├── ui/                     # shadcn primitives (button, input, sheet)
│   ├── scenes/
│   │   ├── Preloader.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductSequence.tsx # canvas scrub centerpiece
│   │   ├── ScentNotes.tsx
│   │   ├── CraftStory.tsx
│   │   ├── ProductDetail.tsx
│   │   └── Footer.tsx
│   ├── motion/
│   │   ├── MagneticButton.tsx
│   │   ├── SplitReveal.tsx
│   │   └── Marquee.tsx
│   └── layout/
│       ├── LenisProvider.tsx
│       └── Nav.tsx
├── hooks/
│   ├── useImageSequence.ts     # preload + draw frame ke canvas
│   ├── useMatchMediaGSAP.ts
│   └── useReducedMotionPref.ts
├── lib/
│   ├── gsap.ts                 # register plugins, CustomEase global
│   └── sequence.ts             # tipe + util frame path
├── data/
│   ├── product.ts
│   ├── notes.ts
│   └── sections.ts
├── public/
│   ├── sequence/solene/        # frame 0001..00NN (webp/avif)
│   ├── images/                 # hero, ingredient, texture
│   └── fonts/                  # kalau self-host
├── types/
│   └── index.ts
└── stores/
    └── useUiStore.ts           # preloader done, menu open, dll
```

---

## 8. Environment Variables

```env
# Tidak ada yang wajib untuk v1.
# Opsional — analytics:
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance (mobile) | ≥ 90 | Lighthouse CI / DevTools |
| LCP | < 2.5s | Lighthouse / WebVitals |
| CLS | < 0.1 | WebVitals |
| Frame rate selama scroll | ~60fps, no long task > 50ms | DevTools Performance panel |
| Reduced-motion | 100% fungsional, konten lengkap | Manual QA dengan flag aktif |
| Cross-browser | Pass di Chrome, Safari (incl. iOS), Firefox | Manual QA |
| Sequence scrub | Mulus, no flicker, preload selesai sebelum pin | Manual QA |
| Total transferred JS | Wajar (lazy-load berat) | DevTools Network |

---

## 10. Open Questions

> Agent harus flag ini sebelum implement bagian terkait.

- [ ] **Sumber image sequence centerpiece** — render Blender bottle, AI-generated stills, atau stock? Ini blocker utama Feature 4. Butuh ~45–90 frame konsisten (background noir, lighting sama).
- [ ] Jumlah frame final desktop vs mobile (default usulan: 90 / 45).
- [ ] Format frame: `webp` atau `avif`? (avif lebih kecil tapi decode lebih berat — uji di mobile mid-range).
- [ ] Font final: display serif apa? (kandidat editorial luxury: variable serif dari Fontshare/Google).
- [ ] Apakah perlu sound toggle (ambient) — default: tidak di v1.
- [ ] Newsletter: mock lokal saja, atau route handler `/api/newsletter`? (default: route handler mock).
- [ ] Copy final (tagline, caption scrub, pull-quote) — pakai placeholder dulu atau tulis sekarang?

---

*Generated by prd-generator skill — optimized for AI agentic coding tools.*
*Vorca Studio × Yudha Hafiz — Flagship P1 (Scroll-Cinematic)*
