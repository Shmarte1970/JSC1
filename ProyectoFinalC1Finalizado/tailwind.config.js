/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Acento primario: verde sage pastel
        sage: {
          50:  '#f2f7f1',
          100: '#dfeedd',
          200: '#c2ddbf',
          300: '#a8c5a0',
          400: '#8aaf81',
          500: '#6e9664',
          600: '#577a4e',
          700: '#456140',
          800: '#384e34',
          900: '#2e402b',
        },
        // Acento secundario: lavanda azulada suave
        lavender: {
          50:  '#f0f3f9',
          100: '#dde4f2',
          200: '#c4d0e8',
          300: '#b8c5e0',
          400: '#8fa6cc',
          500: '#6b86b8',
          600: '#536da3',
          700: '#415884',
          800: '#364968',
          900: '#2e3d55',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':   '0 2px 12px 0 rgba(0,0,0,0.06)',
        'medium': '0 4px 20px 0 rgba(0,0,0,0.10)',
        'strong': '0 8px 32px 0 rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}
