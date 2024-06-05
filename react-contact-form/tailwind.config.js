/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-grey': '#2A4144',
        'medium-grey': '#86A2A5',
        'green': '#0C7D69',
        'red': '#D73C3C',
        'medium-lightblue': '#E0F1E8'
      }
    },
  },
  plugins: [],
}