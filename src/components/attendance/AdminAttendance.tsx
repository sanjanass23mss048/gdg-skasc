"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { attendanceEvents, type AttendanceEventId } from "@/lib/attendance/catalog";
import { groupByDepartment } from "@/lib/attendance/departments";
import { venue } from "@/lib/attendance/venue";
import { QrPanel } from "./QrPanel";

type SessionRow = {
  id: string;
  eventId: string;
  eventTitle: string;
  token: string;
  active: boolean;
  createdAt: string;
  activatedAt: string | null;
  deactivatedAt: string | null;
  radiusMeters: number;
  count: number;
};

type RosterRow = {
  id: string;
  name: string;
  studentClass?: string;
  section?: string;
  registerNumber: string;
  department: string;
  email: string;
  checkedInAt: string;
  distanceMeters: number;
};

type DepartmentGroup = {
  department: string;
  count: number;
  records: RosterRow[];
};

async function fetchSessions(): Promise<
  { ok: true; sessions: SessionRow[] } | { ok: false; unauthorized: boolean }
> {
  const response = await fetch("/api/attendance/admin/sessions", { cache: "no-store" });
  if (response.status === 401) return { ok: false, unauthorized: true };
  if (!response.ok) return { ok: false, unauthorized: false };
  const data = (await response.json()) as { sessions: SessionRow[] };
  return { ok: true, sessions: data.sessions };
}

function readActivationLocation(): Promise<{ venueLat: number; venueLng: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("This browser cannot share location. Use Chrome or Safari on your phone."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          venueLat: position.coords.latitude,
          venueLng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Allow location for this site, then activate again from the event spot."));
        } else {
          reject(new Error("Could not read GPS. Step outdoors and try again."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  });
}

export function AdminAttendance() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [eventId, setEventId] = useState<AttendanceEventId>(attendanceEvents[0].id);
  const [customTitle, setCustomTitle] = useState("");
  const radiusMeters = venue.radiusMeters;
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [byDepartment, setByDepartment] = useState<DepartmentGroup[]>([]);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [openDept, setOpenDept] = useState<string | null>(null);

  const selected = useMemo(
    () => sessions.find((session) => session.id === selectedId) ?? sessions.find((session) => session.active) ?? null,
    [sessions, selectedId],
  );

  const checkInUrl = useMemo(() => {
    if (!selected || typeof window === "undefined") return "";
    return `${window.location.origin}/attend/${selected.token}`;
  }, [selected]);

  const visibleGroups = selected && authed ? byDepartment : [];
  const visibleQr = checkInUrl ? qrDataUrl : "";

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchSessions();
      if (cancelled) return;
      if (!result.ok) {
        setAuthed(false);
        setSessions([]);
        setLoading(false);
        if (!result.unauthorized) setError("Could not load sessions.");
        return;
      }
      setAuthed(true);
      setSessions(result.sessions);
      setSelectedId((current) => {
        if (current && result.sessions.some((item) => item.id === current)) return current;
        return result.sessions.find((item) => item.active)?.id ?? result.sessions[0]?.id ?? null;
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!checkInUrl) return;
    let cancelled = false;
    void QRCode.toDataURL(checkInUrl, {
      margin: 1,
      width: 320,
      color: { dark: "#202124", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [checkInUrl]);

  useEffect(() => {
    if (!selected || !authed) return;
    let cancelled = false;
    void fetch(`/api/attendance/admin/sessions/${selected.id}/roster`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { records?: RosterRow[]; byDepartment?: DepartmentGroup[] }) => {
        if (cancelled) return;
        const records = data.records ?? [];
        setRoster(records);
        const groups = data.byDepartment ?? groupByDepartment(records);
        setByDepartment(groups);
        setOpenDept((current) => current ?? groups[0]?.department ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setRoster([]);
          setByDepartment([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selected, authed, reloadKey]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/attendance/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!response.ok) {
      setError("Wrong password.");
      return;
    }
    setPassword("");
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  async function onLogout() {
    await fetch("/api/attendance/admin/logout", { method: "POST" });
    setAuthed(false);
    setSessions([]);
    setSelectedId(null);
    setRoster([]);
    setByDepartment([]);
    setOpenDept(null);
  }

  async function activate() {
    setBusy(true);
    setError("");
    try {
      const location = await readActivationLocation();
      const response = await fetch("/api/attendance/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, customTitle, ...location }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; session?: SessionRow }
        | null;
      if (!response.ok || !data?.session) {
        setError(data?.error || "Could not open attendance.");
        return;
      }
      setSelectedId(data.session.id);
      setReloadKey((value) => value + 1);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not read GPS.");
    } finally {
      setBusy(false);
    }
  }

  async function setActive(id: string, active: boolean) {
    setBusy(true);
    setError("");
    try {
      const location = active ? await readActivationLocation() : null;
      const response = await fetch(`/api/attendance/admin/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active, ...location }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error || "Could not update the session.");
        return;
      }
      setReloadKey((value) => value + 1);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not read GPS.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-ink">Checking organizer access…</p>;
  }

  if (!authed) {
    return (
      <form onSubmit={onLogin} className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-[0_16px_40px_rgba(32,33,36,0.08)]">
        <h1 className="text-2xl font-bold text-[#202124]">Event attendance</h1>
        <p className="mt-2 text-sm leading-6 text-ink">
          Hidden organizer console. Open this only on event day, activate a session, then project or print the QR.
        </p>
        <label className="mt-8 block text-sm font-medium text-[#202124]" htmlFor="password">
          Organizer password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#202124] outline-none focus:border-gdg-blue"
          autoComplete="current-password"
          required
        />
        {error ? <p className="mt-3 text-sm text-gdg-red">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-gdg-blue px-5 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
        >
          Unlock
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#202124]">Live attendance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink">
            Attendance is QR-based and stays closed until you activate a session. Project the QR, students scan it with
            their phone camera, then GPS near the activation spot confirms the check-in.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/attendance/qr"
            className="rounded-full bg-gdg-blue px-4 py-2 text-sm font-medium text-white hover:bg-[#174ea6]"
          >
            Open projector QR
          </a>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:border-gdg-blue"
          >
            Lock console
          </button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(32,33,36,0.08)]">
          <h2 className="text-xl font-bold text-[#202124]">Open a session</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-[#202124]" htmlFor="event">
              Event
            </label>
            <select
              id="event"
              value={eventId}
              onChange={(event) => setEventId(event.target.value as AttendanceEventId)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#202124] outline-none focus:border-gdg-blue"
            >
              {attendanceEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {eventId === "custom-session" ? (
              <input
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
                placeholder="Custom session title"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#202124] outline-none focus:border-gdg-blue"
              />
            ) : null}
            <p className="rounded-xl bg-[#f7f8fa] px-4 py-3 text-sm text-ink">
              Activate from the hall or booth (phone GPS is best; laptop Wi‑Fi location also works if you Allow
              location). That spot becomes the center — students must be within{" "}
              <span className="font-semibold text-[#202124]">{radiusMeters} m</span> of it.
            </p>
            {error ? <p className="text-sm text-gdg-red">{error}</p> : null}
            <button
              type="button"
              disabled={busy}
              onClick={() => void activate()}
              className="rounded-full bg-gdg-green px-6 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
            >
              {busy ? "Reading GPS…" : "Activate attendance"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-navy p-6 text-white shadow-[0_16px_40px_rgba(32,33,36,0.18)]">
          {selected ? (
            <>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/70">
                {selected.active ? "Live now" : "Closed"}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{selected.eventTitle}</h2>
              <p className="mt-1 text-sm text-white/80">
                {selected.count} marked · {selected.radiusMeters} m radius
              </p>
              {selected.active && visibleQr ? (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-gdg-yellow uppercase">
                    Students scan this QR
                  </p>
                  <QrPanel
                    dataUrl={visibleQr}
                    title={selected.eventTitle}
                    checkInUrl={checkInUrl}
                  />
                </div>
              ) : (
                <p className="mt-6 text-sm text-white/80">Activate this session to generate the attendance QR.</p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {selected.active ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void setActive(selected.id, false)}
                    className="rounded-full bg-gdg-red px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase"
                  >
                    Close attendance
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void setActive(selected.id, true)}
                    className="rounded-full bg-gdg-blue px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase"
                  >
                    Re-open
                  </button>
                )}
                <a
                  href={`/api/attendance/admin/sessions/${selected.id}/roster?format=csv`}
                  className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase"
                >
                  Export CSV
                </a>
                <a
                  href={`/api/attendance/admin/sessions/${selected.id}/roster?format=od`}
                  className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase"
                >
                  Export OD Form
                </a>
              </div>
            </>
          ) : (
            <p className="text-sm text-white/80">No sessions yet. Activate one to generate a QR.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(32,33,36,0.08)]">
          <h2 className="text-xl font-bold text-[#202124]">Sessions</h2>
          <ul className="mt-4 space-y-3">
            {sessions.length === 0 ? <li className="text-sm text-ink">None yet.</li> : null}
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(session.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selected?.id === session.id ? "border-gdg-blue bg-[#e8f0fe]" : "border-black/5 hover:border-black/15"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#202124]">{session.eventTitle}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase ${
                        session.active ? "bg-gdg-green text-white" : "bg-gray-200 text-ink"
                      }`}
                    >
                      {session.active ? "Live" : "Off"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink">
                    {session.count} present · {new Date(session.createdAt).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(32,33,36,0.08)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#202124]">Roster by department</h2>
              <p className="mt-1 text-sm text-ink">
                {roster.length} present · {visibleGroups.length} department{visibleGroups.length === 1 ? "" : "s"}
              </p>
            </div>
            {selected ? (
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/api/attendance/admin/sessions/${selected.id}/roster?format=csv`}
                  className="text-xs font-semibold tracking-[0.12em] text-gdg-blue uppercase"
                >
                  Export as Attendance – Department Wise
                </a>
                <a
                  href={`/api/attendance/admin/sessions/${selected.id}/roster?format=od`}
                  className="text-xs font-semibold tracking-[0.12em] text-gdg-blue uppercase"
                >
                  Export as OD Form – Department Wise
                </a>
              </div>
            ) : null}
          </div>

          {visibleGroups.length === 0 ? (
            <p className="mt-6 text-sm text-ink">No check-ins yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {visibleGroups.map((group) => (
                  <button
                    key={group.department}
                    type="button"
                    onClick={() => setOpenDept(group.department)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase transition ${
                      openDept === group.department
                        ? "bg-gdg-blue text-white"
                        : "bg-[#f1f3f4] text-ink hover:bg-[#e8eaed]"
                    }`}
                  >
                    {group.department} · {group.count}
                  </button>
                ))}
              </div>

              {visibleGroups
                .filter((group) => group.department === openDept)
                .map((group) => (
                  <div key={group.department} className="overflow-x-auto rounded-2xl border border-black/5">
                    <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-[#f8f9fa] px-4 py-3">
                      <h3 className="font-semibold text-[#202124]">{group.department}</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink">
                        {group.count} student{group.count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-xs tracking-[0.12em] text-ink uppercase">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Name</th>
                          <th className="px-4 py-3 font-semibold">Class</th>
                          <th className="px-4 py-3 font-semibold">Section</th>
                          <th className="px-4 py-3 font-semibold">Roll No</th>
                          <th className="px-4 py-3 font-semibold">College ID</th>
                          <th className="px-4 py-3 font-semibold">Timing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.records.map((row) => (
                          <tr key={row.id} className="border-t border-black/5">
                            <td className="px-4 py-3 font-medium text-[#202124]">{row.name}</td>
                            <td className="px-4 py-3">{row.studentClass || "—"}</td>
                            <td className="px-4 py-3">{row.section || "—"}</td>
                            <td className="px-4 py-3">{row.registerNumber}</td>
                            <td className="px-4 py-3">{row.email || "—"}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(row.checkedInAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
