"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = ["How it works", "Features", "Diagnostics"];

const FEATURES = [
  { icon: "🧠", title: "Learning Profile Engine", wide: true,  body: "The diagnostic scores accuracy, speed, and retention across flashcards, practice problems, visual mapping, and teach-back. Your profile updates with every session — getting sharper over time." },
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
  "Performance-based diagnostics", "AI study pack generation", "Personalised flashcards",
  "Growth mindset coaching", "Lecture transcription", "Smart study roadmap",
  "Teach-back scripts", "Learning profile engine",
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
    <div className="bg-ink min-h-svh overflow-x-hidden">

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-0 z-[490] bg-[rgba(9,9,11,0.97)] backdrop-blur-[28px] flex flex-col px-7 pt-[90px] pb-11 transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <ul className="list-none flex flex-col gap-0.5 flex-1">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-[15px] font-serif text-[20px] text-[rgba(240,237,232,0.6)] no-underline rounded-xl border-b border-[rgba(255,255,255,0.04)] transition-all hover:text-text hover:bg-[rgba(255,255,255,0.04)]"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="pt-6 border-t border-edge">
          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
            className="w-full flex items-center justify-center bg-text text-ink rounded-pill py-3.5 text-sm font-medium no-underline transition-all hover:opacity-90"
          >
            Get started free
          </Link>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1100px] z-[500]">
        <div className={`flex items-center justify-between bg-[rgba(13,13,15,0.85)] backdrop-blur-[24px] border rounded-pill py-2 pl-[22px] pr-2 transition-all duration-300 ${scrolled ? "border-edge-2 shadow-nav" : "border-edge"}`}>
          <a href="#" className="flex items-center gap-[9px] no-underline text-text">
            <div className="w-[26px] h-[26px] bg-gradient-to-br from-ember to-[#8c2410] rounded-full flex items-center justify-center shadow-orb">
              <svg viewBox="0 0 20 20" fill="white" className="w-[11px] h-[11px]">
                <path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25" />
                <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z" />
              </svg>
            </div>
            <span className="font-serif text-[15px] font-semibold tracking-[0.01em]">NeuroPath</span>
          </a>
          <ul className="hidden md:flex items-center gap-0.5 list-none absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="block px-3.5 py-[7px] text-[13px] text-soft no-underline rounded-pill transition-all hover:text-text hover:bg-[rgba(255,255,255,0.07)]">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:block px-4 py-2 text-[13px] text-soft bg-transparent border border-edge-2 rounded-pill no-underline transition-all hover:text-text hover:border-[rgba(255,255,255,0.25)]">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary text-[13px] py-2.5 px-5 max-md:text-xs max-md:py-2 max-md:px-4">
              Get started free
            </Link>
            <button
              className="flex md:hidden w-[34px] h-[34px] bg-[rgba(255,255,255,0.05)] border border-edge rounded-full cursor-pointer items-center justify-center flex-col gap-1"
              onClick={() => setMenuOpen(v => !v)}
            >
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all duration-[240ms] origin-center ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all duration-[240ms] ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-[13px] h-px bg-[rgba(255,255,255,0.75)] rounded-sm transition-all duration-[240ms] origin-center ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-svh flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative overflow-hidden max-sm:px-5 max-sm:pt-28 max-sm:pb-14">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(217,79,43,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[760px] mx-auto animate-rise-in">
          <p className="eyebrow justify-center mb-5">Built for how your brain actually works</p>
          <h1 className="font-serif text-sh1 text-text font-medium mb-6 max-sm:text-[clamp(36px,10vw,56px)]">
            Learning built for <em className="italic text-soft">your brain</em>
          </h1>
          <p className="text-[clamp(15px,1.6vw,17.5px)] leading-[1.72] text-soft font-light max-w-[560px] mx-auto mb-10">
            NeuroPath diagnoses how your brain retains information — through performance, not guesswork —
            then turns every lecture into a personalised study system.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup" className="btn-primary">
              Get started free
              <svg className="w-4 h-4 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-outline">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-y border-edge py-4 overflow-hidden">
        <div className="flex animate-scroll-x w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-[12.5px] text-whisper tracking-[1.5px] uppercase whitespace-nowrap font-light">
              {item}
              <span className="w-1 h-1 rounded-full bg-[rgba(217,79,43,0.4)]" />
            </span>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-[1080px] mx-auto">
          <div className="mb-12">
            <p className="eyebrow">How it works</p>
            <h2 className="font-serif text-sh2 text-text font-medium">Three steps to smarter studying</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {STEPS.map(s => (
              <div key={s.n} className="card">
                <div className="font-serif text-[48px] font-semibold text-[rgba(217,79,43,0.18)] leading-none mb-4 tracking-[-0.02em]">{s.n}</div>
                <h3 className="font-serif text-[20px] font-medium text-text mb-2.5 tracking-[-0.01em]">{s.title}</h3>
                <p className="text-sm text-soft leading-[1.7] font-light">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-edge max-w-[1120px] mx-auto" />

      {/* ── Features bento ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-[1080px] mx-auto">
          <div className="mb-12">
            <p className="eyebrow">Features</p>
            <h2 className="font-serif text-sh2 text-text font-medium">Everything you need, nothing you don&apos;t</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className={`
                  bg-surface border border-edge rounded-lg p-7 relative overflow-hidden
                  transition-all duration-300 hover:border-edge-2 hover:-translate-y-[3px]
                  after:content-[''] after:absolute after:inset-0
                  after:bg-gradient-to-br after:from-[rgba(255,255,255,0.018)] after:to-transparent
                  after:pointer-events-none after:rounded-[inherit]
                  ${f.wide ? "col-span-2 max-md:col-span-1" : ""}
                `}
              >
                <span className="text-[28px] block mb-3.5">{f.icon}</span>
                <h3 className="font-serif text-[18px] font-medium text-text mb-2 tracking-[-0.01em]">{f.title}</h3>
                <p className="text-[13.5px] text-soft leading-[1.7] font-light">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-edge max-w-[1120px] mx-auto" />

      {/* ── CTA section ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(217,79,43,0.07)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-medium text-text tracking-[-0.025em] leading-[1.1] mb-[18px]">
            Ready to learn <em className="italic text-soft">smarter</em>?
          </h2>
          <p className="text-base text-soft font-light leading-[1.7] mb-9">
            Join students who are studying with a system built for their brain.
            Free to start. No credit card needed.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup" className="btn-primary">
              Get started free
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/login" className="btn-outline">Sign in</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-edge py-8 px-6 flex items-center justify-between flex-wrap gap-3 max-w-[1100px] mx-auto">
        <a href="#" className="flex items-center gap-2 font-serif text-sm font-semibold text-text no-underline">
          <div className="w-5 h-5 bg-gradient-to-br from-ember to-[#8c2410] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="white" className="w-2.5 h-2.5">
              <path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25" />
              <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z" />
            </svg>
          </div>
          NeuroPath
        </a>
        <p className="text-xs text-whisper">© {new Date().getFullYear()} NeuroPath. All rights reserved.</p>
      </footer>
    </div>
  );
}
