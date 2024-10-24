/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // o 'media' si prefieres usar la configuración del sistema operativo
  theme: {
    extend: {
      colors: {
        primary: "#065487",
        secondary: "#2eb0c9",
      },
    },
  },
  plugins: [],
};
