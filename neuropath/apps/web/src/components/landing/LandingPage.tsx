"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
    <>
      <style>{`
        /* ── Landing shell ── */
        .lp { background: var(--ink); min-height: 100svh; overflow-x: hidden; }

        /* ── Nav ── */
        .lp-nav-outer {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 32px); max-width: 1100px; z-index: 500;
        }
        .lp-nav {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(13,13,15,0.85);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--edge);
          border-radius: 100px; padding: 8px 8px 8px 22px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .lp-nav.up { border-color: var(--edge2); box-shadow: 0 8px 40px rgba(0,0,0,0.55); }
        .lp-brand {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; color: var(--text);
        }
        .lp-brand-orb {
          width: 26px; height: 26px;
          background: linear-gradient(145deg, var(--ember), #8c2410);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px rgba(217,79,43,0.25);
        }
        .lp-brand-orb svg { width: 11px; height: 11px; }
        .lp-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 600; letter-spacing: 0.01em;
        }
        .lp-nav-links {
          display: flex; align-items: center; gap: 2px; list-style: none;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .lp-nav-links a {
          display: block; padding: 7px 14px;
          font-size: 13px; font-weight: 400; color: var(--soft);
          text-decoration: none; border-radius: 100px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .lp-nav-links a:hover { color: var(--text); background: rgba(255,255,255,0.07); }
        .lp-nav-right { display: flex; align-items: center; gap: 8px; }
        .lp-nav-login {
          padding: 8px 16px; font-size: 13px; color: var(--soft);
          background: none; border: 1px solid var(--edge2);
          border-radius: 100px; text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
        }
        .lp-nav-login:hover { color: var(--text); border-color: rgba(255,255,255,0.25); }
        .lp-nav-hbg {
          display: none; width: 34px; height: 34px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--edge);
          border-radius: 50%; cursor: pointer;
          align-items: center; justify-content: center; flex-direction: column; gap: 4px;
        }
        .lp-nav-hbg span {
          display: block; width: 13px; height: 1px;
          background: rgba(255,255,255,0.75); border-radius: 2px;
          transition: all 0.24s ease; transform-origin: center;
        }
        .lp-nav-hbg.open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
        .lp-nav-hbg.open span:nth-child(2) { opacity: 0; }
        .lp-nav-hbg.open span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .lp-drawer {
          position: fixed; inset: 0; z-index: 490;
          background: rgba(9,9,11,0.97); backdrop-filter: blur(28px);
          display: flex; flex-direction: column;
          padding: 90px 28px 44px;
          opacity: 0; visibility: hidden;
          transition: opacity 0.25s, visibility 0.25s;
        }
        .lp-drawer.open { opacity: 1; visibility: visible; }
        .lp-drawer ul { list-style: none; display: flex; flex-direction: column; gap: 2px; }
        .lp-drawer a {
          display: block; padding: 15px 16px;
          font-size: 20px; font-family: 'Playfair Display', serif;
          color: rgba(240,237,232,0.6); text-decoration: none;
          border-radius: 12px; border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.18s, background 0.18s;
        }
        .lp-drawer a:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .lp-drawer-cta { margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--edge); }

        /* ── Hero ── */
        .lp-hero {
          min-height: 100svh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative; overflow: hidden;
        }

        /* Diagonal bars */
        .lp-hero-bars {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
        }
        .lp-bar {
          position: absolute;
          width: 3px; height: 120%;
          background: linear-gradient(to bottom, transparent, rgba(217,79,43,0.12), transparent);
          transform: rotate(-32deg);
          top: -10%;
        }
        .lp-bar:nth-child(1) { left: 12%;  animation: barFloat 14s ease-in-out infinite; }
        .lp-bar:nth-child(2) { left: 28%;  animation: barFloat 18s 2s ease-in-out infinite; opacity: 0.6; }
        .lp-bar:nth-child(3) { left: 50%;  animation: barFloat 16s 1s ease-in-out infinite; opacity: 0.4; }
        .lp-bar:nth-child(4) { left: 68%;  animation: barFloat 20s 3s ease-in-out infinite; opacity: 0.7; }
        .lp-bar:nth-child(5) { left: 84%;  animation: barFloat 15s 0.5s ease-in-out infinite; opacity: 0.5; }

        /* Glow */
        .lp-hero-glow {
          position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px; pointer-events: none;
          background: radial-gradient(ellipse, rgba(217,79,43,0.07) 0%, transparent 70%);
        }

        .lp-hero-inner { position: relative; z-index: 1; max-width: 820px; }
        .lp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(217,79,43,0.08); border: 1px solid rgba(217,79,43,0.22);
          border-radius: 100px; padding: 6px 14px;
          font-size: 11.5px; color: var(--ember); letter-spacing: 0.04em;
          margin-bottom: 24px; animation: riseIn 0.7s ease both;
        }
        .lp-hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--ember); animation: pulse 2s ease infinite;
        }
        .lp-hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 8vw, 96px);
          font-weight: 500; color: var(--text);
          line-height: 1.04; letter-spacing: -0.03em;
          margin-bottom: 24px;
          animation: riseIn 0.9s 0.1s ease both;
        }
        .lp-hero-h1 em { font-style: italic; color: rgba(240,237,232,0.55); }
        .lp-hero-sub {
          font-size: clamp(15px, 1.8vw, 18px);
          color: var(--soft); line-height: 1.7; font-weight: 300;
          max-width: 560px; margin: 0 auto 36px;
          animation: riseIn 0.9s 0.2s ease both;
        }
        .lp-hero-ctas {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap;
          animation: riseIn 0.9s 0.3s ease both;
        }

        /* ── Marquee ── */
        .lp-marquee {
          padding: 28px 0;
          border-top: 1px solid var(--edge);
          border-bottom: 1px solid var(--edge);
          overflow: hidden; position: relative;
        }
        .lp-marquee-track {
          display: flex; gap: 0;
          width: max-content;
          animation: scrollX 28s linear infinite;
        }
        .lp-marquee-item {
          display: flex; align-items: center; gap: 16px;
          padding: 0 32px;
          font-size: 13px; color: var(--whisper);
          letter-spacing: 0.08em; text-transform: uppercase;
          white-space: nowrap; font-weight: 400;
        }
        .lp-marquee-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--flame); flex-shrink: 0;
        }

        /* ── How it works ── */
        .lp-steps { padding: 100px 24px 80px; }
        .lp-steps-inner { max-width: 1080px; margin: 0 auto; }
        .lp-steps-head { text-align: center; margin-bottom: 64px; }
        .lp-steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .lp-step-card {
          background: var(--surface); border: 1px solid var(--edge);
          border-radius: 20px; padding: 32px 28px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .lp-step-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none; border-radius: inherit;
        }
        .lp-step-card:hover { border-color: var(--edge2); transform: translateY(-4px); }
        .lp-step-num {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 600;
          color: rgba(217,79,43,0.18); line-height: 1;
          margin-bottom: 16px; letter-spacing: -0.02em;
        }
        .lp-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 500; color: var(--text);
          margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .lp-step-body {
          font-size: 14px; color: var(--soft); line-height: 1.7; font-weight: 300;
        }

        /* ── Bento features ── */
        .lp-features { padding: 80px 24px 100px; }
        .lp-features-inner { max-width: 1080px; margin: 0 auto; }
        .lp-features-head { margin-bottom: 48px; }
        .lp-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 16px;
        }
        .lp-bento-card {
          background: var(--surface); border: 1px solid var(--edge);
          border-radius: 20px; padding: 28px 26px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .lp-bento-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none; border-radius: inherit;
        }
        .lp-bento-card:hover { border-color: var(--edge2); transform: translateY(-3px); }
        .lp-bento-card.wide { grid-column: span 2; }
        .lp-bento-icon {
          font-size: 28px; margin-bottom: 14px;
          display: block;
        }
        .lp-bento-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 500; color: var(--text);
          margin-bottom: 8px; letter-spacing: -0.01em;
        }
        .lp-bento-body {
          font-size: 13.5px; color: var(--soft); line-height: 1.7; font-weight: 300;
        }

        /* ── CTA section ── */
        .lp-cta {
          padding: 100px 24px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .lp-cta::before {
          content: '';
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(217,79,43,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-cta-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
        .lp-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 56px); font-weight: 500;
          color: var(--text); letter-spacing: -0.025em; line-height: 1.1;
          margin-bottom: 18px;
        }
        .lp-cta h2 em { font-style: italic; color: rgba(240,237,232,0.55); }
        .lp-cta p {
          font-size: 16px; color: var(--soft); font-weight: 300;
          line-height: 1.7; margin-bottom: 36px;
        }
        .lp-cta-btns { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

        /* ── Footer ── */
        .lp-footer {
          border-top: 1px solid var(--edge);
          padding: 32px 24px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          max-width: 1100px; margin: 0 auto;
        }
        .lp-footer-brand {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 600; color: var(--text);
          text-decoration: none;
        }
        .lp-footer-note { font-size: 12px; color: var(--whisper); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .lp-nav-links { display: none; }
          .lp-nav-hbg   { display: flex; }
          .lp-steps-grid { grid-template-columns: 1fr; }
          .lp-bento      { grid-template-columns: 1fr; }
          .lp-bento-card.wide { grid-column: span 1; }
        }
        @media (max-width: 640px) {
          .lp-hero { padding: 110px 20px 60px; }
          .lp-hero-h1 { font-size: clamp(36px, 10vw, 56px); }
        }
      `}</style>

      <div className="lp">
        {/* ── Nav ── */}
        <nav className="lp-nav-outer">
          <div className={`lp-nav${scrolled ? " up" : ""}`}>
            <Link href="/" className="lp-brand">
              <div className="lp-brand-orb">
                <svg viewBox="0 0 20 20" fill="white">
                  <path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25"/>
                  <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/>
                </svg>
              </div>
              <span className="lp-brand-name">NeuroPath</span>
            </Link>

            <ul className="lp-nav-links">
              {["How it works", "Features", "Diagnostics"].map(l => (
                <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</a></li>
              ))}
            </ul>

            <div className="lp-nav-right">
              <Link href="/login"  className="lp-nav-login">Sign in</Link>
              <Link href="/signup" className="btn-p" style={{ padding: "8px 18px", fontSize: 13 }}>
                Get started
              </Link>
              <button
                className={`lp-nav-hbg${menuOpen ? " open" : ""}`}
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Menu"
              >
                <span/><span/><span/>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div className={`lp-drawer${menuOpen ? " open" : ""}`}>
          <ul>
            {["How it works", "Features", "Diagnostics"].map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)}>{l}</a>
              </li>
            ))}
          </ul>
          <div className="lp-drawer-cta">
            <Link href="/signup" className="btn-p" style={{ width: "100%", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
              Get started free
            </Link>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="lp-hero" id="hero">
          <div className="lp-hero-bars">
            {[1,2,3,4,5].map(i => <div className="lp-bar" key={i}/>)}
          </div>
          <div className="lp-hero-glow"/>
          <div className="lp-hero-inner">
            <div className="lp-hero-badge">
              <div className="lp-hero-badge-dot"/>
              AI-powered personalised learning
            </div>
            <h1 className="lp-hero-h1">
              Learning built<br/>
              <em>for your brain.</em>
            </h1>
            <p className="lp-hero-sub">
              NeuroPath diagnoses how you actually retain information — through
              performance, not guesswork — then turns every lecture into a
              personalised study system.
            </p>
            <div className="lp-hero-ctas">
              <Link href="/signup" className="btn-p">
                Start for free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="btn-arrow">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#how-it-works" className="btn-o">See how it works</a>
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <div className="lp-marquee">
          <div className="lp-marquee-track">
            {Array(2).fill([
              "Performance-based diagnostics",
              "AI study pack generation",
              "Personalised flashcards",
              "Growth mindset coaching",
              "Lecture transcription",
              "Smart study roadmap",
              "Teach-back scripts",
              "Learning profile engine",
            ]).flat().map((t, i) => (
              <div className="lp-marquee-item" key={i}>
                <div className="lp-marquee-dot"/>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <section className="lp-steps" id="how-it-works">
          <div className="lp-steps-inner">
            <div className="lp-steps-head">
              <p className="eyebrow">How it works</p>
              <h2 className="sh2">Three steps to<br/>a smarter study system.</h2>
            </div>
            <div className="lp-steps-grid">
              {[
                {
                  n: "01",
                  title: "Diagnose",
                  body: "A 20-minute performance test across four learning methods reveals exactly how your brain retains information. No surveys. Pure data.",
                },
                {
                  n: "02",
                  title: "Personalise",
                  body: "Record any lecture. AI transcribes it and generates flashcards, quizzes, and teach-back scripts — all weighted to your learning profile.",
                },
                {
                  n: "03",
                  title: "Coach",
                  body: "Set a test date. Get a day-by-day roadmap of 10–20 minute tasks with growth mindset coaching after every session.",
                },
              ].map(s => (
                <div className="lp-step-card" key={s.n}>
                  <div className="lp-step-num">{s.n}</div>
                  <p className="lp-step-title">{s.title}</p>
                  <p className="lp-step-body">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features bento ── */}
        <section className="lp-features" id="features">
          <div className="lp-features-inner">
            <div className="lp-features-head">
              <p className="eyebrow">Features</p>
              <h2 className="sh2">Everything you need<br/>to study smarter.</h2>
            </div>
            <div className="lp-bento">
              <div className="lp-bento-card wide">
                <span className="lp-bento-icon">🧠</span>
                <p className="lp-bento-title">Learning Profile Engine</p>
                <p className="lp-bento-body">
                  The diagnostic scores accuracy, speed, and retention across flashcards,
                  practice problems, visual mapping, and teach-back. Your profile updates
                  with every session — getting sharper over time.
                </p>
              </div>
              <div className="lp-bento-card">
                <span className="lp-bento-icon">🎙</span>
                <p className="lp-bento-title">Lecture Recording</p>
                <p className="lp-bento-body">
                  Tap to record. AI transcribes your lecture and structures the content automatically.
                </p>
              </div>
              <div className="lp-bento-card">
                <span className="lp-bento-icon">📚</span>
                <p className="lp-bento-title">Personalised Study Packs</p>
                <p className="lp-bento-body">
                  Every pack is weighted to your profile. Two students get the same lecture — two completely different study materials.
                </p>
              </div>
              <div className="lp-bento-card">
                <span className="lp-bento-icon">🗺</span>
                <p className="lp-bento-title">Smart Roadmap</p>
                <p className="lp-bento-body">
                  Set a test date. Get a structured day-by-day plan that adapts as you progress.
                </p>
              </div>
              <div className="lp-bento-card">
                <span className="lp-bento-icon">💪</span>
                <p className="lp-bento-title">Growth Mindset Coaching</p>
                <p className="lp-bento-body">
                  Built on Carol Dweck's research. Short coaching messages fire after every completed session.
                </p>
              </div>
              <div className="lp-bento-card">
                <span className="lp-bento-icon">📊</span>
                <p className="lp-bento-title">Progress Tracking</p>
                <p className="lp-bento-body">
                  See which methods are strengthening over time and which need more work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta" id="diagnostics">
          <div className="lp-cta-inner">
            <h2>
              Ready to find out<br/>
              <em>how you learn?</em>
            </h2>
            <p>
              Take the 20-minute diagnostic and unlock a study system that
              actually fits your brain. Free to start.
            </p>
            <div className="lp-cta-btns">
              <Link href="/signup" className="btn-p">
                Start the diagnostic
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="btn-arrow">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/login" className="btn-o">Sign in</Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: "1px solid var(--edge)", padding: "28px 24px" }}>
          <div className="lp-footer">
            <Link href="/" className="lp-footer-brand">
              <div className="lp-brand-orb" style={{ width: 20, height: 20 }}>
                <svg viewBox="0 0 20 20" fill="white" style={{ width: 9, height: 9 }}>
                  <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/>
                </svg>
              </div>
              NeuroPath
            </Link>
            <p className="lp-footer-note">
              © {new Date().getFullYear()} NeuroPath. Built for students who want to understand how they learn.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
