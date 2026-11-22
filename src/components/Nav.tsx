"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/#about", label: "About us" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Our team" },
  { href: "/#contact", label: "Contact" },
];

function tone(href: string, pathname: string) {
  if (href === "/events" && pathname.startsWith("/events")) return "text-lime";
  if (href === "/team" && pathname.startsWith("/team")) return "text-lime";
  return "text-white/75 hover:text-lime";
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const quiet = pathname.startsWith("/attend") || pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 md:px-10">
        <Logo />
        {quiet ? (
          <p className="text-xs font-semibold tracking-[0.16em] text-ink uppercase">
            {pathname.startsWith("/admin") ? "Organizer" : "Check-in"}
          </p>
        ) : (
          <>
            <nav className="hidden items-center gap-10 pr-4 md:flex" aria-label="Primary">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={tone(link.href, pathname) === "text-lime" ? "page" : undefined}
                  className={`text-xs font-semibold tracking-[0.16em] uppercase ${tone(link.href, pathname)}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center text-white md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-4 bg-current" />
              </span>
            </button>
          </>
        )}
      </div>
      {!quiet && open ? (
        <nav
          className="absolute inset-x-0 top-[72px] flex flex-col gap-1 border-b border-white/10 bg-panel px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-3 text-xs font-semibold tracking-[0.16em] uppercase ${tone(link.href, pathname)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
