"use client";

import Link from "next/link";

interface DrawerLink {
  href:  string;
  label: string;
}

interface DrawerProps {
  open:        boolean;
  links:       DrawerLink[];
  activePath:  string;
  onNavigate:  () => void;
  onLogout:    () => void;
  loggingOut:  boolean;
}

export default function Drawer({
  open,
  links,
  activePath,
  onNavigate,
  onLogout,
  loggingOut,
}: DrawerProps) {
  return (
    <>
      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 490;
          background: rgba(9,9,11,0.97);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          display: flex;
          flex-direction: column;
          padding: 90px 28px 44px;
          transition: opacity 0.25s ease, visibility 0.25s ease;
          opacity: 0;
          visibility: hidden;
        }
        .drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .drawer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .drawer-link {
          display: block;
          padding: 15px 16px;
          font-size: 20px;
          font-weight: 400;
          font-family: 'Playfair Display', serif;
          color: rgba(240,237,232,0.6);
          text-decoration: none;
          border-radius: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.18s, background 0.18s;
        }
        .drawer-link:hover,
        .drawer-link.active {
          color: var(--text);
          background: rgba(255,255,255,0.04);
        }
        .drawer-link.active {
          color: var(--ember);
        }

        .drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 24px;
          border-top: 1px solid var(--edge);
        }

        .drawer-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          color: var(--soft);
          border: 1px solid var(--edge);
          border-radius: 100px;
          padding: 14px;
          font-size: 15px;
          font-weight: 400;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .drawer-logout:hover {
          color: var(--text);
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
        }
        .drawer-logout:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div
        className={`drawer-overlay${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul className="drawer-links">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`drawer-link${activePath.startsWith(l.href) ? " active" : ""}`}
                onClick={onNavigate}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="drawer-footer">
          <button
            className="drawer-logout"
            onClick={() => { onLogout(); onNavigate(); }}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </>
  );
}
