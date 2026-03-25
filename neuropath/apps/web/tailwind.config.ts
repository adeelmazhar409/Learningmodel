import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Mirror the CSS custom properties from neuropath-globals.css
      colors: {
        ink:     "#0c0c0e",
        ink2:    "#111114",
        surface: "#141418",
        lift:    "#1c1c22",
        flame:   "#d94f2b",
        ember:   "#e8603c",
        text:    "#f0ede8",
      },
      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        dm:       ["DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
      },
      animation: {
        "rise-in":  "riseIn 0.9s ease both",
        "float-y":  "floatY 18s ease-in-out infinite",
        "scroll-x": "scrollX 28s linear infinite",
        "bar-float":"barFloat 12s ease-in-out infinite",
        pulse:      "pulse 2.5s ease infinite",
      },
      keyframes: {
        riseIn: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
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
      },
    },
  },
  plugins: [],
};

export default config;
