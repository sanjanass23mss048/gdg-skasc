import type { Metadata } from "next";
import { Pixelify_Sans, Sora } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { Nav } from "@/components/Nav";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

export const metadata: Metadata = {
  title: {
    default: "GDG SKASC",
    template: "%s · GDG SKASC",
  },
  description:
    "GDG on Campus Sri Krishna Arts & Science College - Coimbatore. Big ideas start with curious minds. Join 2,600+ members for workshops, TechSprint, and Solution Challenge.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${pixelify.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <a
          href="#main"
          className="absolute top-3 left-3 z-50 -translate-y-24 bg-lime px-4 py-2 text-sm font-semibold text-background shadow focus:translate-y-0"
        >
          Skip to content
        </a>
        <Suspense fallback={<div className="h-[72px] border-b border-white/10 bg-background/80" aria-hidden="true" />}>
          <Nav />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
