/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9f0fe',
          200: '#bce5fd',
          300: '#8dd6fb',
          400: '#55c0f7',
          500: '#2ba6e3',
          600: '#1d83c0',
          700: '#19689a',
          800: '#19577f',
          900: '#194968'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
