"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { product } from "@/data/product";
import { getSection } from "@/data/sections";
import { setupGsap } from "@/lib/gsap";
import { useImageSequence } from "@/hooks/useImageSequence";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

export function ProductSequence() {
  const scope = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const { frames, ready } = useImageSequence(product.sequence);
  const [caption, setCaption] = useState("Top: Bergamot · Pink Pepper");
  const reducedMotion = useReducedMotionPref();
  const copy = getSection("sequence");

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = frames[0];
    if (!canvas || !image) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * ratio;
    const height = canvas.clientHeight * ratio;
    canvas.width = width;
    canvas.height = height;
    drawCover(context, image, width, height);
  }, [frames]);

  useGSAP(
    () => {
      if (!scope.current || !canvasRef.current || frames.length === 0) return;
      const gsap = setupGsap();
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const drawFrame = (progress: number) => {
        const index = Math.min(frames.length - 1, Math.floor(progress * (frames.length - 1)));
        const ratio = window.devicePixelRatio || 1;
        const width = canvas.clientWidth * ratio;
        const height = canvas.clientHeight * ratio;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        drawCover(context, frames[index], width, height);

        const active =
          copy?.captions?.reduce((current, item) => {
            return progress >= item.atProgress ? item.text : current;
          }, copy.captions[0]?.text ?? "") ?? "";
        setCaption(active);
      };

      if (reducedMotion) {
        drawFrame(0.5);
        return;
      }

      drawFrame(0);
      gsap.to(
        { progress: 0 },
        {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => drawFrame(self.progress),
          },
        },
      );
    },
    { scope, dependencies: [frames, reducedMotion, copy] },
  );

  return (
    <section className="sequence-scene" ref={scope} aria-labelledby="sequence-title">
      <div className="sequence-inner">
        <p className="eyebrow">Centerpiece</p>
        <h2 id="sequence-title" className="display">
          Bottle in motion
        </h2>
        <canvas ref={canvasRef} aria-label="Animated Solène bottle sequence" />
        {!ready && <p className="sequence-loading">Preparing frames</p>}
        <p className="sequence-caption" ref={captionRef}>
          {caption}
        </p>
      </div>
    </section>
  );
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (canvasWidth - width) / 2;
  const y = (canvasHeight - height) / 2;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, width, height);
}
