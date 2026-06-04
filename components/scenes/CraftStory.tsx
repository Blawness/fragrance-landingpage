"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getSection } from "@/data/sections";
import { setupGsap } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

export function CraftStory() {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();
  const copy = getSection("craft");

  useGSAP(
    () => {
      if (!scope.current || reducedMotion) return;
      const gsap = setupGsap();
      gsap.to("[data-parallax-layer]", {
        y: (_, target) => Number(target.dataset.speed ?? 0) * -70,
        scrollTrigger: {
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope, dependencies: [reducedMotion] },
  );

  return (
    <section className="craft-section" ref={scope} aria-labelledby="craft-title">
      <div className="craft-media">
        <Image
          src="/images/craft-light.svg"
          alt=""
          width={420}
          height={560}
          data-parallax-layer
          data-speed="1.4"
        />
        <Image
          src="/images/craft-texture.svg"
          alt=""
          width={360}
          height={460}
          data-parallax-layer
          data-speed="-0.8"
        />
        <Image
          src="/images/craft-closeup.svg"
          alt=""
          width={500}
          height={620}
          data-parallax-layer
          data-speed="0.7"
        />
      </div>
      <div className="section-shell craft-copy">
        <p className="eyebrow">Craft</p>
        <SplitReveal
          as="h2"
          text={copy?.heading ?? ""}
          className="display"
          by="words"
        />
        <SplitReveal
          as="p"
          text={copy?.body ?? ""}
          className="craft-quote display"
          by="words"
          delay={0.1}
        />
      </div>
    </section>
  );
}
