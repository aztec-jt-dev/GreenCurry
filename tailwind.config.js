/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
    "./constants.tsx",
    "./types.ts"
  ],
  theme: {
    extend: {
      colors: {
        'gc-dark': '#232629',
        'gc-green': '#8ec63f',
        'gc-orange': '#f7941d',
        'gc-red': '#be1e2d',
        'gc-light': '#f3f4f6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
