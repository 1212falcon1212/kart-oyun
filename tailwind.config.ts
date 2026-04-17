import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Unbounded", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#0E0B14",
        cream: "#F5E8D0",
        mute: "#A39A8B",
        muted2: "#5c5463",
      },
    },
  },
  plugins: [],
};

export default config;
