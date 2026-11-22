"use client";

import { useRef, type ReactNode } from "react";

export function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(node.clientWidth * 0.8, 280), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        aria-label={label}
      >
        {children}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => move(-1)}
          className="grid h-11 w-11 place-items-center border border-white/20 bg-panel text-2xl text-white hover:border-lime hover:text-lime"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => move(1)}
          className="grid h-11 w-11 place-items-center border border-white/20 bg-panel text-2xl text-white hover:border-lime hover:text-lime"
        >
          ›
        </button>
      </div>
    </div>
  );
}
