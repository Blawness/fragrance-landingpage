"use client";

import { ButtonHTMLAttributes, useRef } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export function MagneticButton({
  children,
  className = "",
  variant = "solid",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotionPref();

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (reducedMotion || event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.22}px, ${y * 0.34}px)`;
  }

  function onPointerLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  return (
    <button
      {...props}
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`magnetic-button ${variant} ${className}`}
    >
      <span>{children}</span>
    </button>
  );
}
