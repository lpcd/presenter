/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
        },
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
          strong: "rgb(var(--color-surface-strong) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-text-subtle) / <alpha-value>)",
          inverse: "rgb(var(--color-text-inverse) / <alpha-value>)",
        },
        "brand-page": "rgb(var(--color-page) / <alpha-value>)",
        "brand-gradient-1-from": "rgb(var(--gradient-1-from) / <alpha-value>)",
        "brand-gradient-1-via": "rgb(var(--gradient-1-via) / <alpha-value>)",
        "brand-gradient-1-to": "rgb(var(--gradient-1-to) / <alpha-value>)",
        "brand-gradient-2-from": "rgb(var(--gradient-2-from) / <alpha-value>)",
        "brand-gradient-2-via": "rgb(var(--gradient-2-via) / <alpha-value>)",
        "brand-gradient-2-to": "rgb(var(--gradient-2-to) / <alpha-value>)",
        "brand-gradient-3-from": "rgb(var(--gradient-3-from) / <alpha-value>)",
        "brand-gradient-3-via": "rgb(var(--gradient-3-via) / <alpha-value>)",
        "brand-gradient-3-to": "rgb(var(--gradient-3-to) / <alpha-value>)",
        "brand-gradient-4-from": "rgb(var(--gradient-4-from) / <alpha-value>)",
        "brand-gradient-4-via": "rgb(var(--gradient-4-via) / <alpha-value>)",
        "brand-gradient-4-to": "rgb(var(--gradient-4-to) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        bounce: "bounce 2s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
