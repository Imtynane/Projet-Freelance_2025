/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'itmia-navy':  '#1A2B4A',
        'itmia-blue':  '#2E6DB4',
        'itmia-light': '#E8F0FB',
        'itmia-accent':'#EF9F27',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}