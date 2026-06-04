"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function setupGsap() {
  if (registered) {
    return gsap;
  }

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("nueEase", "0.19, 1, 0.22, 1");
  gsap.defaults({ ease: "nueEase", duration: 0.9 });
  registered = true;

  return gsap;
}

export { ScrollTrigger };
