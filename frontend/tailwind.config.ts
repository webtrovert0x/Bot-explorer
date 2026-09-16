import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bohr: {
          cyan: "#00f0ff",
          purple: "#7928ca",
          pink: "#ff0080",
          gold: "#ffd700",
          dark: "#080b11",
          card: "#0d131f",
          border: "#1a2538",
          subtle: "#8e9eb5",
        },
      },
      backgroundImage: {
        "cyber-grid": "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 60%)",
        "neon-gradient": "linear-gradient(135deg, #00f0ff 0%, #7928ca 50%, #ff0080 100%)",
        "gold-gradient": "linear-gradient(135deg, #ffd700 0%, #ff8800 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(16, 24, 40, 0.8) 0%, rgba(8, 12, 22, 0.95) 100%)",
      },
      animation: {
        "radar-sweep": "radar 4s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "scan-line": "scanline 2s ease-in-out infinite alternate",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        scanline: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
