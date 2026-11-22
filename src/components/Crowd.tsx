const hairs = ["#1f1a17", "#3b2a22", "#111111", "#6b4423", "#4a3728"];
const shirts = ["#4285f4", "#ea4335", "#fbbc04", "#34a853", "#202124", "#7baaf7", "#f28b82"];
const skins = ["#f6d3b3", "#e7b48a", "#c68642", "#8d5524", "#f1c27d"];

export function Crowd() {
  return (
    <div className="absolute inset-0 grid grid-cols-4 gap-3 p-4 sm:grid-cols-6 md:grid-cols-8" aria-hidden="true">
      {Array.from({ length: 32 }, (_, index) => (
        <svg key={index} viewBox="0 0 80 100" className="h-full w-full">
          <rect width="80" height="100" rx="12" fill={index % 2 ? "#1a2330" : "#243044"} />
          <circle cx="40" cy="36" r="16" fill={skins[index % skins.length]} />
          <path d="M24 34c2-16 30-18 34 0-6-10-28-10-34 0z" fill={hairs[index % hairs.length]} />
          <rect x="22" y="56" width="36" height="36" rx="12" fill={shirts[index % shirts.length]} />
        </svg>
      ))}
    </div>
  );
}
