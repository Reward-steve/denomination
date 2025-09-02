/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-4px)" },
        },
        fade: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shake: "shake 0.3s ease-in-out",
        fade: "fade 0.5s ease-out forwards",
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        dashboard: "var(--color-dashboard)",
        background: "var(--color-background)",
        text: "var(--color-text)",
        subText: "var(--color-subText)",
        gray: "var(--color-gray)",
        border: "var(--color-borderColor)",
        // black: "var(--color-black)",
        // white: "var(--color-white)",

        // Kept your existing custom error color
        error: "#e3342f",
      },
    },
  },
  plugins: [],
};
