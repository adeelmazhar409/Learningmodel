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
  const pathname          = usePathname();
  const router            = useRouter();
  const { user, logout }  = useAuthStore();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* Scroll detection for raised shadow */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initial   = firstName[0]?.toUpperCase() ?? "?";

  return (
    <>
      <style>{`
        .nav-outer {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 1200px;
          z-index: 500;
        }

        .nav-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(13,13,15,0.88);
          backdrop-filter: blur(28px) saturate(1.5);
          -webkit-backdrop-filter: blur(28px) saturate(1.5);
          border: 1px solid var(--edge);
          border-radius: 100px;
          padding: 7px 7px 7px 20px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .nav-pill.up {
          border-color: var(--edge2);
          box-shadow: 0 8px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* Logo / brand */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          color: var(--text);
          flex-shrink: 0;
        }
        .nav-brand-orb {
          width: 26px; height: 26px;
          background: linear-gradient(145deg, var(--ember), #8c2410);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px rgba(217,79,43,0.25);
        }
        .nav-brand-orb svg { width: 11px; height: 11px; }
        .nav-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        /* Centre links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-links a {
          display: block;
          padding: 7px 13px;
          font-size: 13px;
          font-weight: 400;
          color: var(--soft);
          text-decoration: none;
          border-radius: 100px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .nav-links a:hover { color: var(--text); background: rgba(255,255,255,0.07); }
        .nav-links a.active {
          color: var(--text);
          background: rgba(255,255,255,0.07);
        }

        /* Right side */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        /* Avatar */
        .nav-avatar {
          width: 30px; height: 30px;
          background: rgba(217,79,43,0.15);
          border: 1px solid rgba(217,79,43,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--ember);
          font-family: 'Playfair Display', serif;
          cursor: default;
          flex-shrink: 0;
        }

        /* Logout btn */
        .nav-logout {
          background: none;
          border: none;
          color: var(--soft);
          font-size: 13px;
          padding: 7px 13px;
          border-radius: 100px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .nav-logout:hover { color: var(--text); background: rgba(255,255,255,0.06); }
        .nav-logout:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Hamburger */
        .nav-hbg {
          display: none;
          width: 34px; height: 34px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--edge);
          border-radius: 50%;
          cursor: pointer;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
        }
        .nav-hbg span {
          display: block;
          width: 13px; height: 1px;
          background: rgba(255,255,255,0.75);
          border-radius: 2px;
          transition: all 0.24s ease;
          transform-origin: center;
        }
        .nav-hbg.open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
        .nav-hbg.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hbg.open span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

        @media (max-width: 900px) {
          .nav-links  { display: none; }
          .nav-logout { display: none; }
          .nav-hbg    { display: flex; }
          .nav-outer  { width: calc(100% - 24px); top: 12px; }
          .nav-pill   { padding: 7px 7px 7px 16px; }
        }
      `}</style>

      {/* Mobile drawer */}
      <Drawer
        open={menuOpen}
        links={NAV_LINKS}
        activePath={pathname}
        onNavigate={() => setMenuOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      {/* Nav bar */}
      <nav className="nav-outer" aria-label="Main navigation">
        <div className={`nav-pill${scrolled ? " up" : ""}`}>
          {/* Brand */}
          <Link href="/dashboard" className="nav-brand">
            <div className="nav-brand-orb">
              <svg viewBox="0 0 20 20" fill="white">
                <path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25"/>
                <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/>
              </svg>
            </div>
            <span className="nav-brand-name">NeuroPath</span>
          </Link>

          {/* Desktop centre links */}
          <ul className="nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={pathname.startsWith(l.href) ? "active" : ""}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="nav-right">
            <div className="nav-avatar" title={user?.name ?? ""}>{initial}</div>

            <button
              className="nav-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>

            {/* Hamburger */}
            <button
              className={`nav-hbg${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
