import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F5EDD9",
          300: "#EDE0C4",
          400: "#E0CCA6",
          500: "#D4B889",
        },
        nude: {
          50: "#F9F1ED",
          100: "#F0DED5",
          200: "#E5C7B8",
          300: "#D9AE9A",
          400: "#CD957C",
          500: "#C07D5E",
        },
        sand: {
          50: "#F7F4F0",
          100: "#EDE7DE",
          200: "#DDD3C5",
          300: "#CDBFAE",
          400: "#BDAB97",
          500: "#AD9780",
        },
        primary: {
          50: "#FBF5F1",
          100: "#F0DED5",
          200: "#E5C7B8",
          300: "#D9AE9A",
          400: "#CD957C",
          500: "#C07D5E",
          600: "#A9653F",
          700: "#8A5334",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
