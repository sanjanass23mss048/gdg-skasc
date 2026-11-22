"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrPanel } from "./QrPanel";

type LiveSession = {
  id: string;
  eventTitle: string;
  token: string;
  active: boolean;
  radiusMeters: number;
  count: number;
};

export function ProjectorQr() {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch("/api/attendance/admin/sessions", { cache: "no-store" });
      if (cancelled) return;
      if (response.status === 401) {
        setError("Unlock the organizer console first, then open this projector page.");
        setLoading(false);
        return;
      }
      if (!response.ok) {
        setError("Could not load the live QR.");
        setLoading(false);
        return;
      }
      const data = (await response.json()) as { sessions: LiveSession[] };
      const live = data.sessions.find((item) => item.active) ?? null;
      setSession(live);
      setLoading(false);
    }
    void load();
    const timer = window.setInterval(() => void load(), 8000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!session?.active || typeof window === "undefined") {
      return;
    }
    const url = `${window.location.origin}/attend/${session.token}`;
    let cancelled = false;
    void QRCode.toDataURL(url, {
      margin: 1,
      width: 720,
      color: { dark: "#202124", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then((dataUrl) => {
      if (!cancelled) setQrDataUrl(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (loading) {
    return <p className="text-center text-ink">Loading QR…</p>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-[#202124]">QR projector</h1>
        <p className="mt-3 text-sm text-ink">{error}</p>
        <a href="/admin/attendance" className="mt-6 inline-block text-sm font-semibold text-gdg-blue">
          Open organizer console
        </a>
      </div>
    );
  }

  if (!session?.active || !qrDataUrl) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-[#202124]">No live QR</h1>
        <p className="mt-3 text-sm text-ink">
          Attendance is closed. Activate a session in the organizer console to show the event QR.
        </p>
        <a href="/admin/attendance" className="mt-6 inline-block text-sm font-semibold text-gdg-blue">
          Activate attendance
        </a>
      </div>
    );
  }

  const checkInUrl = typeof window === "undefined" ? "" : `${window.location.origin}/attend/${session.token}`;

  return (
    <div className="flex min-h-[calc(100svh-72px)] flex-col items-center justify-center px-4 py-10">
      <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-gdg-green uppercase">Scan to mark attendance</p>
      <QrPanel
        dataUrl={qrDataUrl}
        title={session.eventTitle}
        subtitle={`${session.count} checked in · stay within ${session.radiusMeters} m of this QR`}
        checkInUrl={checkInUrl}
        size="hero"
      />
    </div>
  );
}
