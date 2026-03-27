"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = ["How it works", "Features", "Diagnostics"];

const FEATURES = [
  { icon: "🧠", title: "Learning Profile Engine", wide: true, body: "The diagnostic scores accuracy, speed, and retention across flashcards, practice problems, visual mapping, and teach-back. Your profile updates with every session — getting sharper over time." },
  { icon: "🎙", title: "Lecture Recording",       wide: false, body: "Tap to record. AI transcribes your lecture and structures the content automatically." },
  { icon: "📚", title: "Personalised Study Packs",wide: false, body: "Every pack is weighted to your profile. Two students get the same lecture — two completely different study materials." },
  { icon: "🗺", title: "Smart Roadmap",           wide: false, body: "Set a test date. Get a structured day-by-day plan that adapts as you progress." },
  { icon: "💪", title: "Growth Mindset Coaching", wide: false, body: "Built on Carol Dweck's research. Short coaching messages fire after every completed session." },
  { icon: "📊", title: "Progress Tracking",       wide: false, body: "See which methods are strengthening over time and which need more work." },
];

const STEPS = [
  { n: "01", title: "Diagnose",    body: "A 20-minute performance test across four learning methods reveals exactly how your brain retains information. No surveys. Pure data." },
  { n: "02", title: "Personalise", body: "Record any lecture. AI transcribes it and generates flashcards, quizzes, and teach-back scripts — all weighted to your learning profile." },
  { n: "03", title: "Coach",       body: "Set a test date. Get a day-by-day roadmap of 10–20 minute tasks with growth mindset coaching after every session." },
];

const MARQUEE_ITEMS = [
  "Performance-based diagnostics","AI study pack generation","Personalised flashcards",
  "Growth mindset coaching","Lecture transcription","Smart study roadmap",
  "Teach-back scripts","Learning profile engine",
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="bg-[#0c0c0e] min-h-svh overflow-x-hidden">

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-0 z-[490] bg-[rgba(9,9,11,0.97)] backdrop-blur-[28px] flex flex-col px-7 pt-[90px] pb-11 transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <ul className="list-none flex flex-col gap-0.5 flex-1">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/ /g,"-")}`} onClick={() => setMenuOpen(false)}
                className="block px-4 py-[15px] font-serif text-[20px] text-[rgba(240,237,232,0.6)] no-underline rounded-xl border-b border-[rgba(255,255,255,0.04)] transition-all hover:text-[#f0ede8] hover:bg-[rgba(255,255,255,0.04)]">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="pt-6 border-t border-[rgba(255,255,255,0.07)]">
          <Link href="/signup" onClick={() => setMenuOpen(false)}
            className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium no-underline transition-all hover:opacity-90">
            Get started free
          </Link>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1100px] z-[500]">
        <div className={`flex items-center justify-between bg-[rgba(13,13,15,0.85)] backdrop-blur-[24px] border rounded-full py-2 pl-[22px] pr-2 transition-all duration-300 ${scrolled ? "border-[rgba(255,255,255,0.13)] shadow-[0_8px_40px_rgba(0,0,0,0.55)]" : "border-[rgba(255,255,255,0.07)]"}`}>
          <Link href="/" className="flex items-center gap-2.5 no-underline text-[#f0ede8]">
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
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g,"-")}`}
                  className="block px-3.5 py-[7px] text-[13px] text-[rgba(240,237,232,0.55)] no-underline rounded-full transition-all hover:text-[#f0ede8] hover:bg-[rgba(255,255,255,0.07)]">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:block px-4 py-2 text-[13px] text-[rgba(240,237,232,0.55)] no-underline border border-[rgba(255,255,255,0.13)] rounded-full transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.25)]">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center bg-[#f0ede8] text-[#0c0c0e] rounded-full px-[18px] py-2 text-[13px] font-medium no-underline transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Get started</Link>
            <button onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
              className="md:hidden w-[34px] h-[34px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer">
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all origin-center ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}/>
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`}/>
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all origin-center ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="min-h-svh flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20 relative overflow-hidden">
        {/* Diagonal bars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[12,28,50,68,84].map((left, i) => (
            <div key={i} className="absolute w-[3px] h-[120%] top-[-10%]"
              style={{ left: `${left}%`, background: "linear-gradient(to bottom,transparent,rgba(217,79,43,0.12),transparent)", transform: "rotate(-32deg)", animation: `barFloat ${14+i*2}s ${i*0.5}s ease-in-out infinite`, opacity: 0.5+i*0.1 }}/>
          ))}
        </div>
        {/* Glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse,rgba(217,79,43,0.07)_0%,transparent_70%)]"/>

        <div className="relative z-10 max-w-[820px]">
          <div className="inline-flex items-center gap-2 bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.22)] rounded-full px-3.5 py-1.5 text-[11.5px] text-[#e8603c] tracking-[0.04em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8603c] animate-pulse"/>
            AI-powered personalised learning
          </div>
          <h1 className="font-serif text-[clamp(42px,8vw,96px)] font-medium text-[#f0ede8] leading-[1.04] tracking-[-0.03em] mb-6">
            Learning built<br/><em className="italic text-[rgba(240,237,232,0.55)]">for your brain.</em>
          </h1>
          <p className="text-[clamp(15px,1.8vw,18px)] text-[rgba(240,237,232,0.55)] font-light leading-[1.7] max-w-[560px] mx-auto mb-9">
            NeuroPath diagnoses how you actually retain information — through performance, not guesswork — then turns every lecture into a personalised study system.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3.5 text-sm font-medium no-underline transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
              Start for free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 bg-transparent text-[rgba(240,237,232,0.55)] border border-[rgba(255,255,255,0.13)] rounded-full px-7 py-3.5 text-sm font-normal no-underline transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.26)] hover:-translate-y-0.5">See how it works</a>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-t border-b border-[rgba(255,255,255,0.07)] py-7 overflow-hidden">
        <div className="flex w-max" style={{ animation: "scrollX 28s linear infinite" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <div key={i} className="flex items-center gap-4 px-8 text-[13px] text-[rgba(240,237,232,0.25)] tracking-[0.08em] uppercase whitespace-nowrap">
              <div className="w-1 h-1 rounded-full bg-[#d94f2b] shrink-0"/>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 py-[100px]">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-16">
            <p className="flex items-center justify-center gap-2.5 text-[11px] font-medium text-[#d94f2b] tracking-[2.2px] uppercase mb-5 before:block before:w-[22px] before:h-px before:bg-[#d94f2b]">How it works</p>
            <h2 className="font-serif text-[clamp(30px,3.8vw,48px)] font-medium text-[#f0ede8] tracking-[-0.025em] leading-[1.1]">Three steps to<br/>a smarter study system.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map(s => (
              <div key={s.n} className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-7 py-8 transition-all hover:border-[rgba(255,255,255,0.13)] hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
                <div className="font-serif text-[48px] font-semibold text-[rgba(217,79,43,0.18)] leading-none tracking-[-0.02em] mb-4">{s.n}</div>
                <p className="font-serif text-xl font-medium text-[#f0ede8] mb-2.5 tracking-[-0.01em]">{s.title}</p>
                <p className="text-sm text-[rgba(240,237,232,0.55)] font-light leading-[1.7]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-20 pb-[100px]">
        <div className="max-w-[1080px] mx-auto">
          <div className="mb-12">
            <p className="flex items-center gap-2.5 text-[11px] font-medium text-[#d94f2b] tracking-[2.2px] uppercase mb-5 before:block before:w-[22px] before:h-px before:bg-[#d94f2b]">Features</p>
            <h2 className="font-serif text-[clamp(30px,3.8vw,48px)] font-medium text-[#f0ede8] tracking-[-0.025em] leading-[1.1]">Everything you need<br/>to study smarter.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className={`relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-7 py-7 transition-all hover:border-[rgba(255,255,255,0.13)] hover:-translate-y-0.5 ${f.wide ? "md:col-span-2" : ""}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
                <span className="text-[28px] mb-3.5 block">{f.icon}</span>
                <p className="font-serif text-[18px] font-medium text-[#f0ede8] mb-2 tracking-[-0.01em]">{f.title}</p>
                <p className="text-[13.5px] text-[rgba(240,237,232,0.55)] font-light leading-[1.7]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="diagnostics" className="px-6 py-[100px] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(217,79,43,0.07)_0%,transparent_70%)] pointer-events-none"/>
        <div className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-medium text-[#f0ede8] tracking-[-0.025em] leading-[1.1] mb-4">
            Ready to find out<br/><em className="italic text-[rgba(240,237,232,0.55)]">how you learn?</em>
          </h2>
          <p className="text-base text-[rgba(240,237,232,0.55)] font-light leading-[1.7] mb-9">Take the 20-minute diagnostic and unlock a study system that actually fits your brain. Free to start.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3.5 text-sm font-medium no-underline transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
              Start the diagnostic
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-transparent text-[rgba(240,237,232,0.55)] border border-[rgba(255,255,255,0.13)] rounded-full px-7 py-3.5 text-sm font-normal no-underline transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.26)] hover:-translate-y-0.5">Sign in</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(255,255,255,0.07)] px-6 py-7 max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="flex items-center gap-2 no-underline text-[#f0ede8] font-serif text-sm font-semibold">
          <div className="w-5 h-5 bg-gradient-to-br from-[#e8603c] to-[#8c2410] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="white" className="w-[9px] h-[9px]">
              <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/>
            </svg>
          </div>
          NeuroPath
        </Link>
        <p className="text-xs text-[rgba(240,237,232,0.25)]">
          © {new Date().getFullYear()} NeuroPath. Built for students who want to understand how they learn.
        </p>
      </footer>
    </div>
  );
}
