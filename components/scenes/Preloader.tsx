"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { setupGsap } from "@/lib/gsap";
import { product } from "@/data/product";
import { useUiStore } from "@/stores/useUiStore";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

export function Preloader() {
  const scope = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [assetReady, setAssetReady] = useState(false);
  const [done, setDone] = useState(false);
  const setPreloaderDone = useUiStore((state) => state.setPreloaderDone);
  const reducedMotion = useReducedMotionPref();

  useEffect(() => {
    const seen = sessionStorage.getItem("nue-preloader-seen") === "true";
    if (seen || reducedMotion) {
      document.documentElement.style.overflow = "";
      queueMicrotask(() => {
        setProgress(100);
        setAssetReady(true);
        setPreloaderDone(true);
        setDone(true);
      });
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const image = new Image();
    image.src = product.heroImage;
    image.onload = () => setAssetReady(true);
    image.onerror = () => setAssetReady(true);

    let value = 0;
    const timer = window.setInterval(() => {
      value += assetReady ? 16 : 7;
      setProgress(Math.min(value, assetReady ? 100 : 92));
      if (value >= 100 && assetReady) {
        window.clearInterval(timer);
      }
    }, 90);

    return () => {
      window.clearInterval(timer);
      document.documentElement.style.overflow = "";
    };
  }, [assetReady, reducedMotion, setPreloaderDone]);

  useGSAP(
    () => {
      if (!scope.current || progress < 100 || reducedMotion) return;
      const gsap = setupGsap();

      gsap
        .timeline({
          onComplete: () => {
            sessionStorage.setItem("nue-preloader-seen", "true");
            document.documentElement.style.overflow = "";
            setPreloaderDone(true);
            setDone(true);
          },
        })
        .to("[data-preloader-brand] span", {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 0.8,
        })
        .to(scope.current, {
          yPercent: -100,
          duration: 1.2,
        });
    },
    { scope, dependencies: [progress, reducedMotion] },
  );

  if (done) {
    return null;
  }

  return (
    <div className="preloader" ref={scope} aria-label="Loading Nué Solène">
      <div className="preloader-mark display" data-preloader-brand>
        {Array.from("Nué").map((letter, index) => (
          <span key={`${letter}-${index}`}>{letter}</span>
        ))}
      </div>
      <div className="preloader-count">{String(progress).padStart(3, "0")}</div>
    </div>
  );
}
