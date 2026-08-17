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
        background: {
          DEFAULT: "var(--background)",
          80: "var(--background-80)",
        },
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--secondary-background)",
          muted: "var(--muted)",
          border: "var(--border)",
          highlight: "var(--accent)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          secondary: "var(--border-secondary)",
        },
        brand: {
          blue: "var(--brand-color-blue)",
          purple: "var(--brand-color-purple)",
          emerald: "var(--success)",
          amber: "var(--medium)",
          rose: "var(--destructive)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-fira-mono)", "Fira Mono", "Ubuntu Mono", "monospace"],
      },
      backgroundImage: {
        'codehelp-gradient': 'linear-gradient(90deg, var(--brand-color-blue) 0%, var(--brand-color-purple) 100%)',
        'heading-gradient': 'linear-gradient(to top, var(--primary), var(--muted-foreground))',
        'card-radial-glow': 'radial-gradient(circle at 50% 0%, rgba(92, 119, 219, 0.12), transparent 70%)',
        'purple-crush': 'linear-gradient(135deg, var(--brand-color-blue) 0%, #7a3ddb 50%, var(--brand-color-purple) 100%)',
      },
      boxShadow: {
        'top-inset': 'inset 0 1px 0 0 rgba(161, 161, 170, 0.3)',
        'btn-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'codehelp-glow': '0 0 25px rgba(92, 119, 219, 0.18)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'sparkle-pulse': 'sparkle-pulse 2s ease-in-out infinite',
        'hero-blur-fade': 'hero-blur-fade 1.5s ease-out forwards',
        'hero-particle-drift': 'hero-particle-drift 8s ease-in-out infinite',
        'shimmer': 'tw-shimmer 2.5s infinite linear',
        'marquee': 'marquee 35s linear infinite',
        'marquee-vertical': 'marquee-vertical 35s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'sparkle-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'hero-blur-fade': {
          'from': { opacity: '0', filter: 'blur(8px)' },
          'to': { opacity: '1', filter: 'blur(0)' },
        },
        'hero-particle-drift': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.6' },
          '33%': { transform: 'translate(15px, -20px)', opacity: '0.85' },
          '66%': { transform: 'translate(-12px, 15px)', opacity: '0.5' },
        },
        'tw-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - 1.5rem))' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - 1.5rem))' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateY(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateY(120px) rotate(-360deg)' },
        },
        'accordion-down': {
          '0%': { height: '0' },
          '100%': { height: 'var(--radix-accordion-content-height, auto)' },
        },
        'accordion-up': {
          '0%': { height: 'var(--radix-accordion-content-height, auto)' },
          '100%': { height: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
