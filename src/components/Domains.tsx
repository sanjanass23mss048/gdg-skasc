"use client";

import Link from "next/link";
import { useState } from "react";
import { domains } from "@/lib/site";

const tones = {
  blue: {
    pill: "bg-gdg-blue text-white",
    panel: "border-gdg-blue/50 bg-gdg-blue/10",
    chip: "bg-gdg-blue text-white",
  },
  red: {
    pill: "bg-gdg-red text-white",
    panel: "border-gdg-red/50 bg-gdg-red/10",
    chip: "bg-gdg-red text-white",
  },
  yellow: {
    pill: "bg-gdg-yellow text-background",
    panel: "border-gdg-yellow/50 bg-gdg-yellow/10",
    chip: "bg-gdg-yellow text-background",
  },
};

export function Domains() {
  const [active, setActive] = useState<string | null>("technical");
  const selected = domains.find((domain) => domain.id === active) ?? null;

  return (
    <section id="domains" className="scroll-mt-24 pixel-grid px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-5xl lg:text-6xl">Domains</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink md:text-base">
          Tap a domain to open its crew, focus areas, and jump to the full team.
        </p>
      </div>

      <div
        className="mx-auto mt-10 flex w-full max-w-5xl flex-wrap items-center justify-center gap-4"
        role="tablist"
        aria-label="Chapter domains"
      >
        {domains.map((domain) => {
          const on = active === domain.id;
          return (
            <button
              key={domain.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`domain-panel-${domain.id}`}
              id={`domain-tab-${domain.id}`}
              onClick={() => setActive(domain.id)}
              className={`min-h-20 w-full max-w-md pixel-frame px-6 text-lg font-semibold transition duration-200 hover:-translate-y-1 md:text-xl lg:w-[30%] ${tones[domain.tone].pill} ${
                on ? "ring-2 ring-lime" : "opacity-85 hover:opacity-100"
              }`}
            >
              {domain.name}
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-10 w-full max-w-3xl" aria-live="polite">
        {selected ? (
          <div
            id={`domain-panel-${selected.id}`}
            role="tabpanel"
            aria-labelledby={`domain-tab-${selected.id}`}
            className={`pixel-frame px-6 py-7 text-left md:px-8 ${tones[selected.tone].panel}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">Domain</p>
                <h3 className="font-display mt-1 text-2xl md:text-3xl">{selected.name}</h3>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${tones[selected.tone].chip}`}>
                Active
              </span>
            </div>

            <p className="mt-4 text-base leading-7 text-white/90 md:text-lg">{selected.summary}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">What we run</p>
                <ul className="mt-3 space-y-2">
                  {selected.focus.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/90 md:text-base">
                      <span className="inline-block h-2 w-2 bg-lime" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">Leads in this domain</p>
                <ul className="mt-3 space-y-2">
                  {selected.people.map((person) => (
                    <li key={person} className="border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/95">
                      {person}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/team" className="btn-pixel btn-pixel-primary">
                Meet the team
              </Link>
              <Link href="/events" className="btn-pixel btn-pixel-ghost">
                See events
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
