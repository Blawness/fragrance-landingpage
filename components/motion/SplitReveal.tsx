"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

type SplitRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  by?: "words" | "chars";
  delay?: number;
};

export function SplitReveal({
  text,
  as: Component = "span",
  className,
  by = "words",
  delay = 0,
}: SplitRevealProps) {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();
  const units = by === "chars" ? Array.from(text) : text.split(" ");

  useGSAP(
    () => {
      const gsap = setupGsap();
      if (!scope.current) return;

      const pieces = scope.current.querySelectorAll("[data-split-piece]");
      gsap.fromTo(
        pieces,
        { yPercent: reducedMotion ? 0 : 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          delay,
          duration: reducedMotion ? 0.2 : 0.9,
          stagger: reducedMotion ? 0 : by === "chars" ? 0.025 : 0.06,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope, dependencies: [reducedMotion, delay, by] },
  );

  return (
    <Component ref={scope as never} className={className}>
      {units.map((unit, index) => (
        <span className="split-mask" key={`${unit}-${index}`}>
          <span className="inline-block will-change-transform" data-split-piece>
            {unit === " " ? "\u00a0" : unit}
            {by === "words" && index < units.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </Component>
  );
}
