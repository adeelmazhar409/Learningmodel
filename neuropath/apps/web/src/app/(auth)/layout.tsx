import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "NeuroPath", template: "%s | NeuroPath" },
  description: "AI-powered personalised study packs from your lectures.",
};

/* Brand logo mark — reused here without importing the Nav component */
function LogoMark() {
  return (
    <div className="w-[30px] h-[30px] bg-gradient-to-br from-ember to-[#8c2410] rounded-full flex items-center justify-center shrink-0 shadow-orb">
      <svg viewBox="0 0 20 20" fill="white" className="w-[13px] h-[13px]">
        <path
          d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z"
          opacity=".25"
        />
        <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z" />
      </svg>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-5 sm:p-6 relative overflow-hidden bg-ink">
      {/* Ambient radial glow behind card */}
      <div
        aria-hidden
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(217,79,43,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Auth card */}
      <div className="w-full max-w-[440px] bg-surface border border-edge rounded-2xl sm:rounded-3xl px-7 sm:px-9 py-8 sm:py-10 relative z-10">
        {/* Top flame accent line */}
        <div className="absolute top-[-1px] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-flame to-transparent" />

        {/* Brand link */}
        <Link href="/" className="flex items-center gap-2.5 no-underline mb-8">
          <LogoMark />
          <span className="font-serif text-[15px] font-semibold text-text tracking-[0.01em]">
            NeuroPath
          </span>
        </Link>

        {/* Page content (login / signup forms) */}
        {children}
      </div>
    </div>
  );
}
