import Image from "next/image";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[680px] overflow-hidden bg-background">
      <Image
        src="/branding/gdg-on-campus-skasc.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/35" />
      <div className="pixel-grid grid-drift absolute inset-0 opacity-40 mix-blend-soft-light" aria-hidden="true" />

      <div className="relative z-10 flex h-full max-w-6xl flex-col justify-center px-6 md:px-12">
        <p className="text-xs font-semibold tracking-[0.18em] text-lime uppercase">{site.tagline}</p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
          {site.name}
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">{site.headline}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={site.links.join} target="_blank" rel="noreferrer" className="btn-pixel btn-pixel-primary">
            Join us
          </a>
          <a href="/events" className="btn-pixel btn-pixel-ghost">
            Upcoming events
          </a>
        </div>
      </div>

      <div className="float-window absolute right-6 bottom-8 hidden w-[220px] pixel-frame bg-panel-2 p-4 text-sm text-white md:block lg:right-12 lg:w-[260px]">
        <p className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Chapter loop</p>
        <ul className="mt-3 space-y-2 font-display text-lg">
          <li>&gt; Learn</li>
          <li>&gt; Build</li>
          <li>&gt; Connect</li>
          <li className="blink-lime">
            <span className="pixel-chip px-1">&gt; Grow</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
