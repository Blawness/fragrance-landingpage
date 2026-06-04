# Nué Solène — AGENTS.md

Single-page scroll-cinematic fragrance landing page. Frontend-only showcase, no DB/auth.

## Commands

```bash
pnpm install       # pnpm only (v10+), do NOT use npm/yarn
pnpm dev           # Next.js dev server
pnpm build         # prod build; run lint+typecheck first
pnpm lint          # ESLint (flat config, eslint.config.mjs)
pnpm typecheck     # tsc --noEmit (strict mode)
pnpm start         # serve prod build
```

Run `lint` → `typecheck` → `build` in that order before deploying.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.*`; `@tailwindcss/postcss` plugin)
- GSAP + `@gsap/react` (`useGSAP` hook) + Lenis (smooth scroll)
- Zustand, zod, `motion`, lucide-react
- Deployed on Vercel

## Architecture

- **All components are `"use client"`** — no server components with data fetching; content is static from `data/*.ts`
- **Single route `/`** — scenes composed in `app/page.tsx`, no routing beyond that
- **GSAP singleton** in `lib/gsap.ts` — `setupGsap()` registers ScrollTrigger + CustomEase once; call before any animation setup
- **Lenis ↔ GSAP bridge** in `components/layout/LenisProvider.tsx` — drives `gsap.ticker` through Lenis RAF; `ScrollTrigger.update()` on Lenis scroll; disabled under `prefers-reduced-motion`
- **Scene animation pattern**: `useGSAP({ scope, dependencies })` — `scope` ref on the section element; GSAP queries scoped inside
- **Reduced motion**: `useReducedMotionPref()` hook (based on `useSyncExternalStore`); each scene has a reduced-motion branch
- **Preloader**: skips via `sessionStorage` flag after first visit; locks scroll while active
- **Image sequence**: bottle frames generated as SVG-in-data-URI (see `lib/sequence.ts`), drawn to `<canvas>` — no real frame files needed
- **Content** lives in `data/` (product, notes, sections), not hardcoded in components
- **Newsletter**: mock only — zod validation on client + server, no actual email send

## Key Conventions

- `ease: "nueEase"` — custom `0.19, 1, 0.22, 1` set globally in `lib/gsap.ts`
- `@/*` path alias maps to project root (e.g. `@/components/scenes/Hero`)
- CSS classes use BEM-like naming with `data-*` attributes for GSAP targets (e.g. `[data-hero-bottle]`)
- `next/image` for all images with explicit width/height; hero image has `priority`
- No shadcn/ui components currently — all UI is hand-crafted CSS
- `motion` (former framer-motion) available for lightweight enter animations
- `z.email()` for email validation in both client and API route
- `.section-shell` = `width: min(1180px, calc(100vw - 32px)); margin: 0 auto;` — shared layout wrapper

## Notable

- `useGSAP` accepts a `dependencies` array (second param) — always pass stable deps or the animation won't re-run on state changes
- Bottle frame count: 72 (desktop) / 36 (mobile) / 4 (reduced-motion)
- No test suite, no codegen, no database migrations
- `.gitignore` lists `.vercel/` but the `.vercel/project.json` is committed — Vercel auto-generated, keep it
