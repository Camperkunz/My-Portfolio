import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "marquee-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        // CSS replacements for the framer-motion entrance animations that used
        // to ship in the entry bundle. `both` fill applies the from-state before
        // the first frame, so there is no unstyled flash before the animation.
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-blur": {
          from: { opacity: "0", filter: "blur(4px)", transform: "scale(0.95)" },
          to: { opacity: "1", filter: "blur(0px)", transform: "scale(1)" },
        },
        "fade-out-blur": {
          from: { opacity: "1", filter: "blur(0px)", transform: "scale(1)" },
          to: { opacity: "0", filter: "blur(4px)", transform: "scale(0.95)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.8)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pop-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.8)" },
        },
      },
      animation: {
        "marquee-left": "marquee-left linear infinite",
        "marquee-right": "marquee-right linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in-blur": "fade-in-blur 0.4s ease-out both",
        "fade-out-blur": "fade-out-blur 0.4s ease-in both",
        "pop-in": "pop-in 0.2s ease-out both",
        "pop-out": "pop-out 0.2s ease-in both",
      },
      // Named so `duration-1200` is unambiguous — the arbitrary form
      // `duration-[1200ms]` is reported as ambiguous (and silently skipped)
      // by Tailwind because tailwindcss-animate also claims duration-*.
      transitionDuration: {
        1200: "1200ms",
      },
      fontFamily: {
        // Montserrat Variable is the brand typeface (self-hosted via
        // @fontsource-variable/montserrat, which registers the family under the
        // exact name "Montserrat Variable"). The mono key is a legacy alias for
        // the many `font-mono` classes, so it must point at the same variable
        // font — plain "Montserrat" is no longer loaded anywhere.
        sans: ['"Montserrat Variable"', 'Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Montserrat Variable"', 'Montserrat', 'ui-monospace', 'monospace'],
      },
      
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
