import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-white">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M8 10h6v12H8z" fill="#4285F4" />
        <path d="M18 10h6v12h-6z" fill="#EA4335" />
        <path d="M11 7h10v4H11z" fill="#FBBC04" />
        <path d="M11 21h10v4H11z" fill="#34A853" />
        <path d="M14 12h4v8h-4z" fill="#0b0b0f" />
      </svg>
      <span className="font-display text-base tracking-[0.08em] sm:text-lg">GDG SKASC</span>
    </Link>
  );
}
