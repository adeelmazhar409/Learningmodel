"use client";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   SHARED CSS
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --ink:     #0c0c0e;
  --ink2:    #111114;
  --surface: #141418;
  --lift:    #1c1c22;
  --edge:    rgba(255,255,255,0.07);
  --edge2:   rgba(255,255,255,0.13);
  --flame:   #d94f2b;
  --ember:   #e8603c;
  --text:    #f0ede8;
  --soft:    rgba(240,237,232,0.55);
  --faint:   rgba(240,237,232,0.08);
  --whisper: rgba(240,237,232,0.25);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{background:var(--ink);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;font-weight:300;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::selection{background:rgba(217,79,43,0.28);color:#fff;}

/* Grain */
body::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.032'/%3E%3C/svg%3E");
opacity:.55;mix-blend-mode:overlay;}

/* Typography helpers */
.pf{font-family:'Playfair Display',Georgia,serif;}
.pf-i{font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:400;}
.dm{font-family:'DM Sans',sans-serif;}

/* ═══════ NAV ═══════ */
.nav-wrap{position:fixed;top:18px;left:50%;transform:translateX(-50%);width:calc(100% - 36px);max-width:1200px;z-index:600;}
.nav-pill{display:flex;align-items:center;justify-content:space-between;
  background:rgba(13,13,15,0.85);backdrop-filter:blur(28px) saturate(1.5);-webkit-backdrop-filter:blur(28px) saturate(1.5);
  border:1px solid var(--edge);border-radius:100px;padding:7px 7px 7px 20px;transition:border-color .3s,box-shadow .3s;}
.nav-pill.up{border-color:var(--edge2);box-shadow:0 8px 48px rgba(0,0,0,0.65),inset 0 1px 0 rgba(255,255,255,0.04);}

.brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--text);flex-shrink:0;}
.brand-orb{width:28px;height:28px;background:linear-gradient(145deg,var(--ember),#8c2410);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 0 1px rgba(255,255,255,0.08),0 4px 12px rgba(217,79,43,0.28);}
.brand-orb svg{width:12px;height:12px;}
.brand-name{font-family:'Playfair Display',serif;font-size:15.5px;font-weight:600;letter-spacing:0.01em;}

.nav-tabs{display:flex;align-items:center;gap:2px;list-style:none;position:absolute;left:50%;transform:translateX(-50%);}
.nav-tabs button{background:none;border:none;padding:7px 14px;font-size:13px;font-weight:400;color:var(--soft);border-radius:100px;cursor:pointer;transition:color .2s,background .2s;font-family:'DM Sans',sans-serif;letter-spacing:0.01em;white-space:nowrap;}
.nav-tabs button:hover,.nav-tabs button.active{color:var(--text);background:rgba(255,255,255,0.07);}
.nav-tabs button.active{color:var(--text);}

.nav-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.nav-ghost{background:none;border:none;color:var(--soft);font-size:13px;padding:7px 14px;border-radius:100px;cursor:pointer;transition:color .2s,background .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;}
.nav-ghost:hover{color:var(--text);background:rgba(255,255,255,0.06);}
.nav-cta{display:flex;align-items:center;gap:7px;background:var(--text);color:var(--ink);border:none;border-radius:100px;padding:9px 20px;font-size:13px;font-weight:500;cursor:pointer;text-decoration:none;font-family:'DM Sans',sans-serif;transition:opacity .2s,transform .2s,box-shadow .2s;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.3);}
.nav-cta:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 6px 22px rgba(0,0,0,0.45);}
.nav-cta-dot{width:5px;height:5px;border-radius:50%;background:var(--flame);flex-shrink:0;}

/* Hamburger */
.hbg{display:none;width:34px;height:34px;background:rgba(255,255,255,0.05);border:1px solid var(--edge);border-radius:50%;cursor:pointer;flex-shrink:0;align-items:center;justify-content:center;flex-direction:column;gap:4px;}
.hbg span{display:block;width:13px;height:1px;background:rgba(255,255,255,0.75);border-radius:2px;transition:all .24s ease;transform-origin:center;}
.hbg.open span:nth-child(1){transform:translateY(5px) rotate(45deg);}
.hbg.open span:nth-child(2){opacity:0;transform:scaleX(0);}
.hbg.open span:nth-child(3){transform:translateY(-5px) rotate(-45deg);}

/* Drawer */
.drawer{display:none;position:fixed;inset:0;z-index:590;background:rgba(9,9,11,0.97);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);flex-direction:column;padding:96px 28px 40px;opacity:0;pointer-events:none;transition:opacity .25s ease;}
.drawer.open{display:flex;opacity:1;pointer-events:all;}
.drawer-list{list-style:none;display:flex;flex-direction:column;gap:2px;flex:1;}
.drawer-list button{background:none;border:none;width:100%;text-align:left;padding:15px 16px;font-size:19px;font-weight:400;font-family:'Playfair Display',serif;color:rgba(240,237,232,.65);border-radius:12px;cursor:pointer;transition:all .18s;border-bottom:1px solid rgba(255,255,255,0.04);}
.drawer-list button:hover,.drawer-list button.active{color:var(--text);background:rgba(255,255,255,0.04);}
.drawer-foot{display:flex;flex-direction:column;gap:10px;padding-top:24px;border-top:1px solid var(--edge);}
.d-cta{display:flex;align-items:center;justify-content:center;background:var(--text);color:var(--ink);border:none;border-radius:100px;padding:15px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;}
.d-ghost{display:flex;align-items:center;justify-content:center;background:none;color:var(--soft);border:1px solid var(--edge);border-radius:100px;padding:14px;font-size:15px;font-weight:400;font-family:'DM Sans',sans-serif;cursor:pointer;}

/* ═══════ SHARED SECTION ELEMENTS ═══════ */
.section{padding:110px 24px 90px;}
.section-inner{max-width:1120px;margin:0 auto;}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:400;letter-spacing:2.2px;text-transform:uppercase;color:var(--flame);margin-bottom:20px;}
.eyebrow::before{content:'';display:block;width:22px;height:1px;background:var(--flame);flex-shrink:0;}
.sh1{font-size:clamp(44px,7vw,88px);line-height:1.04;letter-spacing:-0.03em;color:var(--text);margin-bottom:24px;}
.sh2{font-size:clamp(30px,3.8vw,48px);line-height:1.1;letter-spacing:-0.025em;color:var(--text);margin-bottom:16px;}
.sh3{font-size:clamp(22px,2.5vw,32px);line-height:1.2;letter-spacing:-0.02em;color:var(--text);margin-bottom:12px;}
.lead{font-size:clamp(15px,1.6vw,17.5px);line-height:1.72;color:var(--soft);font-weight:300;}
.rule{height:1px;background:var(--edge);max-width:1120px;margin:0 auto;}

/* Shared card */
.card{background:var(--surface);border:1px solid var(--edge);border-radius:20px;padding:32px 30px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s,box-shadow .3s;}
.card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.022) 0%,transparent 55%);pointer-events:none;border-radius:inherit;}
.card:hover{border-color:var(--edge2);transform:translateY(-4px);box-shadow:0 18px 56px rgba(0,0,0,0.42);}
.card-icon{width:44px;height:44px;border:1px solid var(--edge2);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:22px;background:rgba(217,79,43,0.08);}
.card-icon svg{width:20px;height:20px;stroke:var(--ember);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.card-title{font-family:'Playfair Display',serif;font-size:19px;font-weight:500;color:var(--text);margin-bottom:10px;letter-spacing:-0.01em;line-height:1.3;}
.card-desc{font-size:14px;color:var(--soft);line-height:1.7;font-weight:300;}

/* Buttons */
.btn-p{display:inline-flex;align-items:center;gap:9px;background:var(--text);color:var(--ink);border:none;border-radius:100px;padding:14px 28px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;font-family:'DM Sans',sans-serif;transition:opacity .2s,transform .2s,box-shadow .2s;box-shadow:0 4px 22px rgba(0,0,0,0.3);white-space:nowrap;letter-spacing:0.01em;}
.btn-p:hover{opacity:.92;transform:translateY(-2px);box-shadow:0 10px 36px rgba(0,0,0,0.5);}
.btn-o{display:inline-flex;align-items:center;gap:9px;background:transparent;color:var(--soft);border:1px solid var(--edge2);border-radius:100px;padding:13px 26px;font-size:14px;font-weight:400;cursor:pointer;text-decoration:none;font-family:'DM Sans',sans-serif;transition:color .2s,border-color .2s,transform .2s,background .2s;white-space:nowrap;}
.btn-o:hover{color:var(--text);border-color:rgba(255,255,255,0.26);background:rgba(255,255,255,0.04);transform:translateY(-2px);}
.btn-arrow{opacity:.5;transition:opacity .2s,transform .2s;}
.btn-p:hover .btn-arrow,.btn-o:hover .btn-arrow{opacity:1;transform:translateX(3px);}

/* Animations */
@keyframes riseIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes scrollX{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes barFloat{0%,100%{transform:rotate(-32deg) translateY(0)}50%{transform:rotate(-32deg) translateY(-16px)}}

.rise{animation:riseIn .9s ease both;}
.rise-1{animation:riseIn .9s .1s ease both;}
.rise-2{animation:riseIn .9s .2s ease both;}
.rise-3{animation:riseIn .9s .3s ease both;}
.rise-4{animation:riseIn .9s .4s ease both;}

/* ═══════ RESPONSIVE ═══════ */
@media(max-width:1080px){
  .nav-tabs{display:none;}.nav-ghost{display:none;}.hbg{display:flex;}.nav-cta{display:none;}
}
@media(max-width:640px){
  .nav-wrap{width:calc(100% - 22px);top:12px;}
  .nav-pill{padding:7px 7px 7px 16px;}
  .section{padding:100px 18px 70px;}
  .btn-p,.btn-o{padding:14px 20px;font-size:14.5px;}
}
`;

/* ═══════════════════════════════════════════════════════════
   SVG ICON LIBRARY
═══════════════════════════════════════════════════════════ */
const Icon = {
  Brain:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>,
  Mic:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  BookOpen: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Leaf:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>,
  Users:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Zap:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>,
  Check:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  ArrowR:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Target:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Award:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>,
  Globe:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  Shield:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>,
  Layers:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>,
  Compass:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>,
  Star:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Tag:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>,
  Logo:     () => <svg viewBox="0 0 20 20" fill="white"><path d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z" opacity=".25"/><path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z"/></svg>,
};

/* ═══════════════════════════════════════════════════════════
   PAGE — HOME
═══════════════════════════════════════════════════════════ */
const HomeCSS = `
/* ── Hero ── */
.h-hero{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:130px 24px 80px;}
.h-canvas{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.h-orb{position:absolute;border-radius:50%;filter:blur(80px);}
.h-orb-a{width:680px;height:480px;background:radial-gradient(ellipse,rgba(175,48,20,0.22) 0%,transparent 70%);top:-80px;right:-100px;animation:floatY 18s ease-in-out infinite;}
.h-orb-b{width:480px;height:360px;background:radial-gradient(ellipse,rgba(130,28,10,0.14) 0%,transparent 70%);bottom:0;left:-60px;animation:floatY 22s 4s ease-in-out infinite;}
.h-bars{position:absolute;top:-60px;right:-80px;width:660px;height:880px;transform:rotate(-32deg);animation:barFloat 12s ease-in-out infinite;}
.h-bar{position:absolute;border-radius:18px;}
.h-bar-1{width:108px;left:470px;top:-20px;height:660px;background:linear-gradient(180deg,#b83820 0%,#4a1008 55%,transparent 100%);opacity:.9;box-shadow:0 0 70px rgba(180,50,20,0.22);}
.h-bar-2{width:88px;left:375px;top:-38px;height:620px;background:linear-gradient(180deg,#d44828 0%,#6a1810 50%,transparent 100%);opacity:.83;filter:blur(1px);}
.h-bar-3{width:70px;left:292px;top:-18px;height:580px;background:linear-gradient(180deg,#df5430 0%,#801a10 48%,transparent 100%);opacity:.78;filter:blur(.5px);}
.h-bar-4{width:56px;left:222px;top:10px;height:540px;background:linear-gradient(180deg,#c84828 0%,#5a1408 45%,transparent 100%);opacity:.65;filter:blur(2px);}
.h-bar-5{width:42px;left:162px;top:28px;height:480px;background:linear-gradient(180deg,#a83820 0%,#3a0c08 42%,transparent 100%);opacity:.5;filter:blur(4px);}
.h-bar-6{width:30px;left:112px;top:56px;height:420px;background:linear-gradient(180deg,#883018 0%,#280804 38%,transparent 100%);opacity:.36;filter:blur(6px);}
.h-canvas::after{content:'';position:absolute;bottom:0;left:0;right:0;height:240px;background:linear-gradient(to bottom,transparent,var(--ink));}
.h-rule-top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent 0%,rgba(255,255,255,0.06) 30%,rgba(255,255,255,0.06) 70%,transparent 100%);}

.h-body{position:relative;z-index:10;text-align:center;max-width:760px;width:100%;}
.h-tag{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(217,79,43,0.28);border-radius:100px;padding:6px 16px;font-size:11px;font-weight:400;color:rgba(232,96,60,.9);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:36px;background:rgba(217,79,43,0.06);}
.h-tag-dot{width:5px;height:5px;border-radius:50%;background:var(--ember);flex-shrink:0;animation:pulse 2.5s ease infinite;}
.h-h1{font-size:clamp(44px,7.5vw,90px);line-height:1.03;letter-spacing:-0.03em;margin-bottom:26px;}
.h-lead{font-size:clamp(15px,1.7vw,17.5px);line-height:1.72;color:var(--soft);max-width:480px;margin:0 auto 48px;font-weight:300;}
.h-actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;}
.h-foot{margin-top:32px;font-size:11.5px;color:var(--whisper);letter-spacing:.06em;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;}
.h-sep{margin:0 10px;opacity:.3;}

/* Proof marquee */
.proof-band{border-top:1px solid var(--edge);border-bottom:1px solid var(--edge);padding:20px 0;overflow:hidden;position:relative;}
.proof-band::before,.proof-band::after{content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none;}
.proof-band::before{left:0;background:linear-gradient(to right,var(--ink),transparent);}
.proof-band::after{right:0;background:linear-gradient(to left,var(--ink),transparent);}
.proof-track{display:flex;align-items:center;gap:44px;animation:scrollX 28s linear infinite;width:max-content;}
.proof-chip{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:400;color:var(--whisper);white-space:nowrap;letter-spacing:.04em;text-transform:uppercase;}
.proof-chip svg{width:13px;height:13px;stroke:var(--flame);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}

/* Bento */
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;margin-top:56px;}
.bc-a{grid-column:span 5;}.bc-b{grid-column:span 7;}.bc-c{grid-column:span 4;}.bc-d{grid-column:span 4;}.bc-e{grid-column:span 4;}.bc-f{grid-column:span 12;}
.bc-f-inner{display:flex;align-items:center;gap:40px;flex-wrap:wrap;}
.bc-f-text{flex:1;min-width:260px;}
.bc-f-stats{display:flex;gap:28px;flex-wrap:wrap;}
.stat-n{font-family:'Playfair Display',serif;font-size:34px;font-weight:600;color:var(--text);line-height:1;letter-spacing:-0.02em;margin-bottom:4px;}
.stat-l{font-size:12px;color:var(--soft);line-height:1.4;max-width:88px;}
.card-shine{position:absolute;top:0;right:0;width:160px;height:160px;background:radial-gradient(circle at top right,rgba(217,79,43,0.1) 0%,transparent 70%);pointer-events:none;}

/* Steps */
.steps-bg{background:var(--ink2);border-top:1px solid var(--edge);border-bottom:1px solid var(--edge);}
.steps-grid{display:grid;grid-template-columns:repeat(4,1fr);margin-top:52px;}
.step-col{padding:36px 28px;border-right:1px solid var(--edge);}.step-col:last-child{border-right:none;}
.step-n-row{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.step-n{font-family:'Playfair Display',serif;font-size:12px;font-weight:400;color:var(--flame);letter-spacing:.06em;}
.step-ln{flex:1;height:1px;background:var(--edge);}
.step-t{font-family:'Playfair Display',serif;font-size:18px;font-weight:500;color:var(--text);margin-bottom:9px;line-height:1.3;letter-spacing:-.01em;}
.step-d{font-size:13.5px;color:var(--soft);line-height:1.65;font-weight:300;}

/* Quote */
.q-wrap{max-width:820px;margin:0 auto;text-align:center;}
.q-mark{font-family:'Playfair Display',serif;font-size:80px;color:rgba(217,79,43,0.18);line-height:.5;margin-bottom:28px;display:block;}
.q-text{font-family:'Playfair Display',serif;font-size:clamp(20px,2.8vw,30px);font-style:italic;font-weight:400;color:var(--text);line-height:1.48;letter-spacing:-.01em;margin-bottom:24px;}
.q-attr{font-size:11.5px;color:var(--whisper);letter-spacing:.1em;text-transform:uppercase;}

/* CTA box */
.cta-box{max-width:1120px;margin:0 auto;background:var(--surface);border:1px solid var(--edge);border-radius:28px;padding:80px 60px;text-align:center;position:relative;overflow:hidden;}
.cta-box::before{content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;background:linear-gradient(to right,transparent,var(--flame),transparent);}
.cta-glow{position:absolute;pointer-events:none;top:-100px;left:50%;transform:translateX(-50%);width:550px;height:280px;background:radial-gradient(ellipse,rgba(217,79,43,0.11) 0%,transparent 70%);filter:blur(18px);}
.cta-actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;position:relative;}

/* Footer */
.footer{border-top:1px solid var(--edge);padding:34px 40px;display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:0 auto;flex-wrap:wrap;gap:12px;}
.footer-brand{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-size:14px;color:var(--soft);font-weight:500;}
.footer-copy{font-size:12px;color:var(--whisper);letter-spacing:.03em;}

/* Home responsive */
@media(max-width:1080px){
  .bento{grid-template-columns:repeat(6,1fr);}
  .bc-a{grid-column:span 3;}.bc-b{grid-column:span 3;}.bc-c{grid-column:span 2;}.bc-d{grid-column:span 2;}.bc-e{grid-column:span 2;}.bc-f{grid-column:span 6;}
  .steps-grid{grid-template-columns:repeat(2,1fr);}
  .step-col:nth-child(2){border-right:none;}.step-col:nth-child(3),.step-col:nth-child(4){border-top:1px solid var(--edge);}
  .step-col:nth-child(4){border-right:none;}
  .h-bars{width:500px;right:-60px;}
}
@media(max-width:640px){
  .h-hero{padding:104px 18px 56px;}
  .h-bars{width:320px;right:-44px;top:-28px;}
  .h-actions{flex-direction:column;width:100%;max-width:320px;margin:0 auto;}
  .h-actions .btn-p,.h-actions .btn-o{width:100%;justify-content:center;padding:15px 18px;}
  .bento{grid-template-columns:1fr;gap:10px;}
  .bc-a,.bc-b,.bc-c,.bc-d,.bc-e,.bc-f{grid-column:span 1;}
  .bc-f-inner{flex-direction:column;gap:24px;}
  .bc-f-stats{justify-content:space-around;}
  .steps-grid{grid-template-columns:1fr;}
  .step-col{border-right:none;border-bottom:1px solid var(--edge);padding:26px 18px;}
  .step-col:last-child{border-bottom:none;}
  .cta-box{padding:48px 22px;border-radius:20px;}
  .cta-actions{flex-direction:column;}
  .cta-actions .btn-p,.cta-actions .btn-o{width:100%;justify-content:center;}
  .footer{flex-direction:column;align-items:center;text-align:center;padding:26px 18px;}
}
`;

function HomePage() {
  const proofItems = [
    { label: "Performance Diagnostics",  Icon: Icon.Target },
    { label: "Live Lecture AI",          Icon: Icon.Mic },
    { label: "Growth Mindset Coaching",  Icon: Icon.Leaf },
    { label: "Stanford-Aligned Research",Icon: Icon.Globe },
    { label: "Teacher Analytics",        Icon: Icon.BarChart },
    { label: "Grade-Adaptive Tests",     Icon: Icon.Layers },
  ];
  const doubled = [...proofItems, ...proofItems, ...proofItems];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HomeCSS }} />

      {/* Hero */}
      <section className="h-hero">
        <div className="h-canvas" aria-hidden="true">
          <div className="h-rule-top" />
          <div className="h-orb h-orb-a" /><div className="h-orb h-orb-b" />
          <div className="h-bars">
            <div className="h-bar h-bar-1"/><div className="h-bar h-bar-2"/>
            <div className="h-bar h-bar-3"/><div className="h-bar h-bar-4"/>
            <div className="h-bar h-bar-5"/><div className="h-bar h-bar-6"/>
          </div>
        </div>
        <div className="h-body">
          <div className="h-tag rise"><span className="h-tag-dot"/>Backed by Growth Mindset Science</div>
          <h1 className="h-h1 pf rise-1">Learning built for<br/><em className="pf-i" style={{color:"rgba(240,237,232,.72)"}}>your brain.</em></h1>
          <p className="h-lead rise-2">NeuroPath diagnoses how your brain retains information — through performance, not guesswork — then turns every lecture into a personalized study system.</p>
          <div className="h-actions rise-3">
            <a href="#" className="btn-p">Begin Your Diagnostic <span className="btn-arrow"><Icon.ArrowR /></span></a>
            <a href="#" className="btn-o">Watch how it works</a>
          </div>
          <div className="h-foot rise-4">
            <span>Grades 5–12</span><span className="h-sep">·</span>
            <span>5 Subjects</span><span className="h-sep">·</span>
            <span>Stanford-Aligned</span><span className="h-sep">·</span>
            <span>Ready Set Growth</span>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="proof-band">
        <div className="proof-track">
          {doubled.map((p, i) => (
            <span className="proof-chip" key={i}>
              <p.Icon />{p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Features bento */}
      <section className="section">
        <div className="section-inner">
          <p className="eyebrow">The Platform</p>
          <h2 className="sh2 pf">Everything your brain<br/><span className="pf-i" style={{color:"var(--soft)"}}>needs to excel.</span></h2>
          <p className="lead" style={{maxWidth:500}}>One cohesive system — from diagnostic to daily coaching — that adapts entirely to you.</p>
          <div className="bento">
            <article className="card bc-a"><div className="card-shine"/><div className="card-icon"><Icon.Brain /></div><h3 className="card-title">Performance-Based Diagnostics</h3><p className="card-desc">We measure accuracy, speed, and delayed recall across four learning methods. No self-reporting. Pure cognitive performance data.</p></article>
            <article className="card bc-b"><div className="card-icon"><Icon.Mic /></div><h3 className="card-title">Live Lecture Transcription</h3><p className="card-desc">Record any class in real time. AI converts speech to structured text, extracts key concepts, and begins building your study materials before you leave the room.</p></article>
            <article className="card bc-c"><div className="card-icon"><Icon.BookOpen /></div><h3 className="card-title">Personalized Study Packs</h3><p className="card-desc">Flashcards, quizzes, mind maps, and teach-back scripts — each weighted to your learning profile.</p></article>
            <article className="card bc-d"><div className="card-icon"><Icon.Calendar /></div><h3 className="card-title">Anti-Procrastination Roadmap</h3><p className="card-desc">Micro-tasks and timed reminders built around your test date and your actual schedule.</p></article>
            <article className="card bc-e"><div className="card-icon"><Icon.Leaf /></div><h3 className="card-title">Growth Mindset Coaching</h3><p className="card-desc">Powered by Ready Set Growth and Dweck's research — identity-building language after every session.</p></article>
            <article className="card bc-f">
              <div className="bc-f-inner">
                <div className="bc-f-text"><div className="card-icon"><Icon.BarChart /></div><h3 className="card-title">Teacher Intelligence Dashboard</h3><p className="card-desc">See precisely how your class learns — not just scores. Identify at-risk students early and receive actionable teaching recommendations.</p></div>
                <div className="bc-f-stats">
                  {[{n:"4×",l:"Learning methods measured"},{n:"20",l:"Questions per diagnostic"},{n:"5",l:"Grade-adaptive subjects"},{n:"100%",l:"Personalized to you"}].map(s=>(
                    <div key={s.l}><div className="stat-n">{s.n}</div><div className="stat-l">{s.l}</div></div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section steps-bg">
        <div className="section-inner">
          <p className="eyebrow">How It Works</p>
          <h2 className="sh2 pf">Four steps.<br/><span className="pf-i" style={{color:"var(--soft)"}}>Infinite improvement.</span></h2>
          <div className="steps-grid">
            {[
              {n:"01",t:"Take the Diagnostic",d:"A 20-minute performance test across four learning methods reveals exactly how your brain retains information."},
              {n:"02",t:"Record Your Lecture",d:"Tap record in class. Real-time transcription, key-term extraction, and content structuring happen automatically."},
              {n:"03",t:"Receive Your Study Pack",d:"Personalized flashcards, a concept quiz, a visual mind map, and a teach-back script — delivered instantly."},
              {n:"04",t:"Grow Consistently",d:"Daily micro-tasks, adaptive reminders, and mindset coaching keep momentum alive between sessions."},
            ].map(s=>(
              <div className="step-col" key={s.n}>
                <div className="step-n-row"><span className="step-n">{s.n}</span><span className="step-ln"/></div>
                <h3 className="step-t">{s.t}</h3><p className="step-d">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section"><div className="q-wrap">
        <span className="q-mark">"</span>
        <p className="q-text">Students don't know their best method of learning. So instead of asking — we measure. Real performance. Real data. Real personalization.</p>
        <p className="q-attr">Neil Ghodadra — Founder, NeuroPath &amp; Ready Set Growth</p>
      </div></section>

      <div className="rule" />

      {/* CTA */}
      <section className="section"><div className="cta-box">
        <div className="cta-glow" aria-hidden="true"/>
        <h2 className="sh2 pf" style={{marginBottom:14,position:"relative"}}>Ready to learn<br/><span className="pf-i" style={{color:"var(--soft)"}}>the way your brain works?</span></h2>
        <p className="lead" style={{maxWidth:440,margin:"0 auto 44px",position:"relative"}}>Take the free 20-minute diagnostic and let NeuroPath build the only study system built entirely around you.</p>
        <div className="cta-actions">
          <a href="#" className="btn-p">Begin Your Diagnostic <span className="btn-arrow"><Icon.ArrowR /></span></a>
          <a href="#" className="btn-o">For Schools &amp; Teachers</a>
        </div>
      </div></section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand"><div className="brand-orb" style={{width:22,height:22}}><Icon.Logo /></div>NeuroPath · Ready Set Growth</div>
        <p className="footer-copy">© 2025 NeuroPath. All rights reserved.</p>
      </footer>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE — FEATURES  (Editorial magazine layout)
═══════════════════════════════════════════════════════════ */
const FeaturesCSS = `
.feat-hero{padding:160px 24px 80px;border-bottom:1px solid var(--edge);position:relative;overflow:hidden;}
.feat-hero-inner{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:end;}
.feat-hero-left{}
.feat-hero-right{display:flex;flex-direction:column;gap:16px;padding-bottom:8px;}
.feat-hero-right p{font-size:15px;color:var(--soft);line-height:1.75;font-weight:300;border-left:2px solid var(--flame);padding-left:16px;}
.feat-line{width:100%;height:1px;background:var(--edge);}

.feat-accent-num{font-family:'Playfair Display',serif;font-size:clamp(80px,12vw,160px);font-weight:600;color:rgba(217,79,43,0.07);position:absolute;top:60px;right:-10px;line-height:1;letter-spacing:-0.04em;pointer-events:none;user-select:none;}

.feat-grid{max-width:1120px;margin:0 auto;padding:80px 24px;}
.feat-list{display:flex;flex-direction:column;gap:0;}
.feat-row{display:grid;grid-template-columns:80px 1fr 1fr;gap:32px;align-items:start;padding:44px 0;border-bottom:1px solid var(--edge);}
.feat-row:last-child{border-bottom:none;}
.feat-row-num{font-family:'Playfair Display',serif;font-size:13px;color:var(--whisper);letter-spacing:.06em;padding-top:4px;}
.feat-row-left{}
.feat-row-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:500;color:var(--text);line-height:1.25;letter-spacing:-.02em;margin-bottom:12px;}
.feat-row-icon{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border:1px solid var(--edge2);border-radius:10px;background:rgba(217,79,43,0.08);margin-bottom:16px;}
.feat-row-icon svg{width:17px;height:17px;stroke:var(--ember);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.feat-row-right{padding-top:4px;}
.feat-row-desc{font-size:14.5px;color:var(--soft);line-height:1.75;font-weight:300;margin-bottom:16px;}
.feat-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:400;color:var(--flame);letter-spacing:1.4px;text-transform:uppercase;border:1px solid rgba(217,79,43,0.22);border-radius:100px;padding:4px 12px;background:rgba(217,79,43,0.06);}
.feat-tag svg{width:10px;height:10px;stroke:var(--flame);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

@media(max-width:900px){
  .feat-hero-inner{grid-template-columns:1fr;gap:32px;}
  .feat-row{grid-template-columns:50px 1fr;gap:20px;}
  .feat-row-right{grid-column:2;grid-row:2;}
}
@media(max-width:640px){
  .feat-hero{padding:120px 18px 60px;}
  .feat-grid{padding:56px 18px;}
  .feat-row{grid-template-columns:1fr;gap:12px;padding:32px 0;}
  .feat-row-num{display:none;}
  .feat-accent-num{display:none;}
}
`;

function FeaturesPage() {
  const features = [
    { n:"01", Icon: Icon.Brain,    title:"Performance-Based Diagnostics",   tag:"Core Engine",   desc:"We measure how your brain actually retains information — through accuracy, response speed, and delayed recall across four distinct learning methods. No surveys. No guesswork. Pure cognitive performance data that shapes everything else the platform does." },
    { n:"02", Icon: Icon.Mic,      title:"Live Lecture Transcription",       tag:"Real-Time AI",  desc:"Record any class or uploaded video. Our AI converts speech to clean, structured text, automatically extracts key terms, flags important dates, and surfaces the core concepts — all before you leave the room." },
    { n:"03", Icon: Icon.BookOpen, title:"Personalized Study Packs",         tag:"Adaptive",      desc:"Every lecture is automatically transformed into flashcards, practice quizzes, mind map structures, and teach-back scripts — each one proportionally weighted to your unique learning profile so the content matches your brain, not someone else's." },
    { n:"04", Icon: Icon.Calendar, title:"Anti-Procrastination Roadmap",     tag:"Planning",      desc:"Set a test date and receive a day-by-day micro-task plan. Short 10–20 minute sessions with smart reminders that adapt when you fall behind. No overwhelming to-do lists. Just one small step at a time." },
    { n:"05", Icon: Icon.Leaf,     title:"Growth Mindset Coaching",          tag:"Ready Set Growth", desc:"Powered by the principles in Ready Set Growth and Carol Dweck's foundational research, the app delivers contextual coaching after every session — framing struggle as growth, celebrating effort over outcome, and building durable self-belief." },
    { n:"06", Icon: Icon.BarChart, title:"Teacher Intelligence Dashboard",   tag:"Educator Tools", desc:"See the learning DNA of your entire class — not just their grades. Identify dominant learning styles, flag at-risk students early, and receive auto-generated teaching recommendations based on class-wide diagnostic data." },
  ];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FeaturesCSS }} />
      <section className="feat-hero">
        <div className="feat-accent-num" aria-hidden="true">06</div>
        <div className="feat-hero-inner">
          <div className="feat-hero-left">
            <p className="eyebrow">Features</p>
            <h1 className="sh1 pf">Every tool<br/><span className="pf-i" style={{color:"var(--soft)"}}>your brain needs.</span></h1>
          </div>
          <div className="feat-hero-right">
            <div className="feat-line"/>
            <p>Six deeply integrated capabilities — from real-time transcription to cognitive diagnostics — built as one coherent system that learns how you learn.</p>
            <p>No feature works in isolation. Each one feeds data into the next, creating a compound effect that grows stronger with every session.</p>
          </div>
        </div>
      </section>
      <div className="feat-grid">
        <div className="feat-list">
          {features.map(f => (
            <div className="feat-row" key={f.n}>
              <div className="feat-row-num">{f.n}</div>
              <div className="feat-row-left">
                <div className="feat-row-icon"><f.Icon /></div>
                <h2 className="feat-row-title">{f.title}</h2>
                <span className="feat-tag"><Icon.Tag />{f.tag}</span>
              </div>
              <div className="feat-row-right">
                <p className="feat-row-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE — HOW IT WORKS  (Immersive vertical timeline)
═══════════════════════════════════════════════════════════ */
const HowCSS = `
.how-hero{padding:160px 24px 80px;text-align:center;position:relative;overflow:hidden;}
.how-hero-inner{max-width:680px;margin:0 auto;position:relative;z-index:2;}
.how-glow{position:absolute;top:0;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(217,79,43,0.1) 0%,transparent 70%);pointer-events:none;}

.how-timeline{max-width:820px;margin:0 auto;padding:0 24px 100px;}
.how-step{display:grid;grid-template-columns:100px 1fr;gap:0;padding:64px 0;border-bottom:1px solid var(--edge);position:relative;}
.how-step:last-child{border-bottom:none;}
.how-step-left{display:flex;flex-direction:column;align-items:center;padding-top:8px;}
.how-step-circle{width:52px;height:52px;border-radius:50%;border:1px solid rgba(217,79,43,0.35);display:flex;align-items:center;justify-content:center;background:rgba(217,79,43,0.07);position:relative;z-index:2;}
.how-step-circle svg{width:20px;height:20px;stroke:var(--ember);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.how-step-line{flex:1;width:1px;background:linear-gradient(to bottom,rgba(217,79,43,0.25),transparent);margin-top:16px;}
.how-step-right{padding-left:32px;}
.how-step-num{font-family:'Playfair Display',serif;font-size:11px;color:var(--flame);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;}
.how-step-title{font-family:'Playfair Display',serif;font-size:clamp(24px,3vw,36px);font-weight:500;color:var(--text);line-height:1.2;letter-spacing:-.02em;margin-bottom:16px;}
.how-step-desc{font-size:15px;color:var(--soft);line-height:1.78;font-weight:300;max-width:520px;margin-bottom:24px;}
.how-step-tags{display:flex;gap:8px;flex-wrap:wrap;}
.how-chip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--whisper);border:1px solid var(--edge);border-radius:100px;padding:4px 12px;letter-spacing:.04em;}
.how-chip svg{width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}

.how-cta{max-width:820px;margin:0 auto;padding:0 24px 100px;text-align:center;}

@media(max-width:640px){
  .how-hero{padding:116px 18px 56px;}
  .how-timeline{padding:0 18px 72px;}
  .how-step{grid-template-columns:56px 1fr;gap:0;}
  .how-step-right{padding-left:16px;}
  .how-step-circle{width:40px;height:40px;}
  .how-step-circle svg{width:16px;height:16px;}
  .how-cta{padding:0 18px 72px;}
}
`;

function HowItWorksPage() {
  const steps = [
    { Icon: Icon.Target, n:"Step 01", title:"Take the Learning Diagnostic", desc:"A 20-minute performance-based assessment tests how your brain retains information across four distinct methods — flashcards, practice problems, visual mapping, and teach-back. No guessing, no preferences. Pure performance data.", chips:["20 minutes","4 learning methods","Delayed recall testing"] },
    { Icon: Icon.Mic,    n:"Step 02", title:"Record Your Lecture",          desc:"Open the app in class and tap record. Real-time transcription converts speech to text. Key concepts, important dates, and terminology are automatically extracted and structured as the lesson happens.", chips:["Real-time transcription","Key concept extraction","Timestamped notes"] },
    { Icon: Icon.Zap,    n:"Step 03", title:"Receive Your Study Pack",      desc:"Within minutes, your personalized study pack is ready — flashcards, a 5-question quiz, a mind map structure, and a teach-back script, each weighted according to your diagnostic profile. Your best learning method always gets priority.", chips:["Instant generation","Profile-weighted content","4 material formats"] },
    { Icon: Icon.Calendar,n:"Step 04",title:"Follow Your Roadmap",          desc:"Set your test date and the system builds a day-by-day micro-task plan. Each session is 10–20 minutes. Smart reminders adapt if you fall behind. Growth mindset coaching appears after every completed session.", chips:["Daily micro-tasks","Adaptive scheduling","Mindset coaching"] },
    { Icon: Icon.Activity,n:"Step 05",title:"Grow & Improve Over Time",    desc:"After each test and diagnostic retake, your learning profile is updated. The app tracks which methods are strengthening, flags where you need more practice, and adjusts all future materials accordingly. You improve with every session.", chips:["Profile evolution","Retention tracking","Continuous adaptation"] },
  ];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HowCSS }} />
      <section className="how-hero">
        <div className="how-glow" aria-hidden="true"/>
        <div className="how-hero-inner">
          <p className="eyebrow" style={{justifyContent:"center",margin:"0 auto 20px"}}>How It Works</p>
          <h1 className="sh1 pf" style={{marginBottom:24}}>Five steps.<br/><span className="pf-i" style={{color:"var(--soft)"}}>One system.</span></h1>
          <p className="lead" style={{maxWidth:480,margin:"0 auto"}}>Everything is automatic once you record. No manual work, no configuration, no guessing.</p>
        </div>
      </section>
      <div className="how-timeline">
        {steps.map((s, i) => (
          <div className="how-step" key={s.n}>
            <div className="how-step-left">
              <div className="how-step-circle"><s.Icon /></div>
              {i < steps.length - 1 && <div className="how-step-line"/>}
            </div>
            <div className="how-step-right">
              <p className="how-step-num">{s.n}</p>
              <h2 className="how-step-title">{s.title}</h2>
              <p className="how-step-desc">{s.desc}</p>
              <div className="how-step-tags">
                {s.chips.map(c => <span className="how-chip" key={c}><Icon.Check />{c}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="how-cta">
        <a href="#" className="btn-p">Begin Your Diagnostic <span className="btn-arrow"><Icon.ArrowR /></span></a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE — DIAGNOSTICS  (Data-forward, technical showcase)
═══════════════════════════════════════════════════════════ */
const DiagCSS = `
.diag-hero{padding:160px 24px 80px;position:relative;overflow:hidden;border-bottom:1px solid var(--edge);}
.diag-hero-inner{max-width:1120px;margin:0 auto;}
.diag-grid-header{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;}

/* Animated score ring */
.diag-ring-wrap{display:flex;justify-content:flex-end;align-items:flex-start;}
.diag-ring{width:220px;height:220px;position:relative;flex-shrink:0;}
.diag-ring svg{width:100%;height:100%;transform:rotate(-90deg);}
.diag-ring-bg{fill:none;stroke:var(--edge);stroke-width:3;}
.diag-ring-a{fill:none;stroke:var(--flame);stroke-width:3;stroke-linecap:round;stroke-dasharray:502;stroke-dashoffset:125;transition:stroke-dashoffset 1.5s ease;}
.diag-ring-b{fill:none;stroke:rgba(217,79,43,0.35);stroke-width:3;stroke-linecap:round;stroke-dasharray:502;stroke-dashoffset:250;transition:stroke-dashoffset 1.5s 0.2s ease;}
.diag-ring-c{fill:none;stroke:rgba(217,79,43,0.18);stroke-width:3;stroke-linecap:round;stroke-dasharray:502;stroke-dashoffset:380;transition:stroke-dashoffset 1.5s 0.4s ease;}
.diag-ring-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
.diag-ring-n{font-family:'Playfair Display',serif;font-size:36px;font-weight:600;color:var(--text);line-height:1;}
.diag-ring-sub{font-size:11px;color:var(--whisper);letter-spacing:.06em;text-transform:uppercase;margin-top:4px;}

/* Method cards */
.diag-methods{max-width:1120px;margin:0 auto;padding:72px 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.method-card{background:var(--surface);border:1px solid var(--edge);border-radius:20px;padding:28px 24px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s,box-shadow .3s;}
.method-card:hover{border-color:var(--edge2);transform:translateY(-4px);box-shadow:0 18px 56px rgba(0,0,0,0.4);}
.method-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.02) 0%,transparent 55%);pointer-events:none;border-radius:inherit;}
.method-num{font-family:'Playfair Display',serif;font-size:40px;font-weight:600;color:rgba(217,79,43,0.12);line-height:1;margin-bottom:16px;letter-spacing:-.04em;}
.method-icon{width:40px;height:40px;border:1px solid var(--edge2);border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(217,79,43,0.08);margin-bottom:18px;}
.method-icon svg{width:18px;height:18px;stroke:var(--ember);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.method-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:500;color:var(--text);margin-bottom:8px;line-height:1.3;}
.method-desc{font-size:13.5px;color:var(--soft);line-height:1.65;font-weight:300;}

/* Subject table */
.diag-table-wrap{max-width:1120px;margin:0 auto;padding:0 24px 80px;}
.diag-table{width:100%;border-collapse:collapse;}
.diag-table th{font-size:11px;font-weight:400;letter-spacing:1.8px;text-transform:uppercase;color:var(--whisper);padding:14px 20px;text-align:left;border-bottom:1px solid var(--edge);}
.diag-table td{padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:14px;color:var(--soft);font-weight:300;vertical-align:middle;}
.diag-table td:first-child{font-family:'Playfair Display',serif;font-size:16px;font-weight:500;color:var(--text);}
.diag-table tr:last-child td{border-bottom:none;}
.diag-table tr:hover td{background:rgba(255,255,255,0.02);}
.grade-pill{display:inline-flex;font-size:11px;color:var(--flame);border:1px solid rgba(217,79,43,0.25);border-radius:100px;padding:3px 10px;letter-spacing:.04em;background:rgba(217,79,43,0.06);}

@media(max-width:900px){
  .diag-grid-header{grid-template-columns:1fr;gap:36px;}
  .diag-ring-wrap{justify-content:flex-start;}
  .diag-methods{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:640px){
  .diag-hero{padding:116px 18px 56px;}
  .diag-methods{grid-template-columns:1fr;padding:52px 18px;}
  .diag-table-wrap{padding:0 18px 60px;}
  .diag-table th:nth-child(3),.diag-table td:nth-child(3){display:none;}
  .diag-ring{width:160px;height:160px;}
  .diag-ring-n{font-size:28px;}
}
`;

function DiagnosticsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DiagCSS }} />
      <section className="diag-hero">
        <div className="diag-hero-inner">
          <div className="diag-grid-header">
            <div>
              <p className="eyebrow">Diagnostics</p>
              <h1 className="sh1 pf">Measure first.<br/><span className="pf-i" style={{color:"var(--soft)"}}>Personalize always.</span></h1>
              <p className="lead" style={{maxWidth:440,marginBottom:36}}>We run a 20-minute performance-based assessment across four learning methods — with a deliberate distraction break and delayed recall test — to identify your brain's strongest retention pathways.</p>
              <a href="#" className="btn-p">Take the Diagnostic <span className="btn-arrow"><Icon.ArrowR /></span></a>
            </div>
            <div className="diag-ring-wrap">
              <div className="diag-ring">
                <svg viewBox="0 0 170 170">
                  <circle className="diag-ring-bg" cx="85" cy="85" r="80"/>
                  <circle className="diag-ring-a" cx="85" cy="85" r="80"/>
                  <circle className="diag-ring-b" cx="85" cy="85" r="64"/>
                  <circle className="diag-ring-c" cx="85" cy="85" r="48"/>
                </svg>
                <div className="diag-ring-label">
                  <span className="diag-ring-n pf">75%</span>
                  <span className="diag-ring-sub">Retention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 methods */}
      <div className="diag-methods">
        {[
          { n:"A", Icon: Icon.Zap,      title:"Active Recall",    desc:"Flashcard-style Q&A. Measures how well your brain retrieves information from memory under time pressure." },
          { n:"B", Icon: Icon.Target,   title:"Practice Problems",desc:"Application-based questions. Measures how well you understand concepts by using them, not just recalling them." },
          { n:"C", Icon: Icon.Layers,   title:"Visual Mapping",   desc:"Diagram labeling and relationship matching. Measures how effectively you connect ideas spatially." },
          { n:"D", Icon: Icon.Users,    title:"Teach-Back",       desc:"Explain a concept in your own words. Measures deep comprehension and the ability to transfer knowledge." },
        ].map(m => (
          <div className="method-card" key={m.n}>
            <div className="method-num">{m.n}</div>
            <div className="method-icon"><m.Icon /></div>
            <h3 className="method-title">{m.title}</h3>
            <p className="method-desc">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Subject table */}
      <div className="diag-table-wrap">
        <p className="eyebrow" style={{marginBottom:28}}>Available Subjects</p>
        <table className="diag-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade Bands</th>
              <th>Topics Per Band</th>
              <th>Questions</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["General (Critical Thinking)", "5–6, 7–8, 9–10, 11–12", "4 unique topics", "20 per band"],
              ["Biology",                     "5–6, 7–8, 9–10, 11–12", "4 unique topics", "20 per band"],
              ["Chemistry",                   "5–6, 7–8, 9–10, 11–12", "4 unique topics", "20 per band"],
              ["Physics",                     "5–6, 7–8, 9–10, 11–12", "4 unique topics", "20 per band"],
              ["History",                     "5–6, 7–8, 9–10, 11–12", "4 unique topics", "20 per band"],
            ].map(r => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td>{r[1].split(", ").map(g => <span className="grade-pill" key={g} style={{marginRight:4}}>{g}</span>)}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE — FOR TEACHERS  (Dashboard-inspired split layout)
═══════════════════════════════════════════════════════════ */
const TeachersCSS = `
.teach-hero{padding:160px 24px 80px;border-bottom:1px solid var(--edge);}
.teach-hero-inner{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}

/* Mock dashboard panel */
.dash-panel{background:var(--surface);border:1px solid var(--edge);border-radius:20px;padding:24px;overflow:hidden;}
.dash-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.dash-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:500;color:var(--text);}
.dash-subtitle{font-size:11px;color:var(--whisper);letter-spacing:.04em;}
.dash-bar-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.dash-bar-label{font-size:12px;color:var(--soft);width:100px;flex-shrink:0;font-weight:300;}
.dash-bar-track{flex:1;height:6px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;}
.dash-bar-fill{height:100%;border-radius:100px;background:linear-gradient(to right,var(--flame),var(--ember));transition:width 1.2s ease;}
.dash-bar-pct{font-size:11.5px;color:var(--whisper);width:32px;text-align:right;flex-shrink:0;}
.dash-divider{height:1px;background:var(--edge);margin:18px 0;}
.dash-alerts{display:flex;flex-direction:column;gap:8px;}
.alert-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(217,79,43,0.06);border:1px solid rgba(217,79,43,0.14);}
.alert-row svg{width:14px;height:14px;stroke:var(--ember);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
.alert-text{font-size:12.5px;color:var(--soft);font-weight:300;}

/* Benefits grid */
.teach-benefits{max-width:1120px;margin:0 auto;padding:80px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.ben-card{background:var(--surface);border:1px solid var(--edge);border-radius:18px;padding:28px 24px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s;}
.ben-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.02) 0%,transparent 55%);pointer-events:none;border-radius:inherit;}
.ben-card:hover{border-color:var(--edge2);transform:translateY(-3px);}
.ben-icon{width:40px;height:40px;border:1px solid var(--edge2);border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(217,79,43,0.07);margin-bottom:18px;}
.ben-icon svg{width:17px;height:17px;stroke:var(--ember);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.ben-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:500;color:var(--text);margin-bottom:8px;line-height:1.3;}
.ben-desc{font-size:13.5px;color:var(--soft);line-height:1.68;font-weight:300;}

/* Pilot */
.teach-pilot{max-width:1120px;margin:0 auto;padding:0 24px 80px;}
.pilot-box{background:var(--surface);border:1px solid var(--edge);border-radius:24px;padding:56px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;position:relative;overflow:hidden;}
.pilot-box::before{content:'';position:absolute;top:-1px;left:20%;right:60%;height:1px;background:linear-gradient(to right,transparent,var(--flame),transparent);}
.pilot-steps{display:flex;flex-direction:column;gap:16px;}
.pilot-step{display:flex;align-items:flex-start;gap:14px;}
.pilot-step-num{width:28px;height:28px;border-radius:50%;border:1px solid rgba(217,79,43,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:400;color:var(--flame);flex-shrink:0;font-family:'Playfair Display',serif;}
.pilot-step-text{font-size:14px;color:var(--soft);line-height:1.6;font-weight:300;padding-top:4px;}

@media(max-width:900px){
  .teach-hero-inner{grid-template-columns:1fr;gap:40px;}
  .teach-benefits{grid-template-columns:repeat(2,1fr);}
  .pilot-box{grid-template-columns:1fr;gap:36px;}
}
@media(max-width:640px){
  .teach-hero{padding:116px 18px 56px;}
  .teach-benefits{grid-template-columns:1fr;padding:52px 18px;}
  .teach-pilot{padding:0 18px 60px;}
  .pilot-box{padding:36px 22px;}
}
`;

function ForTeachersPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TeachersCSS }} />
      <section className="teach-hero">
        <div className="teach-hero-inner">
          <div>
            <p className="eyebrow">For Teachers</p>
            <h1 className="sh1 pf" style={{marginBottom:24}}>See how your<br/><span className="pf-i" style={{color:"var(--soft)"}}>class truly learns.</span></h1>
            <p className="lead" style={{maxWidth:440,marginBottom:40}}>NeuroPath gives educators the cognitive profile of every student — not just grades — so you can teach to actual learning styles and intervene before students fall behind.</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href="#" className="btn-p">Request a School Pilot <span className="btn-arrow"><Icon.ArrowR /></span></a>
              <a href="#" className="btn-o">View Demo Dashboard</a>
            </div>
          </div>
          {/* Mock dashboard */}
          <div className="dash-panel">
            <div className="dash-header">
              <span className="dash-title">Biology — Period 2</span>
              <span className="dash-subtitle">28 students</span>
            </div>
            {[
              {l:"Practice Problems", w:"72%"},
              {l:"Teach-Back",       w:"58%"},
              {l:"Flashcards",       w:"34%"},
              {l:"Visual Mapping",   w:"28%"},
            ].map(b => (
              <div className="dash-bar-row" key={b.l}>
                <span className="dash-bar-label">{b.l}</span>
                <div className="dash-bar-track"><div className="dash-bar-fill" style={{width:b.w}}/></div>
                <span className="dash-bar-pct">{b.w}</span>
              </div>
            ))}
            <div className="dash-divider"/>
            <p style={{fontSize:11,color:"var(--whisper)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>At-Risk Alerts</p>
            <div className="dash-alerts">
              {["Alex M — skipped tasks 3 days","Jordan S — diagnostic score dropping","Riley K — no roadmap set, exam in 4 days"].map(a=>(
                <div className="alert-row" key={a}><Icon.Activity /><span className="alert-text">{a}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="teach-benefits">
        {[
          {Icon:Icon.BarChart,  t:"Class Learning Profile",  d:"See the dominant learning styles across your class — not aggregated grades, but actual cognitive performance data from real diagnostics."},
          {Icon:Icon.Activity,  t:"At-Risk Early Warning",   d:"Students who skip tasks, miss sessions, or show score drops are automatically flagged before they fall too far behind."},
          {Icon:Icon.BookOpen,  t:"Auto Study Pack Generation",d:"Upload a lecture and NeuroPath generates differentiated study packs for every student, adapted to their individual learning profiles."},
          {Icon:Icon.Shield,    t:"Privacy Compliant",       d:"All student data is encrypted, de-identified for any research use, and fully deletable. FERPA-aligned from day one."},
          {Icon:Icon.Users,     t:"Ambassador Program",      d:"Train student ambassadors who help run diagnostics, champion growth mindset culture, and support peers — building leadership alongside learning."},
          {Icon:Icon.Globe,     t:"Stanford-Aligned Research",d:"Pilot data can be exported anonymously for educational research. We actively seek collaboration with learning science departments."},
        ].map(b=>(
          <div className="ben-card" key={b.t}>
            <div className="ben-icon"><b.Icon /></div>
            <h3 className="ben-title">{b.t}</h3>
            <p className="ben-desc">{b.d}</p>
          </div>
        ))}
      </div>

      <div className="teach-pilot">
        <div className="pilot-box">
          <div>
            <p className="eyebrow">Pilot Programme</p>
            <h2 className="sh2 pf" style={{marginBottom:14}}>Start a school pilot<br/><span className="pf-i" style={{color:"var(--soft)"}}>in 4 steps.</span></h2>
            <p className="lead" style={{maxWidth:360}}>From first request to live classroom in under a week. No technical setup required on your end.</p>
          </div>
          <div className="pilot-steps">
            {["Submit a pilot request — we review within 24 hours","We prepare your school account and teacher dashboard","Students take the diagnostic in their first session (20 min)","Weekly snapshot reports delivered automatically to your inbox"].map((t,i)=>(
              <div className="pilot-step" key={i}>
                <div className="pilot-step-num">{String(i+1).padStart(2,"0")}</div>
                <p className="pilot-step-text">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE — PRICING  (Clean comparison layout)
═══════════════════════════════════════════════════════════ */
const PricingCSS = `
.price-hero{padding:160px 24px 80px;text-align:center;border-bottom:1px solid var(--edge);position:relative;overflow:hidden;}
.price-hero-inner{max-width:600px;margin:0 auto;position:relative;z-index:2;}
.price-glow{position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(217,79,43,0.09) 0%,transparent 70%);pointer-events:none;}

.price-grid{max-width:1000px;margin:0 auto;padding:72px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:start;}
.price-card{background:var(--surface);border:1px solid var(--edge);border-radius:22px;padding:36px 30px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s,box-shadow .3s;}
.price-card.featured{border-color:rgba(217,79,43,0.4);background:linear-gradient(160deg,rgba(217,79,43,0.06) 0%,var(--surface) 50%);}
.price-card:hover{transform:translateY(-4px);box-shadow:0 18px 56px rgba(0,0,0,0.4);}
.price-card.featured:hover{border-color:rgba(217,79,43,0.6);}
.price-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.02) 0%,transparent 55%);pointer-events:none;border-radius:inherit;}
.price-badge{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;color:var(--flame);border:1px solid rgba(217,79,43,0.3);border-radius:100px;padding:3px 10px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:18px;background:rgba(217,79,43,0.07);}
.price-badge svg{width:10px;height:10px;stroke:var(--flame);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.price-plan{font-family:'Playfair Display',serif;font-size:22px;font-weight:500;color:var(--text);margin-bottom:6px;}
.price-desc{font-size:13px;color:var(--soft);margin-bottom:28px;line-height:1.6;font-weight:300;}
.price-amount{display:flex;align-items:baseline;gap:4px;margin-bottom:28px;}
.price-curr{font-size:20px;font-weight:400;color:var(--soft);align-self:flex-start;padding-top:8px;}
.price-num{font-family:'Playfair Display',serif;font-size:52px;font-weight:600;color:var(--text);line-height:1;letter-spacing:-.03em;}
.price-per{font-size:13px;color:var(--whisper);margin-left:4px;}
.price-divider{height:1px;background:var(--edge);margin:0 0 24px;}
.price-feature{display:flex;align-items:flex-start;gap:10px;margin-bottom:13px;font-size:13.5px;color:var(--soft);font-weight:300;line-height:1.5;}
.price-feature svg{width:14px;height:14px;stroke:var(--ember);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;margin-top:2px;}
.price-feature.muted svg{stroke:var(--whisper);}
.price-feature.muted{color:var(--whisper);}
.price-btn-wrap{margin-top:28px;}

.price-faq{max-width:700px;margin:0 auto;padding:0 24px 100px;}
.faq-item{border-bottom:1px solid var(--edge);padding:24px 0;}
.faq-item:first-child{border-top:1px solid var(--edge);}
.faq-q{font-family:'Playfair Display',serif;font-size:18px;font-weight:500;color:var(--text);margin-bottom:10px;}
.faq-a{font-size:14px;color:var(--soft);line-height:1.72;font-weight:300;}

@media(max-width:768px){
  .price-grid{grid-template-columns:1fr;max-width:440px;}
}
@media(max-width:640px){
  .price-hero{padding:116px 18px 56px;}
  .price-grid{padding:52px 18px;}
  .price-faq{padding:0 18px 72px;}
}
`;

function PricingPage() {
  const plans = [
    {
      name:"Student", desc:"For individual learners who want to study smarter.",
      price:"Free", per:"forever", featured:false,
      features:[
        {t:"Learning diagnostic (1 subject)",ok:true},
        {t:"Live lecture transcription (3/month)",ok:true},
        {t:"Personalized study packs",ok:true},
        {t:"Basic study roadmap",ok:true},
        {t:"Growth mindset coaching",ok:true},
        {t:"All 5 subjects",ok:false},
        {t:"Teacher dashboard",ok:false},
      ],
      cta:"Get Started Free",
    },
    {
      name:"Scholar", desc:"For serious students who need the full system.",
      price:"12", per:"/month", featured:true, badge:"Most Popular",
      features:[
        {t:"All 5 subjects — full diagnostics",ok:true},
        {t:"Unlimited lecture transcription",ok:true},
        {t:"Full personalized study packs",ok:true},
        {t:"Advanced anti-procrastination roadmap",ok:true},
        {t:"Full growth mindset coaching",ok:true},
        {t:"Priority AI processing",ok:true},
        {t:"Teacher dashboard",ok:false},
      ],
      cta:"Begin Free Trial",
    },
    {
      name:"School", desc:"For teachers, classrooms, and institutional pilots.",
      price:"Contact", per:"", featured:false,
      features:[
        {t:"Everything in Scholar",ok:true},
        {t:"Teacher intelligence dashboard",ok:true},
        {t:"Class-wide diagnostic reporting",ok:true},
        {t:"At-risk student early warning",ok:true},
        {t:"Research data export",ok:true},
        {t:"Ambassador programme support",ok:true},
        {t:"Dedicated onboarding",ok:true},
      ],
      cta:"Request a Pilot",
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PricingCSS }} />
      <section className="price-hero">
        <div className="price-glow" aria-hidden="true"/>
        <div className="price-hero-inner">
          <p className="eyebrow" style={{justifyContent:"center",margin:"0 auto 20px"}}>Pricing</p>
          <h1 className="sh1 pf" style={{marginBottom:22}}>Simple,<br/><span className="pf-i" style={{color:"var(--soft)"}}>transparent pricing.</span></h1>
          <p className="lead" style={{maxWidth:440,margin:"0 auto"}}>Start free. Upgrade when you're ready. Schools get a full pilot before committing.</p>
        </div>
      </section>

      <div className="price-grid">
        {plans.map(p => (
          <div className={`price-card${p.featured?" featured":""}`} key={p.name}>
            {p.badge && <div className="price-badge"><Icon.Star />{p.badge}</div>}
            <h2 className="price-plan">{p.name}</h2>
            <p className="price-desc">{p.desc}</p>
            <div className="price-amount">
              {p.price === "Free" || p.price === "Contact" ? (
                <span className="price-num pf" style={{fontSize:42}}>{p.price}</span>
              ) : (
                <><span className="price-curr">$</span><span className="price-num pf">{p.price}</span><span className="price-per">{p.per}</span></>
              )}
            </div>
            <div className="price-divider"/>
            {p.features.map(f => (
              <div className={`price-feature${f.ok?"":" muted"}`} key={f.t}>
                <Icon.Check />{f.t}
              </div>
            ))}
            <div className="price-btn-wrap">
              {p.featured
                ? <a href="#" className="btn-p" style={{width:"100%",justifyContent:"center"}}>{p.cta}</a>
                : <a href="#" className="btn-o" style={{width:"100%",justifyContent:"center"}}>{p.cta}</a>
              }
            </div>
          </div>
        ))}
      </div>

      <div className="price-faq">
        <p className="eyebrow" style={{marginBottom:0}}>Frequently Asked</p>
        {[
          {q:"Is the free plan really free?", a:"Yes. The Student plan is permanently free with no credit card required. You get one full diagnostic, three transcriptions per month, and core study materials."},
          {q:"How does the school pilot work?", a:"Schools get a fully configured account, teacher dashboard, and up to one class of students running diagnostics — completely free for 6 weeks. We provide onboarding support throughout."},
          {q:"Can students use NeuroPath on their phones?", a:"Absolutely. NeuroPath is fully responsive and works on any device. The recording feature is designed specifically for mobile use in classrooms."},
          {q:"Is student data kept private?", a:"Yes. All data is encrypted at rest and in transit. Student data is never sold or shared. Research exports are fully anonymized. Accounts can be deleted at any time."},
        ].map(f => (
          <div className="faq-item" key={f.q}>
            <h3 className="faq-q">{f.q}</h3>
            <p className="faq-a">{f.a}</p>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
const PAGES = ["Home", "Features", "How It Works", "Diagnostics", "For Teachers", "Pricing"];

export default function NeuroPathApp() {
  const [page,     setPage]     = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navigate = (p: string) => { setPage(p); setMenuOpen(false); window.scrollTo({top:0,behavior:"instant"}); };

  const renderPage = () => {
    switch (page) {
      case "Features":    return <FeaturesPage />;
      case "How It Works":return <HowItWorksPage />;
      case "Diagnostics": return <DiagnosticsPage />;
      case "For Teachers":return <ForTeachersPage />;
      case "Pricing":     return <PricingPage />;
      default:            return <HomePage />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Mobile Drawer */}
      <div className={`drawer${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        <ul className="drawer-list">
          {PAGES.map(p => (
            <li key={p}><button className={page===p?"active":""} onClick={()=>navigate(p)}>{p}</button></li>
          ))}
        </ul>
        <div className="drawer-foot">
          <button className="d-cta" onClick={()=>navigate("Diagnostics")}>Begin Your Diagnostic</button>
          <button className="d-ghost">Sign in</button>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav-wrap">
        <div className={`nav-pill${scrolled?" up":""}`}>
          <button className="brand" onClick={()=>navigate("Home")} style={{background:"none",border:"none",cursor:"pointer"}}>
            <div className="brand-orb"><Icon.Logo /></div>
            <span className="brand-name">NeuroPath</span>
          </button>

          <ul className="nav-tabs">
            {PAGES.filter(p=>p!=="Home").map(p=>(
              <li key={p}><button className={page===p?"active":""} onClick={()=>navigate(p)}>{p}</button></li>
            ))}
          </ul>

          <div className="nav-right">
            <button className="nav-ghost">Sign in</button>
            <button className="nav-cta" onClick={()=>navigate("Diagnostics")}>
              <span className="nav-cta-dot"/>Get Early Access
            </button>
            <button
              className={`hbg${menuOpen?" open":""}`}
              onClick={()=>setMenuOpen(v=>!v)}
              aria-label={menuOpen?"Close menu":"Open menu"}
            ><span/><span/><span/></button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>{renderPage()}</main>
    </>
  );
}