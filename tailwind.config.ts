import type { Config } from "tailwindcss";

// Tokens measured from Lenar's own Canva deck. See BUILD-SPEC.md section 3.
// Do not swap these for a generic dark palette -- this gold is his brand.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // A couple of exact pixel measurements from Lenar's deck that don't
      // land on Tailwind's default spacing scale (13 = 52px, 22 = 88px).
      spacing: {
        13: "3.25rem",
        22: "5.5rem",
      },
      colors: {
        ink: {
          900: "#0F0F0A",
          800: "#181810",
          700: "#22221A",
        },
        gold: {
          500: "#B08850",
        },
        sand: {
          300: "#E0D0B8",
        },
        bone: {
          100: "#F4F1E8",
        },
        muted: {
          400: "#9A948A", // lightened from measured #8C877C to clear 4.5:1 on ink-800
        },
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-figtree)", "sans-serif"],
        // The sheet-header labels, frame numbers, and nav buttons all use
        // this -- the "filing system" identity runs through the typeface.
        mono: ["var(--font-space-mono)", "monospace"],
        // The one "designed" typeface on the page. Used for his quote beside
        // the profile picture and nowhere else, so it stays an accent rather
        // than a second body font.
        quote: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        shutter: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "180ms",
        base: "320ms",
        slow: "520ms",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Ends at opacity 1, deliberately: under prefers-reduced-motion the
        // global rule clamps every animation to 1ms and one iteration, so a
        // keyframe that ENDS visible degrades to "just visible" instead of
        // flickering or getting stuck faded out.
        statusPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        fadeUp: "fadeUp 600ms cubic-bezier(0.16,1,0.3,1) both",
        statusPulse: "statusPulse 2600ms cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
