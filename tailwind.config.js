/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // A warm, low-light palette
        cm: {
          night: "#14110F",
          dusk: "#1E1916",
          clay: "#2A221D",
          cream: "#F4EBDD",
          sand: "#BFAF9B",
          gold: "#E2B36B",
          ember: "#E8622C",
          "ember-dark": "#C94F1F",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        story: ["Iowan Old Style", "Palatino Linotype", "Palatino", "Book Antiqua", "Georgia", "serif"],
      },
      keyframes: {
        "cm-rise": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "cm-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "cm-twinkle": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        "cm-steam": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "40%": { opacity: "0.4" },
          "100%": { opacity: "0", transform: "translateY(-12px)" },
        },
        // Characters
        "cm-blink": {
          "0%, 93%, 100%": { transform: "scaleY(1)" },
          "96.5%": { transform: "scaleY(0.08)" },
        },
        "cm-talk": {
          "0%, 100%": { transform: "scaleY(0.25)" },
          "18%": { transform: "scaleY(1)" },
          "38%": { transform: "scaleY(0.45)" },
          "58%": { transform: "scaleY(0.9)" },
          "78%": { transform: "scaleY(0.3)" },
        },
        "cm-breathe": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-1.6px)" },
        },
        "cm-nod": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "30%": { transform: "rotate(-1.8deg)" },
          "70%": { transform: "rotate(1.4deg)" },
        },
        "cm-sway": {
          "0%, 100%": { transform: "rotate(-0.7deg)" },
          "50%": { transform: "rotate(0.8deg)" },
        },
        "cm-enter-left": {
          from: { opacity: "0", transform: "translateX(-22px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "cm-enter-right": {
          from: { opacity: "0", transform: "translateX(22px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "cm-drift": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.07) translateY(-1%)" },
        },
      },
      animation: {
        "cm-rise": "cm-rise 0.7s ease-out both",
        "cm-fade": "cm-fade 1.2s ease-out both",
        "cm-twinkle": "cm-twinkle 4s ease-in-out infinite",
        "cm-steam": "cm-steam 5s ease-out infinite",
        "cm-blink": "cm-blink 5.4s linear infinite",
        "cm-talk": "cm-talk 0.46s ease-in-out infinite",
        "cm-breathe": "cm-breathe 4.6s ease-in-out infinite",
        "cm-nod": "cm-nod 1.5s ease-in-out infinite",
        "cm-sway": "cm-sway 7s ease-in-out infinite",
        "cm-enter-left": "cm-enter-left 0.7s ease-out both",
        "cm-enter-right": "cm-enter-right 0.7s ease-out both",
        "cm-drift": "cm-drift 36s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
