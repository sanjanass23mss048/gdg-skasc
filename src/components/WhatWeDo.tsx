import { about } from "@/lib/site";

const pillars = [
  { label: "Learn", tone: "bg-gdg-blue" },
  { label: "Build", tone: "bg-gdg-red" },
  { label: "Connect", tone: "bg-violet" },
  { label: "Grow", tone: "bg-lime text-background" },
] as const;

export function WhatWeDo() {
  return (
    <section id="practice" className="scroll-mt-24 relative overflow-hidden bg-panel px-6 py-24">
      <div className="pointer-events-none absolute -top-10 right-10 h-28 w-28 bg-lime/20 blur-2xl" aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display max-w-2xl text-4xl text-white md:text-5xl">{about.practiceTitle}</h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-ink md:text-xl">{about.practice}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.label}
              className={`pixel-frame px-5 py-8 ${pillar.tone} ${index === 3 ? "blink-lime" : ""}`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="font-display text-3xl">&gt; {pillar.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
