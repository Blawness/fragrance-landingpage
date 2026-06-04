"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { product } from "@/data/product";
import { getSection } from "@/data/sections";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();
  const copy = getSection("hero");

  useGSAP(
    () => {
      if (!scope.current) return;
      const gsap = setupGsap();

      if (!reducedMotion) {
        gsap.to("[data-hero-bottle]", {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to("[data-hero-wordmark]", { yPercent: -18, opacity: 0.35 }, 0)
          .to("[data-hero-copy]", { yPercent: -36, opacity: 0 }, 0)
          .to("[data-hero-bottle]", { yPercent: 18, scale: 0.92 }, 0)
          .to("[data-scroll-cue]", { opacity: 0, y: 16 }, 0);
      }
    },
    { scope, dependencies: [reducedMotion] },
  );

  return (
    <section className="hero" ref={scope} aria-labelledby="hero-title">
      <div className="hero-wordmark display" data-hero-wordmark>
        Nué
      </div>
      <div className="hero-bottle" data-hero-bottle>
        <Image
          src={product.heroImage}
          alt="Solène Eau de Parfum bottle"
          width={760}
          height={980}
          priority
          sizes="(max-width: 768px) 78vw, 520px"
        />
      </div>
      <div className="hero-copy" data-hero-copy>
        <p className="eyebrow">{product.type}</p>
        <h1 id="hero-title" className="display">
          {copy?.heading}
        </h1>
        <p>{product.tagline}</p>
      </div>
      <div className="scroll-cue" data-scroll-cue aria-hidden="true">
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
