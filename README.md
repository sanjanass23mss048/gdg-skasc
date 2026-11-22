# GDG SKASC

Campus site for **GDG on Campus** at Sri Krishna Arts and Science College, Coimbatore. Same kind of chapter site as a Google developer student club page: hero, about, domains, events, team, and a contact form.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and set `ATTENDANCE_ADMIN_SECRET` before an event day.

## Deploy on Vercel

```bash
npx vercel
```

Add these environment variables in the Vercel project (Settings → Environment Variables):

- `ATTENDANCE_ADMIN_SECRET` — admin password for `/admin/attendance`
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` — from Vercel Marketplace Upstash Redis (or `UPSTASH_REDIS_REST_*`)

On Vercel, attendance is stored in Upstash Redis (not a local file). Locally, without those Redis vars, records still go to `data/attendance.json`.

## Edit the copy

Names, events, the chapter email, and social links live in `src/lib/site.ts`.

The contact form opens the visitor’s mail app addressed to the email in that file.

## Event attendance (QR-based, hidden)

Attendance stays closed until an organizer activates it. There is no public nav link.

1. Open `/admin/attendance` and unlock with `ATTENDANCE_ADMIN_SECRET`.
2. Stand at the hall/booth, pick the event, then **Activate attendance** (your GPS becomes the center; QR is valid within 100 m).
3. Open **Open projector QR** (`/admin/attendance/qr`) on the hall screen, or print the QR from the console.
4. Students scan that QR → share GPS → submit name, class, department, section, roll no, and `@skasc.ac.in` college ID. Timing is auto-detected. One phone can check in once per event.
5. Check-in only succeeds within 100 m of the activation spot while the session is live.
6. Close attendance when the session ends. Export the roster as CSV from the same console.

**Storage:** local `data/attendance.json` in development; Upstash Redis on Vercel. Spoofed GPS is still possible on rooted devices — treat this as campus-event tooling, not bank-grade identity.
