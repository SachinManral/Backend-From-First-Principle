import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0C0C0C",
        surface: {
          DEFAULT: "#121214",
          muted: "#17171A",
          border: "#232328",
          highlight: "#2B2B33",
        },
        brand: {
          cyan: "#34e2e4",
          blue: "#0693e3",
          purple: "#7a00df",
          violet: "#ab1dfe",
          indigo: "#4721fb",
          emerald: "#00d084",
          amber: "#fcb900",
          rose: "#cf2e2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        'purple-crush': 'linear-gradient(135deg, #34e2e4 0%, #4721fb 50%, #ab1dfe 100%)',
        'vivid-cyan-blue': 'linear-gradient(135deg, #00d084 0%, #0693e3 100%)',
        'midnight-glow': 'linear-gradient(135deg, #020381 0%, #2874fc 100%)',
        'card-glow': 'radial-gradient(circle at 50% 0%, rgba(71, 33, 251, 0.15), transparent 70%)',
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(71, 33, 251, 0.2)" },
          "100%": { boxShadow: "0 0 35px rgba(52, 226, 228, 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      },
    },
  },
  plugins: [],
};

export default config;
