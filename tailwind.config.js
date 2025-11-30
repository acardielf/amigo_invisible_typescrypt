/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Christmas/festive theme colors
        primary: {
          DEFAULT: '#d42f2f', // Christmas red
          light: '#ff5c5c',
          dark: '#a01d1d',
        },
        secondary: {
          DEFAULT: '#2f7d32', // Christmas green
          light: '#60ad5e',
          dark: '#005005',
        },
        gold: {
          DEFAULT: '#ffd700',
          light: '#ffe44d',
          dark: '#ccac00',
        },
        snow: '#f8f9fa',
        ice: '#e3f2fd',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        festive: ['Georgia', 'serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
