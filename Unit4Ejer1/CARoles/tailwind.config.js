/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f2f8fc',
          100: '#daeef8',
          200: '#c4dff1',
          300: '#93c0e2',
          400: '#6ba8d4',
          900: '#1a3a5c',
        }
      }
    },
  },
  plugins: [],
}
