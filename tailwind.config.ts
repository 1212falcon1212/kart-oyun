import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Unbounded", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "var(--ink)",
        cream: "var(--cream)",
        mute: "var(--mute)",
        muted2: "var(--muted2)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};

export default config;
