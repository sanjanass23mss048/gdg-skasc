"use client";

type Props = {
  dataUrl: string;
  title: string;
  subtitle?: string;
  checkInUrl: string;
  size?: "normal" | "hero";
};

export function QrPanel({ dataUrl, title, subtitle, checkInUrl, size = "normal" }: Props) {
  const frame = size === "hero" ? "max-w-[min(72vw,520px)]" : "max-w-[280px]";
  if (size === "hero") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className={`mx-auto rounded-3xl bg-white p-4 shadow-lg ${frame}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt={`QR code for ${title}`} className="h-auto w-full" />
        </div>
        <p className="mt-4 text-3xl font-bold text-[#202124] md:text-5xl">{title}</p>
        {subtitle ? <p className="mt-2 max-w-xl text-base text-ink md:text-xl">{subtitle}</p> : null}
        <p className="mt-6 max-w-lg text-sm text-ink md:text-base">
          Open your phone camera, scan this QR, share location near this spot, then submit your details.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={`mx-auto rounded-3xl bg-white p-4 shadow-lg ${frame}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt={`QR code for ${title}`} className="h-auto w-full" />
      </div>
      <p className="mt-3 break-all text-xs text-white/70">{checkInUrl}</p>
    </div>
  );
}
