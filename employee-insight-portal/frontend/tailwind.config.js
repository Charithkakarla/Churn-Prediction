/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f8f4',
          100: '#e8ede1',
          200: '#d1dbc4',
          300: '#b0c29d',
          400: '#8fa876',
          500: '#6b8e4e',
          600: '#556f3e',
          700: '#445833',
          800: '#38472b',
          900: '#2f3c26',
        },
      },
    },
  },
  plugins: [],
}
