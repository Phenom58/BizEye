/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        crystal: {
          950: '#070709',
          900: '#0a0a0d',
          850: '#0e0e13',
          800: '#121218',
          750: '#171720',
          700: '#1d1d28',
          600: '#262635',
        },
      },
    },
  },
  plugins: [],
};
