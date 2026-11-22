"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

export function ContactSection() {
  const [error, setError] = useState("");
  const [sentName, setSentName] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Add your name, email, and a message.");
      setSentName("");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email does not look complete.");
      setSentName("");
      return;
    }
    if (phone && phone.replace(/\D/g, "").length < 10) {
      setError("Add a 10-digit phone number, or leave it blank.");
      setSentName("");
      return;
    }

    setError("");
    setSentName(name);
    event.currentTarget.reset();
    window.open(site.links.community, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="scroll-mt-24 pixel-grid relative overflow-hidden pb-16 pt-24">
      <div className="pointer-events-none absolute top-10 right-0 h-40 w-40 bg-violet/30 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-xl px-6">
        <h2 className="font-display text-center text-3xl text-white md:text-left md:text-4xl">Send us a message</h2>
        <form className="mt-10 flex flex-col gap-7" onSubmit={onSubmit} noValidate>
          <Field id="name" name="name" label="Your name" type="text" autoComplete="name" />
          <Field id="email" name="email" label="Email address" type="email" autoComplete="email" />
          <Field id="phone" name="phone" label="Phone" type="tel" autoComplete="tel" />
          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Message"
              className="w-full resize-y border-b border-white/20 bg-transparent py-3 text-white outline-none placeholder:text-white/35 focus:border-lime"
            />
          </div>
          {error ? <p className="text-sm text-gdg-red">{error}</p> : null}
          {sentName ? (
            <p className="text-sm text-lime" role="status">
              Thanks, {sentName}. Your mail app should open with this note addressed to the chapter.
            </p>
          ) : null}
          <button type="submit" className="btn-pixel btn-pixel-primary mx-auto">
            Submit
          </button>
        </form>
      </div>

      <div className="relative z-10 mx-auto mt-16 w-full max-w-5xl px-8 md:px-16">
        <h2 className="font-display text-xl text-white md:text-2xl">
          GDG on Campus Sri Krishna Arts &amp; Science College
        </h2>
        <p className="mt-2 text-sm text-ink md:text-base">
          Coimbatore, India · {site.memberCount.toLocaleString()} members
        </p>
        {site.address.map((line) => (
          <p key={line} className="text-sm text-ink md:text-lg">
            {line}
          </p>
        ))}
        <a
          href={site.website}
          className="mt-3 inline-block text-sm text-lime md:text-lg break-all"
          target="_blank"
          rel="noreferrer"
        >
          {site.website}
        </a>
      </div>

      <div className="relative z-10 mt-16 mb-6 flex flex-col items-center">
        <p className="mb-8 font-display text-2xl text-white">Follow us on</p>
        <div className="flex items-center gap-4">
          <Social href={site.links.linkedin} label="LinkedIn">
            <path
              fill="currentColor"
              d="M6.5 9H3.7v11.3h2.8V9ZM5.1 3.7A1.7 1.7 0 1 0 5.12 7.1 1.7 1.7 0 0 0 5.1 3.7ZM20.3 20.3h-2.8v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H10.8V9h2.7v1.5h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4v6.9Z"
            />
          </Social>
          <Social href={site.links.community} label="GDG community page">
            <path
              fill="currentColor"
              d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm6.7 8h-2.3a14 14 0 0 0-1.1-4.1A7.03 7.03 0 0 1 18.7 11ZM12 5c.6.8 1.4 2.4 1.7 4.5h-3.4C10.6 7.4 11.4 5.8 12 5ZM5.3 13a7 7 0 0 1 0-2h2.5a15 15 0 0 0 0 2H5.3Zm.9 2h2.3a14 14 0 0 0 1.1 4.1A7.03 7.03 0 0 1 6.2 15Zm2.3-6H6.2a7.03 7.03 0 0 1 3.4-4.1A14 14 0 0 0 8.5 9ZM12 19c-.6-.8-1.4-2.4-1.7-4.5h3.4C13.4 16.6 12.6 18.2 12 19Zm2.1-6.5H9.9a13 13 0 0 1 0-2h4.2a13 13 0 0 1 0 2Zm.4 6.6A14 14 0 0 0 15.5 15h2.3a7.03 7.03 0 0 1-3.4 4.1Z"
            />
          </Social>
          <Social href={site.links.college} label="SKASC website">
            <path
              fill="currentColor"
              d="M12 4 3 8.5 12 13l8-4v6h2v-6.5L12 4Zm-6 8.2V16c0 .8 2.7 2.5 6 2.5s6-1.7 6-2.5v-3.8l-6 3-6-3Z"
            />
          </Social>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={label}
        className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none placeholder:text-white/35 focus:border-lime"
      />
    </div>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-12 w-12 place-items-center border border-white/15 bg-panel text-white transition hover:border-lime hover:text-lime"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
