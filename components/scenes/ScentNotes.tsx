"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { notes } from "@/data/notes";
import { getSection } from "@/data/sections";
import { setupGsap } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import type { ScentTier } from "@/types";

const tiers: ScentTier[] = ["top", "heart", "base"];

export function ScentNotes() {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();
  const copy = getSection("notes");

  useGSAP(
    () => {
      if (!scope.current) return;
      const gsap = setupGsap();

      gsap.fromTo(
        "[data-note-card]",
        { y: reducedMotion ? 10 : 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: reducedMotion ? 0 : 0.08,
          duration: reducedMotion ? 0.25 : 0.8,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      if (!reducedMotion) {
        gsap.to("[data-note-image]", {
          yPercent: -10,
          stagger: 0.08,
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope, dependencies: [reducedMotion] },
  );

  return (
    <section className="notes-section" ref={scope} aria-labelledby="notes-title">
      <div className="section-shell">
        <p className="eyebrow">Scent notes</p>
        <SplitReveal
          as="h2"
          text={copy?.heading ?? ""}
          className="notes-title display"
          by="words"
        />
        <p className="notes-intro">{copy?.body}</p>
        <div className="notes-grid">
          {tiers.map((tier) => (
            <article className="note-tier" key={tier} data-note-card>
              <span className="tier-index">{String(tiers.indexOf(tier) + 1).padStart(2, "0")}</span>
              <h3 className="display">{tier}</h3>
              <div className="tier-line" />
              <ul>
                {notes
                  .filter((note) => note.tier === tier)
                  .sort((a, b) => a.order - b.order)
                  .map((note) => (
                    <li key={note.label}>
                      <Image
                        src={note.image}
                        alt=""
                        width={74}
                        height={74}
                        data-note-image
                      />
                      <span>{note.label}</span>
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
