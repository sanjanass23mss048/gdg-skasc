"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getClientDeviceId } from "@/lib/attendance/clientDevice";
import { collegeEmailDomain, collegeIdError } from "@/lib/attendance/collegeId";
import { departments } from "@/lib/attendance/departments";

type SessionInfo = {
  active: boolean;
  eventTitle: string;
  radiusMeters: number;
  venueName: string;
  maxAccuracyMeters: number;
  alreadyCheckedIn?: boolean;
  checkedInAt?: string | null;
};

type Props = {
  token: string;
};

type GeoPoint = {
  lat: number;
  lng: number;
  accuracy: number;
};

function formatTiming(date: Date) {
  return date.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function CheckInForm({ token }: Props) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loadError, setLoadError] = useState("");
  const [geo, setGeo] = useState<GeoPoint | null>(null);
  const [geoError, setGeoError] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [done, setDone] = useState<{ eventTitle: string; checkedInAt: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const deviceId = getClientDeviceId();
    void fetch(`/api/attendance/session/${encodeURIComponent(token)}?deviceId=${encodeURIComponent(deviceId)}`, {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load this session.");
        if (cancelled) return;
        const info = data as SessionInfo;
        setSession(info);
        if (info.alreadyCheckedIn) {
          setDone({
            eventTitle: info.eventTitle,
            checkedInAt: info.checkedInAt || new Date().toISOString(),
          });
        }
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function requestLocation() {
    if (!navigator.geolocation) {
      setGeoError("This browser cannot share location. Try Chrome or Safari on your phone.");
      return;
    }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Location permission is required. Allow location for this site, then try again.");
        } else {
          setGeoError("Could not read GPS. Step outdoors or nearer a window, then try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!geo) {
      setFormError("Share your location before submitting.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const collegeId = String(data.get("collegeId") ?? "");
    const idError = collegeIdError(collegeId);
    if (idError) {
      setFormError(idError);
      return;
    }
    setSubmitting(true);
    setFormError("");
    const response = await fetch("/api/attendance/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        token,
        name: String(data.get("name") ?? ""),
        studentClass: String(data.get("studentClass") ?? ""),
        department: String(data.get("department") ?? ""),
        section: String(data.get("section") ?? ""),
        registerNumber: String(data.get("registerNumber") ?? ""),
        collegeId,
        deviceId: getClientDeviceId(),
        lat: geo.lat,
        lng: geo.lng,
        accuracy: geo.accuracy,
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; eventTitle?: string; checkedInAt?: string }
      | null;
    setSubmitting(false);
    if (!response.ok) {
      setFormError(payload?.error || "Check-in failed.");
      return;
    }
    setDone({
      eventTitle: payload?.eventTitle || session?.eventTitle || "Event",
      checkedInAt: payload?.checkedInAt || new Date().toISOString(),
    });
  }

  if (loadError) {
    return <StatusCard title="Invalid QR" body={loadError} tone="red" />;
  }

  if (!session) {
    return <StatusCard title="Opening attendance…" body="Checking whether this event is live." tone="blue" />;
  }

  if (!session.active) {
    return (
      <StatusCard
        title="Attendance is closed"
        body={`${session.eventTitle} is not taking check-ins right now. Ask an organizer when the QR is active.`}
        tone="yellow"
      />
    );
  }

  if (done) {
    return (
      <StatusCard
        title="You're marked present"
        body={`${done.eventTitle} · ${formatTiming(new Date(done.checkedInAt))}`}
        tone="green"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(32,33,36,0.08)] sm:p-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-gdg-blue uppercase">QR check-in</p>
      <h1 className="mt-2 text-3xl font-bold text-[#202124]">{session.eventTitle}</h1>

      <div className="mt-6 rounded-2xl bg-[#f7f8fa] p-4">
        {geo ? (
          <p className="text-sm text-ink">
            Location ready · accuracy about {Math.round(geo.accuracy)} m
            {geo.accuracy > session.maxAccuracyMeters ? (
              <span className="mt-1 block text-gdg-red">
                Accuracy is weak. Move for a clearer GPS fix before submitting.
              </span>
            ) : null}
          </p>
        ) : (
          <p className="text-sm text-ink">Location is required before attendance can be saved.</p>
        )}
        <button
          type="button"
          onClick={requestLocation}
          disabled={locating}
          className="mt-3 rounded-full bg-gdg-blue px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
        >
          {locating ? "Reading GPS…" : geo ? "Refresh location" : "Share location"}
        </button>
        {geoError ? <p className="mt-3 text-sm text-gdg-red">{geoError}</p> : null}
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Field id="name" name="name" label="Name" required autoComplete="name" />
        <Field id="studentClass" name="studentClass" label="Class" required placeholder="e.g. III B.Sc CS" />
        <div>
          <label htmlFor="department" className="mb-1.5 block text-sm font-medium text-[#202124]">
            Department
          </label>
          <select
            id="department"
            name="department"
            required
            defaultValue=""
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-gdg-blue"
          >
            <option value="" disabled>
              Select department
            </option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
        <Field id="section" name="section" label="Section (if available)" placeholder="e.g. A" />
        <Field
          id="registerNumber"
          name="registerNumber"
          label="Roll No"
          required
          autoCapitalize="characters"
          autoComplete="off"
        />
        <Field
          id="collegeId"
          name="collegeId"
          label="College ID"
          type="email"
          required
          autoComplete="email"
          placeholder={`name@${collegeEmailDomain}`}
        />
        <p className="-mt-2 text-xs text-ink">Only @{collegeEmailDomain} addresses can mark attendance.</p>
        <div>
          <label htmlFor="timing" className="mb-1.5 block text-sm font-medium text-[#202124]">
            Timing
          </label>
          <input
            id="timing"
            name="timing"
            type="text"
            readOnly
            value={formatTiming(now)}
            className="w-full rounded-xl border border-black/10 bg-[#f7f8fa] px-4 py-3 text-ink outline-none"
            aria-describedby="timing-help"
          />
          <p id="timing-help" className="mt-1.5 text-xs text-ink">
            Auto-detected from your device. Saved when you submit.
          </p>
        </div>
        {formError ? <p className="text-sm text-gdg-red">{formError}</p> : null}
        <button
          type="submit"
          disabled={submitting || !geo}
          className="w-full rounded-full bg-gdg-green px-5 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Mark me present"}
        </button>
      </form>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoCapitalize,
  autoComplete,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoCapitalize?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#202124]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-gdg-blue"
      />
    </div>
  );
}

function StatusCard({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "blue" | "red" | "yellow" | "green";
}) {
  const colors = {
    blue: "bg-gdg-blue",
    red: "bg-gdg-red",
    yellow: "bg-gdg-yellow text-[#3c4043]",
    green: "bg-gdg-green",
  };
  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_rgba(32,33,36,0.08)]">
      <div className={`px-6 py-4 text-sm font-semibold tracking-[0.14em] text-white uppercase ${colors[tone]}`}>
        GDG SKASC attendance
      </div>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-[#202124]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-ink">{body}</p>
      </div>
    </div>
  );
}
