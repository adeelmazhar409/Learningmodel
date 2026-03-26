import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "NeuroPath", template: "%s | NeuroPath" },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-6 relative overflow-hidden bg-ink">
      {/* Ambient glow */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(217,79,43,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-[440px] bg-surface border border-edge rounded-xl p-10 relative z-10 animate-rise-in">
        {/* Top accent line */}
        <div className="absolute top-[-1px] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-flame to-transparent" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline mb-8">
          <div className="w-[30px] h-[30px] bg-gradient-to-br from-ember to-[#8c2410] rounded-full flex items-center justify-center shrink-0 shadow-orb">
            <svg viewBox="0 0 20 20" fill="white" className="w-[13px] h-[13px]">
              <path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25"/>
              <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/>
            </svg>
          </div>
          <span className="font-serif text-base font-semibold text-text tracking-[0.01em]">NeuroPath</span>
        </Link>

        {children}
      </div>
    </div>
  );
}
