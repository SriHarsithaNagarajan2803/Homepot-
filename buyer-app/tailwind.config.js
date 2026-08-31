/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: '#C25E3E',
        clayDark: '#A04628',
        warmCream: '#FFFDF9',
        sandBg: '#FBF6EE',
        turmeric: '#E5A93C',
        earthenCharcoal: '#2C2420',
        leafGreen: '#2E7D32',
      },
    },
  },
  plugins: [],
}