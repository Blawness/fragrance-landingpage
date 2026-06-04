"use client";

import { useEffect, useMemo, useState } from "react";
import { generatedBottleFrame } from "@/lib/sequence";
import type { ImageSequence } from "@/types";
import { useReducedMotionPref } from "./useReducedMotionPref";

export function useImageSequence(sequence: ImageSequence) {
  const reducedMotion = useReducedMotionPref();
  const [isMobile, setIsMobile] = useState(false);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(query.matches);
    onChange();
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  const count = useMemo(() => {
    if (reducedMotion) return 4;
    return isMobile ? sequence.frameCountMobile : sequence.frameCount;
  }, [isMobile, reducedMotion, sequence.frameCount, sequence.frameCountMobile]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setReady(false);
      }
    });

    const images = Array.from({ length: count }, (_, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = generatedBottleFrame(index, count);
      return image;
    });

    Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }
            image.onload = () => resolve();
            image.onerror = () => resolve();
          }),
      ),
    ).then(() => {
      if (!cancelled) {
        setFrames(images);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [count]);

  return { frames, count, ready };
}
