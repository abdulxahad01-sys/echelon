/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderImage: {
        'gradient-x': 'linear-gradient(90deg, rgba(153,153,153,0) 0.96%, #ffffff 52.4%, #ffffff 52.41%, rgba(153,153,153,0) 100%) 1',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
