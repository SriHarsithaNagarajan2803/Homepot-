/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#FBF4F0',
          100: '#F5E5DC',
          200: '#E8C9B8',
          300: '#D7A68E',
          400: '#BD7553',
          500: '#9C4A28', // Primary brand color from designs
          600: '#8B3A1C',
          700: '#722E15',
          800: '#5A2411',
          900: '#3E1809',
        },
        charcoal: {
          50: '#F3F4F5',
          100: '#E4E7E9',
          600: '#4B5558',
          700: '#3E484A',
          800: '#333C3E', // Button charcoal color from designs
          900: '#22292A',
          950: '#171C1D',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FAF6EE', // Background beige
          200: '#F3ECE0',
          300: '#EADBCC',
          400: '#DAC9B4',
        },
        goldamber: {
          100: '#FEF3DB',
          200: '#FCE4B2',
          500: '#D99436',
          600: '#C37E22',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(156, 74, 40, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -5px rgba(51, 60, 62, 0.12), 0 4px 10px -2px rgba(156, 74, 40, 0.06)',
        'dock': '0 -4px 24px -2px rgba(51, 60, 62, 0.08), 0 8px 30px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
