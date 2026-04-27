import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Tacos Galos (extraída de las stories de Instagram)
        galos: {
          red: "#E30613",
          "red-dark": "#B0040F",
          "red-deep": "#7A0309",
          "red-soft": "#FFF0F1",
          black: "#0F0F0F",
          cream: "#FFF8F0",
          gold: "#F5C518",
          "gold-dark": "#C99A0A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        anton: ["var(--font-anton)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Sombra dura tipo neo-brutalist (la firma visual de la marca)
        hard: "0 8px 0 0 #0F0F0F",
        "hard-lg": "0 14px 0 0 #0F0F0F",
        "hard-sm": "0 4px 0 0 #0F0F0F",
        red: "0 14px 30px -10px rgba(227,6,19,.55)",
      },
      borderRadius: {
        galos: "22px",
        "galos-lg": "32px",
      },
      animation: {
        "marquee": "marquee 28s linear infinite",
        "floaty": "floaty 4s ease-in-out infinite",
        "pulse-scale": "pulseScale 1.4s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
