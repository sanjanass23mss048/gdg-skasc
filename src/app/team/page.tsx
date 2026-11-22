import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { domains, members, organisers, site, teamIntro } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our team",
  description: "Organisers and leads for GDG on Campus at Sri Krishna Arts and Science College.",
};

const tones = {
  blue: "bg-gdg-blue text-white",
  red: "bg-gdg-red text-white",
  yellow: "bg-gdg-yellow text-background",
  green: "bg-gdg-green text-white",
} as const;

type Person = (typeof organisers)[number] | (typeof members)[number];

const photoFocus: Record<string, string> = {
  Dharsitha: "object-[center_22%]",
  "Pragathi P": "object-[center_20%]",
  "Prathiksha J": "object-[center_16%]",
  "Abdul Munaf": "object-[center_15%]",
  "Likhith Sai N": "object-center",
  "Sanjana S S": "object-[center_18%]",
};

function Portrait({
  person,
  size,
  priority = false,
}: {
  person: Person;
  size: "lg" | "md" | "sm";
  priority?: boolean;
}) {
  const box =
    size === "lg" ? "h-44 w-44 md:h-52 md:w-52" : size === "md" ? "h-36 w-36 md:h-40 md:w-40" : "h-28 w-28 md:h-32 md:w-32";
  const imgSize = size === "lg" ? "208px" : size === "md" ? "160px" : "128px";

  if (person.photo) {
    return (
      <div className={`relative ${box} shrink-0 overflow-hidden border-2 border-white/20`}>
        <Image
          src={person.photo}
          alt={person.name}
          fill
          priority={priority}
          sizes={imgSize}
          className={`object-cover ${photoFocus[person.name] ?? "object-center"}`}
        />
      </div>
    );
  }

  return (
    <div className={`grid ${box} shrink-0 place-items-center border-2 border-white/15 text-2xl font-bold ${tones[person.tone]}`}>
      {person.initials}
    </div>
  );
}

function PersonMeta({ person, align = "center" }: { person: Person; align?: "center" | "left" }) {
  return (
    <div className={`mt-4 flex min-w-0 flex-col gap-2 ${align === "center" ? "items-center text-center" : "items-start text-left"}`}>
      <h3 className="text-lg leading-tight font-bold text-white md:text-xl">{person.name}</h3>
      <p className="max-w-[18rem] text-xs leading-snug font-semibold tracking-[0.08em] text-lime uppercase md:text-sm">
        {person.role}
      </p>
    </div>
  );
}

export default function TeamPage() {
  return (
    <main id="main">
      <section className="relative -mt-[72px] min-h-[100svh] overflow-hidden bg-background pt-[72px]">
        <Image
          src="/branding/gdg-on-campus-skasc.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="pixel-grid grid-drift absolute inset-0 opacity-35 mix-blend-soft-light" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-5xl flex-col justify-end px-6 pb-16 md:px-10 md:pb-24">
          <p className="font-display text-4xl leading-none text-white sm:text-5xl md:text-7xl">{site.name}</p>
          <h1 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-white/95 md:text-3xl">Our team</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 md:text-base">{teamIntro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#heads" className="btn-pixel btn-pixel-primary">
              Meet the heads
            </a>
            <a href="#leads" className="btn-pixel btn-pixel-ghost">
              Browse leads
            </a>
          </div>
        </div>
      </section>

      <section id="heads" className="scroll-mt-24 pixel-grid px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-lime uppercase">Chapter leadership</p>
            <h2 className="font-display mt-3 text-4xl text-white md:text-5xl">Heads</h2>
            <p className="mt-4 text-sm leading-7 text-ink md:text-base">
              Official GDGoC organizers, co-lead, and technical lead steering the chapter year.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {organisers.map((person, index) => (
              <article key={person.name} className="flex flex-col items-center">
                <Portrait person={person} size="md" priority={index < 3} />
                <PersonMeta person={person} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="leads" className="scroll-mt-24 bg-panel px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-lime uppercase">Domain crews</p>
              <h2 className="font-display mt-3 text-4xl text-white md:text-5xl">Leads</h2>
              <p className="mt-4 text-sm leading-7 text-ink md:text-base">
                The people running workshops, creatives, outreach, and ops across campus.
              </p>
            </div>
            <p className="text-sm text-white/45">{members.length} leads</p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {members.map((person) => (
              <article key={person.name} className="flex flex-col items-center">
                <Portrait person={person} size="md" />
                <PersonMeta person={person} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-white md:text-4xl">Domains</h2>
            <p className="mt-3 text-sm leading-7 text-ink md:text-base">
              Three chapter tracks — jump to the home domains board for crews and focus areas.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {domains.map((domain) => (
              <Link
                key={domain.id}
                href={`/#domains`}
                className={`pixel-frame min-h-24 px-5 py-6 text-lg font-semibold transition duration-200 hover:-translate-y-1 ${tones[domain.tone]}`}
              >
                {domain.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
