import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Domains } from "@/components/Domains";
import { Hero } from "@/components/Hero";
import { HomeEvents } from "@/components/HomeEvents";
import { WhatWeDo } from "@/components/WhatWeDo";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <WhatWeDo />
      <Domains />
      <HomeEvents />
      <ContactSection />
    </main>
  );
}
