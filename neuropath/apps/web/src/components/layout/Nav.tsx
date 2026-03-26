"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { authApi } from "../../lib/api/auth.api";
import Drawer from "./Drawer";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Nav links
───────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/record", label: "Record" },
  { href: "/study-packs", label: "Study Packs" },
  { href: "/roadmap", label: "Roadmap" },
];

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
function IcMenu() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function IcClose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Brand logo mark
───────────────────────────────────────── */
function Logo() {
  return (
    <div className="w-[26px] h-[26px] bg-gradient-to-br from-ember to-[#8c2410] rounded-full flex items-center justify-center shadow-orb shrink-0">
      <svg viewBox="0 0 20 20" fill="white" className="w-[11px] h-[11px]">
        <path
          d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z"
          opacity=".25"
        />
        <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   Nav component
───────────────────────────────────────── */
export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* scroll listener */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      logout();
      router.replace("/login");
      toast.success("Signed out.");
      setLoggingOut(false);
    }
  }

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        open={menuOpen}
        links={NAV_LINKS}
        activePath={pathname}
        onNavigate={() => setMenuOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      {/* Floating pill nav */}
      <nav
        className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] sm:w-[calc(100%-32px)] max-w-[1200px] z-[500]"
        aria-label="Main navigation"
      >
        <div
          className={[
            "flex items-center justify-between",
            "bg-[rgba(13,13,15,0.88)] backdrop-blur-[28px]",
            "border rounded-pill py-[7px] pl-4 sm:pl-5 pr-[7px]",
            "transition-all duration-300",
            scrolled
              ? "border-edge-2 shadow-[0_8px_48px_rgba(0,0,0,0.65)]"
              : "border-edge",
          ].join(" ")}
        >
          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 no-underline text-text shrink-0"
          >
            <Logo />
            <span className="font-serif text-[14px] sm:text-[15px] font-semibold tracking-[0.01em]">
              NeuroPath
            </span>
          </Link>

          {/* Desktop centre links */}
          <ul className="hidden md:flex items-center gap-0.5 list-none absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => {
              const isActive = pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={[
                      "block px-3.5 py-[7px] text-[13px] font-normal",
                      "no-underline rounded-pill whitespace-nowrap",
                      "tracking-[0.01em] transition-all duration-200",
                      isActive
                        ? "text-text bg-[rgba(255,255,255,0.07)]"
                        : "text-soft hover:text-text hover:bg-[rgba(255,255,255,0.07)]",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Avatar */}
            <div
              className="w-[30px] h-[30px] bg-[rgba(217,79,43,0.15)] border border-[rgba(217,79,43,0.3)] rounded-full flex items-center justify-center text-[11px] font-semibold text-ember font-serif cursor-default shrink-0 select-none"
              title={user?.name ?? ""}
              aria-label={`Signed in as ${user?.name ?? "user"}`}
            >
              {initial}
            </div>

            {/* Desktop sign-out */}
            <button
              className="hidden md:flex items-center px-3.5 py-[7px] text-[13px] text-soft bg-transparent border-none rounded-pill cursor-pointer transition-all duration-200 font-sans whitespace-nowrap hover:text-text hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-[1.5px] border-edge-2 border-t-soft rounded-full animate-spin" />
                  Signing out…
                </span>
              ) : (
                "Sign out"
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="flex md:hidden w-[34px] h-[34px] items-center justify-center rounded-full text-soft hover:text-text hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer bg-transparent border-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IcClose /> : <IcMenu />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
