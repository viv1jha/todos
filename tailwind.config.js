/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'gold': '#D4AF37',
        'white': '#FFFFFF',
        primary: {
          DEFAULT: '#D4AF37',
          '50': '#fefce8',
          '100': '#fef9c3',
          '200': '#fef08a',
          '300': '#fde047',
          '400': '#facc15',
          '500': '#eab308',
          '600': '#ca8a04',
          '700': '#a16207',
          '800': '#854d0e',
          '900': '#713f12',
          '950': '#422006'
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}