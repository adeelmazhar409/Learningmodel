"use client";
import Link from "next/link";

interface DrawerLink { href: string; label: string; }
interface DrawerProps { open: boolean; links: DrawerLink[]; activePath: string; onNavigate: () => void; onLogout: () => void; loggingOut: boolean; }

export default function Drawer({ open, links, activePath, onNavigate, onLogout, loggingOut }: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-[490] bg-[rgba(9,9,11,0.97)] backdrop-blur-[28px] flex flex-col px-7 pt-[90px] pb-11 transition-all duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      role="dialog" aria-modal="true">
      <ul className="list-none flex flex-col gap-0.5 flex-1">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} onClick={onNavigate}
              className={`block px-4 py-[15px] font-serif text-[20px] no-underline rounded-xl border-b border-[rgba(255,255,255,0.04)] transition-all ${activePath.startsWith(l.href) ? "text-[#e8603c] bg-[rgba(255,255,255,0.04)]" : "text-[rgba(240,237,232,0.6)] hover:text-[#f0ede8] hover:bg-[rgba(255,255,255,0.04)]"}`}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="pt-6 border-t border-[rgba(255,255,255,0.07)]">
        <button onClick={() => { onLogout(); onNavigate(); }} disabled={loggingOut}
          className="w-full flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.07)] text-[rgba(240,237,232,0.55)] rounded-full py-3.5 text-[15px] font-normal font-sans cursor-pointer transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-50 disabled:cursor-not-allowed">
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
