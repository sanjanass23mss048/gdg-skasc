import Image from "next/image";
import Link from "next/link";
import { about, site } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 pixel-grid relative overflow-hidden px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-lime uppercase">{about.eyebrow}</p>
          <h2 className="font-display mt-4 text-4xl text-white md:text-5xl">{about.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink md:text-lg">{about.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#practice" className="btn-pixel btn-pixel-primary">
              Learn more
            </Link>
            <a href={site.links.community} target="_blank" rel="noreferrer" className="btn-pixel btn-pixel-ghost">
              Chapter page
            </a>
          </div>
        </div>

        <div className="float-window relative aspect-[4/3] w-full overflow-hidden pixel-frame">
          <Image
            src="/branding/what-is-gdg.jpg"
            alt="What is GDG? A developer community by Google for students to learn, build and grow together"
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
