/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: "#4f46e5",
          secondary: "#6366f1",
          dark: "#1e293b",
          label: "#444444",
          border: "#dddddd",
          text: "#333333",
        },
      },
    },
  },
  plugins: [],
}

