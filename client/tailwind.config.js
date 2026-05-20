/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f3f4ff',
          100: '#e8e9ff',
          200: '#d5d7ff',
          300: '#b4b7ff',
          400: '#9294ff',
          500: '#6366f1', // Indigo primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        slate: {
          850: '#131b2e',
          950: '#070b13',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(99, 102, 241, 0.45)',
        'glow-primary': '0 0 15px 2px rgba(99, 102, 241, 0.3)',
        'glow-emerald': '0 0 15px 2px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
