import type { Metadata } from "next";
import { ProjectorQr } from "@/components/attendance/ProjectorQr";

export const metadata: Metadata = {
  title: "Attendance QR",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AttendanceQrPage() {
  return (
    <main id="main" className="surface-light min-h-[calc(100svh-72px)] bg-[#f7f8fa]">
      <ProjectorQr />
    </main>
  );
}
