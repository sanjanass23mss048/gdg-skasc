import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckInForm } from "@/components/attendance/CheckInForm";

export const metadata: Metadata = {
  title: "Event check-in",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  params: Promise<{ token: string }>;
};

export default function AttendPage({ params }: Props) {
  return (
    <main id="main" className="surface-light min-h-[calc(100svh-72px)] bg-[#f7f8fa] px-4 py-10">
      <Suspense fallback={<p className="mx-auto max-w-lg text-center text-ink">Opening check-in…</p>}>
        <AttendClient params={params} />
      </Suspense>
    </main>
  );
}

async function AttendClient({ params }: Props) {
  const { token } = await params;
  return <CheckInForm token={token} />;
}
