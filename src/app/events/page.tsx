import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { WorkshopSlides } from "@/components/WorkshopSlides";
import { events, teach, upcomingEvent } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past GDG on Campus SKASC events from the official chapter page.",
};

const iconWrap = {
  blue: "bg-gdg-blue",
  red: "bg-gdg-red",
  yellow: "bg-gdg-yellow text-background",
  green: "bg-gdg-green",
};

export default function EventsPage() {
  return (
    <main id="main">
      <header className="pixel-grid px-6 pt-16 pb-8 text-center">
        <h1 className="font-display text-4xl text-white md:text-5xl">Events</h1>
      </header>
      <div className="flex h-2.5 w-full" aria-hidden="true">
        <span className="h-full flex-1 bg-gdg-yellow" />
        <span className="h-full flex-1 bg-gdg-blue" />
        <span className="h-full flex-1 bg-gdg-red" />
        <span className="h-full flex-1 bg-lime" />
      </div>

      <section className="grid min-h-[70vh] lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-panel-2 px-8 py-16 text-white md:px-16">
          <h2 className="font-display text-center text-2xl md:text-3xl">{teach.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-ink md:text-base">
            Google works with students through campus groups like ours. At SKASC, GDG on Campus is here to:
          </p>
          <ol className="mx-auto mt-4 max-w-xl list-decimal space-y-2 pl-5 text-sm leading-7 text-white/90 md:text-base">
            {teach.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink md:text-base">{teach.note}</p>
        </div>
        <WorkshopSlides />
      </section>

      <section className="bg-panel px-6 py-16">
        <div className="mx-auto max-w-4xl pixel-frame bg-panel-2 px-6 py-8 text-white md:px-10">
          <p className="text-xs font-semibold tracking-[0.16em] text-lime uppercase">
            Upcoming · {upcomingEvent.status}
          </p>
          <h2 className="font-display mt-2 text-2xl md:text-3xl">{upcomingEvent.title}</h2>
          <p className="mt-2 text-sm text-white/75">{upcomingEvent.date}</p>
          <p className="mt-4 text-sm leading-6 text-white/85 md:text-base">{upcomingEvent.blurb}</p>
          <a
            href={upcomingEvent.href}
            target="_blank"
            rel="noreferrer"
            className="btn-pixel btn-pixel-primary mt-6"
          >
            {upcomingEvent.action}
          </a>
        </div>
      </section>

      <section className="pixel-grid relative overflow-hidden px-6 py-24">
        <div className="relative mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl text-white md:text-4xl">Past events</h2>
        </div>
        <div className="relative mx-auto mt-16 grid max-w-5xl gap-x-8 gap-y-16 sm:grid-cols-2">
          {events.map((event) => (
            <article key={event.title} className="relative mt-10 pixel-frame bg-panel px-6 pt-16 pb-8 text-center">
              <div
                className={`absolute top-0 left-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center border-2 border-white/20 ${iconWrap[event.tone]} ${event.tone === "yellow" ? "" : "text-white"}`}
              >
                <Icon name={event.icon} />
              </div>
              <p className="mx-auto w-fit bg-white/10 px-3 py-1 text-xs font-medium text-white/80">{event.tag}</p>
              <h3 className="mt-3 font-display text-lg text-white">{event.title}</h3>
              <p className="mt-2 text-sm text-ink">{event.date}</p>
              <p className="mt-3 text-sm leading-6 text-ink">{event.blurb}</p>
              <a
                href={event.href}
                target="_blank"
                rel="noreferrer"
                className="btn-pixel btn-pixel-primary mt-5"
              >
                {event.action}
              </a>
            </article>
          ))}
        </div>
      </section>

      <ContactSection />
    </main>
  );
}

function Icon({ name }: { name: "spark" | "code" | "sprint" | "ai" | "cloud" }) {
  const common = "h-10 w-10";
  if (name === "cloud") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path fill="currentColor" d="M7 18h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.5 3.5 0 0 0 7 18Z" />
      </svg>
    );
  }
  if (name === "code") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path fill="currentColor" d="M8.2 16.6 3.6 12l4.6-4.6 1.4 1.4L6.4 12l3.2 3.2-1.4 1.4Zm7.6 0-1.4-1.4 3.2-3.2-3.2-3.2 1.4-1.4L20.4 12l-4.6 4.6ZM13.2 5l-2.4 14h-1.6l2.4-14h1.6Z" />
      </svg>
    );
  }
  if (name === "ai") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path fill="currentColor" d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 3.2 4.5 2.5L12 11.2 7.5 8.7 12 6.2ZM6 10.2l5 2.8v5.3l-5-2.8v-5.3Zm7 8.1v-5.3l5-2.8v5.3l-5 2.8Z" />
      </svg>
    );
  }
  if (name === "sprint") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path fill="currentColor" d="M4 18h4l2-6 3 3 2-5 5 8h2L14 6l-3 7-2-3-2 6H4Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
      <path fill="currentColor" d="M12 2s1 4 4 6 6 2 6 2-3 1-4 4-2 6-2 6-1-4-4-6-6-2-6-2 3-1 4-4 2-6 2-6Z" />
    </svg>
  );
}
