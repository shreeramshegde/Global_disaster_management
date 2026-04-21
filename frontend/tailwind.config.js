/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))"
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.25)"
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(59, 130, 246, 0.24)" },
          "50%": { boxShadow: "0 0 48px rgba(59, 130, 246, 0.5)" }
        }
      }
    }
  },
  plugins: []
};
