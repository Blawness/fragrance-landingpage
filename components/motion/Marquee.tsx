"use client";

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index}>NUÉ</span>
        ))}
      </div>
    </div>
  );
}
