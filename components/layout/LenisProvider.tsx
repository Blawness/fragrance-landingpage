"use client";

import Lenis from "lenis";
import { ReactNode, useEffect } from "react";
import { ScrollTrigger, setupGsap } from "@/lib/gsap";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const gsap = setupGsap();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      touchInertiaExponent: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
    window.addEventListener("resize", refresh);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return (
    <>
      {children}
      <div className="grain" />
    </>
  );
}
