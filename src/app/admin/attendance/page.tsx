import type { Metadata } from "next";
import { AdminAttendance } from "@/components/attendance/AdminAttendance";

export const metadata: Metadata = {
  title: "Attendance console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAttendancePage() {
  return (
    <main id="main" className="surface-light min-h-[calc(100svh-72px)] bg-[#f7f8fa] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminAttendance />
      </div>
    </main>
  );
}
