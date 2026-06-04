"use client";

import { useEffect } from "react";
import { setupGsap } from "@/lib/gsap";

export function useMatchMediaGSAP(
  setup: (mm: gsap.MatchMedia) => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const gsap = setupGsap();
    const mm = gsap.matchMedia();
    setup(mm);

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
