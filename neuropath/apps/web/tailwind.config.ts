import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:     { DEFAULT: "#0c0c0e", 2: "#111114" },
        surface: "#141418",
        lift:    "#1c1c22",
        edge:    { DEFAULT: "rgba(255,255,255,0.07)", 2: "rgba(255,255,255,0.13)" },
        flame:   "#d94f2b",
        ember:   "#e8603c",
        text:    "#f0ede8",
        soft:    "rgba(240,237,232,0.55)",
        faint:   "rgba(240,237,232,0.08)",
        whisper: "rgba(240,237,232,0.25)",
      },
      fontFamily: {
        serif:  ["'Playfair Display'", "Georgia", "serif"],
        sans:   ["'DM Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm:  "10px",
        md:  "16px",
        lg:  "20px",
        xl:  "24px",
        pill: "100px",
      },
      fontSize: {
        "sh1": ["clamp(44px, 7vw, 88px)",  { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        "sh2": ["clamp(30px, 3.8vw, 48px)", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
      },
      boxShadow: {
        "btn":     "0 4px 22px rgba(0,0,0,0.3)",
        "btn-lg":  "0 10px 36px rgba(0,0,0,0.5)",
        "card":    "0 18px 56px rgba(0,0,0,0.42)",
        "nav":     "0 8px 40px rgba(0,0,0,0.55)",
        "nav-lg":  "0 8px 48px rgba(0,0,0,0.65)",
        "orb":     "0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px rgba(217,79,43,0.25)",
        "flame-sm":"0 0 0 3px rgba(217,79,43,0.08)",
      },
      animation: {
        "rise-in":   "riseIn 0.9s ease both",
        "fade-in":   "fadeIn 0.6s ease both",
        "float-y":   "floatY 18s ease-in-out infinite",
        "scroll-x":  "scrollX 28s linear infinite",
        "bar-float": "barFloat 12s ease-in-out infinite",
        "pulse-dot": "pulseDot 2.5s ease infinite",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        riseIn: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        scrollX: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        barFloat: {
          "0%, 100%": { transform: "rotate(-32deg) translateY(0)" },
          "50%":      { transform: "rotate(-32deg) translateY(-16px)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.35", transform: "scale(0.65)" },
        },
      },
      transitionDuration: {
        "180": "180ms",
        "250": "250ms",
      },
    },
  },
  plugins: [
    /* ── Custom utility layer ── */
    plugin(function ({ addBase, addComponents, addUtilities }) {
      /* Reset & global base */
      addBase({
        "*, *::before, *::after": { boxSizing: "border-box", margin: "0", padding: "0" },
        "html": { scrollBehavior: "smooth", WebkitTextSizeAdjust: "100%" },
        "body": {
          background: "#0c0c0e",
          color: "#f0ede8",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontWeight: "300",
          lineHeight: "1.65",
          WebkitFontSmoothing: "antialiased",
          overflowX: "hidden",
        },
        "::selection": {
          background: "rgba(217, 79, 43, 0.28)",
          color: "#fff",
        },
      });

      /* Reusable component classes */
      addComponents({
        ".card": {
          background: "#141418",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "32px 30px",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
          "&::after": {
            content: "''",
            position: "absolute",
            inset: "0",
            background: "linear-gradient(135deg, rgba(255,255,255,0.022) 0%, transparent 55%)",
            pointerEvents: "none",
            borderRadius: "inherit",
          },
          "&:hover": {
            borderColor: "rgba(255,255,255,0.13)",
            transform: "translateY(-4px)",
            boxShadow: "0 18px 56px rgba(0,0,0,0.42)",
          },
        },
        ".btn-primary": {
          display: "inline-flex",
          alignItems: "center",
          gap: "9px",
          background: "#f0ede8",
          color: "#0c0c0e",
          border: "none",
          borderRadius: "100px",
          padding: "14px 28px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 22px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
          letterSpacing: "0.01em",
          "&:hover": {
            opacity: "0.92",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 36px rgba(0,0,0,0.5)",
          },
        },
        ".btn-outline": {
          display: "inline-flex",
          alignItems: "center",
          gap: "9px",
          background: "transparent",
          color: "rgba(240,237,232,0.55)",
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: "100px",
          padding: "13px 26px",
          fontSize: "14px",
          fontWeight: "400",
          cursor: "pointer",
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          transition: "color 0.2s, border-color 0.2s, transform 0.2s, background 0.2s",
          whiteSpace: "nowrap",
          "&:hover": {
            color: "#f0ede8",
            borderColor: "rgba(255,255,255,0.26)",
            background: "rgba(255,255,255,0.04)",
            transform: "translateY(-2px)",
          },
        },
        ".btn-danger": {
          display: "inline-flex",
          alignItems: "center",
          gap: "9px",
          background: "rgba(217,79,43,0.12)",
          color: "#e8603c",
          border: "1px solid rgba(217,79,43,0.3)",
          borderRadius: "100px",
          padding: "13px 26px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "background 0.2s, border-color 0.2s",
          whiteSpace: "nowrap",
          "&:hover": {
            background: "rgba(217,79,43,0.2)",
            borderColor: "rgba(217,79,43,0.5)",
          },
        },
        ".eyebrow": {
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "11px",
          fontWeight: "400",
          letterSpacing: "2.2px",
          textTransform: "uppercase",
          color: "#d94f2b",
          marginBottom: "20px",
          "&::before": {
            content: "''",
            display: "block",
            width: "22px",
            height: "1px",
            background: "#d94f2b",
            flexShrink: "0",
          },
        },
        ".input": {
          width: "100%",
          background: "#141418",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
          color: "#f0ede8",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&::placeholder": {
            color: "rgba(240,237,232,0.25)",
          },
          "&:focus": {
            borderColor: "rgba(217,79,43,0.5)",
            boxShadow: "0 0 0 3px rgba(217,79,43,0.08)",
          },
          "&.error": {
            borderColor: "rgba(217,79,43,0.7)",
          },
        },
        ".skeleton": {
          height: "48px",
          borderRadius: "12px",
          background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s ease-in-out infinite",
        },
      });

      /* Utility additions */
      addUtilities({
        ".grain": {
          "&::before": {
            content: "''",
            position: "fixed",
            inset: "0",
            zIndex: "9999",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.032'/%3E%3C/svg%3E")`,
            opacity: "0.55",
            mixBlendMode: "overlay",
          },
        },
      });
    }),
  ],
};

export default config;
