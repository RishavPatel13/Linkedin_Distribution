/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          DEFAULT: '#0077B5',
          hover: '#005f8d',
          light: '#e8f4f9',
          dark: '#004b75'
        },
        primary: {
          DEFAULT: '#0077B5',
          hover: '#005f8d',
        },
        sidebar: {
          bg: '#0f172a',
          text: '#94a3b8',
          active: '#ffffff',
          accent: '#0077B5',
          border: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
