"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";
import Drawer from "./Drawer";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { href: "/dashboard",   label: "Dashboard"   },
  { href: "/diagnostic",  label: "Diagnostic"  },
  { href: "/record",      label: "Record"      },
  { href: "/study-packs", label: "Study Packs" },
  { href: "/roadmap",     label: "Roadmap"     },
];

export default function Nav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    try { await authApi.logout(); } finally {
      logout(); router.replace("/login"); toast.success("Signed out."); setLoggingOut(false);
    }
  }

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <Drawer open={menuOpen} links={NAV_LINKS} activePath={pathname} onNavigate={() => setMenuOpen(false)} onLogout={handleLogout} loggingOut={loggingOut}/>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1200px] z-[500]">
        <div className={`flex items-center justify-between bg-[rgba(13,13,15,0.88)] backdrop-blur-[28px] border rounded-full py-[7px] pl-5 pr-[7px] transition-all duration-300 ${scrolled ? "border-[rgba(255,255,255,0.13)] shadow-[0_8px_48px_rgba(0,0,0,0.65)]" : "border-[rgba(255,255,255,0.07)]"}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 no-underline text-[#f0ede8] shrink-0">
            <div className="w-[26px] h-[26px] bg-gradient-to-br from-[#e8603c] to-[#8c2410] rounded-full flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_10px_rgba(217,79,43,0.25)]">
              <svg viewBox="0 0 20 20" fill="white" className="w-[11px] h-[11px]">
                <path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25"/>
                <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/>
              </svg>
            </div>
            <span className="font-serif text-[15px] font-semibold tracking-[0.01em]">NeuroPath</span>
          </Link>

          <ul className="hidden md:flex items-center gap-0.5 list-none absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={`block px-3.5 py-[7px] text-[13px] font-normal no-underline rounded-full transition-all whitespace-nowrap ${pathname.startsWith(l.href) ? "text-[#f0ede8] bg-[rgba(255,255,255,0.07)]" : "text-[rgba(240,237,232,0.55)] hover:text-[#f0ede8] hover:bg-[rgba(255,255,255,0.07)]"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-[30px] h-[30px] bg-[rgba(217,79,43,0.15)] border border-[rgba(217,79,43,0.3)] rounded-full flex items-center justify-center text-xs font-semibold text-[#e8603c] font-serif cursor-default">{initial}</div>
            <button onClick={handleLogout} disabled={loggingOut}
              className="hidden md:block px-3.5 py-[7px] text-[13px] text-[rgba(240,237,232,0.55)] bg-none border-none rounded-full cursor-pointer transition-all hover:text-[#f0ede8] hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50 font-sans">
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
            <button onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="md:hidden w-[34px] h-[34px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer">
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all origin-center ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}/>
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`}/>
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all origin-center ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}/>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
