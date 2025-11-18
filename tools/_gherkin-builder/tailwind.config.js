/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        // Backgrounds (match Pack-Manager)
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
        // Card surfaces
        "card-light": "#ffffff",
        "card-dark": "#1e293b",
        // Borders
        "border-light": "#e2e8f0",
        "border-dark": "#334155",
        // Text
        "text-light": "#1e293b",
        "text-dark": "#e2e8f0",
        // Subtext / secondary text
        "subtext-light": "#64748b",
        "subtext-dark": "#94a3b8",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ['"SFMono-Regular"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
