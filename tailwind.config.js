/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        xanin: {
          bg: '#0a0a0f',
          card: '#111118',
          border: '#1e1e2e',
          accent: '#6c63ff',
          text: '#e2e2e8',
          muted: '#6b6b7b',
        }
      }
    },
  },
  plugins: [],
}