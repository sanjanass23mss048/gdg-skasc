import Link from "next/link";
import { events, upcomingEvent } from "@/lib/site";
import { Carousel } from "./Carousel";

const wash = {
  blue: "from-gdg-blue to-[#174ea6]",
  red: "from-gdg-red to-[#a50e0e]",
  yellow: "from-gdg-yellow to-[#f29900] text-background",
  green: "from-gdg-green to-[#0d652d]",
};

export function HomeEvents() {
  return (
    <section className="bg-panel px-6 py-20 md:px-12" aria-label="Chapter events">
      <div className="mx-auto mb-10 max-w-5xl pixel-frame bg-panel-2 px-6 py-8 text-white md:px-10">
        <p className="text-xs font-semibold tracking-[0.16em] text-lime uppercase">
          {upcomingEvent.tag} · {upcomingEvent.status}
        </p>
        <h2 className="font-display mt-2 text-2xl md:text-3xl">{upcomingEvent.title}</h2>
        <p className="mt-2 text-sm font-medium text-white/75">{upcomingEvent.date}</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/85 md:text-base">{upcomingEvent.blurb}</p>
        <a
          href={upcomingEvent.href}
          target="_blank"
          rel="noreferrer"
          className="btn-pixel btn-pixel-primary mt-6"
        >
          {upcomingEvent.action}
        </a>
      </div>

      <p className="mb-6 text-center text-xs font-semibold tracking-[0.16em] text-ink uppercase">Past events</p>
      <Carousel label="Past campus events">
        {events.map((event) => (
          <article
            key={event.title}
            className={`relative flex min-h-[280px] w-[82%] shrink-0 snap-center flex-col justify-end overflow-hidden pixel-frame bg-gradient-to-br p-8 text-white sm:w-[48%] lg:w-[32%] ${wash[event.tone]}`}
          >
            <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-80">{event.tag}</p>
            <h3 className="font-display mt-2 text-2xl">{event.title}</h3>
            <p className="mt-2 text-sm font-medium">{event.date}</p>
            <Link href="/events" className="mt-6 text-sm font-semibold underline underline-offset-4">
              See workshops
            </Link>
          </article>
        ))}
      </Carousel>
    </section>
  );
}
