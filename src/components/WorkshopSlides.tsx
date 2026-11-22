"use client";

import { useState } from "react";

const slides = [
  {
    title: "Build with AI",
    caption: "Map a problem, then ship a small prototype.",
    scene: "nodes" as const,
  },
  {
    title: "Cloud study jam",
    caption: "Labs you finish with a badge, not a screenshot.",
    scene: "cloud" as const,
  },
  {
    title: "Campus workshop",
    caption: "A hall, a laptop, and someone willing to debug with you.",
    scene: "room" as const,
  },
];

export function WorkshopSlides() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function step(direction: number) {
    setIndex((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <div className="relative min-h-[420px] bg-[#dfe7f1] lg:min-h-full">
      <Scene kind={slide.scene} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase">Workshop</p>
        <p className="text-2xl font-bold">{slide.title}</p>
        <p className="max-w-md text-sm text-white/90">{slide.caption}</p>
      </div>
      <div className="absolute top-1/2 left-4 flex -translate-y-1/2 gap-2">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => step(-1)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-[#3c4043] shadow"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => step(1)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-[#3c4043] shadow"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function Scene({ kind }: { kind: "nodes" | "cloud" | "room" }) {
  if (kind === "cloud") {
    return (
      <svg viewBox="0 0 800 640" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="800" height="640" fill="#e8f0fe" />
        <ellipse cx="400" cy="280" rx="180" ry="90" fill="#fff" />
        <ellipse cx="300" cy="300" rx="110" ry="70" fill="#fff" />
        <ellipse cx="500" cy="300" rx="120" ry="74" fill="#fff" />
        <circle cx="250" cy="250" r="36" fill="#4285F4" />
        <circle cx="330" cy="230" r="28" fill="#EA4335" />
        <circle cx="470" cy="220" r="30" fill="#FBBC04" />
        <circle cx="540" cy="260" r="34" fill="#34A853" />
      </svg>
    );
  }
  if (kind === "room") {
    return (
      <svg viewBox="0 0 800 640" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="800" height="640" fill="#f6f1e7" />
        <rect x="80" y="80" width="420" height="240" rx="12" fill="#202124" />
        <rect x="100" y="100" width="380" height="180" fill="#4285F4" />
        <rect x="160" y="360" width="480" height="20" fill="#8d6e63" />
        <circle cx="260" cy="330" r="36" fill="#f1c7a4" />
        <rect x="230" y="360" width="64" height="90" rx="16" fill="#ea4335" />
        <circle cx="420" cy="336" r="36" fill="#c68642" />
        <rect x="390" y="366" width="64" height="90" rx="16" fill="#34a853" />
        <circle cx="560" cy="330" r="36" fill="#e0ac7a" />
        <rect x="530" y="360" width="64" height="90" rx="16" fill="#fbbc04" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 800 640" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="640" fill="#eef3f8" />
      <circle cx="220" cy="220" r="46" fill="#7baaf7" />
      <circle cx="400" cy="160" r="46" fill="#f28b82" />
      <circle cx="560" cy="250" r="46" fill="#81c995" />
      <circle cx="330" cy="360" r="46" fill="#fdd663" />
      <circle cx="500" cy="400" r="40" fill="#c58af9" />
      <path d="M220 220 L400 160 L560 250 L500 400 L330 360 Z" fill="none" stroke="#5f6368" strokeWidth="6" />
      <path d="M400 160 L330 360" stroke="#5f6368" strokeWidth="4" />
    </svg>
  );
}
