/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FC',
          100: '#E0F3F9',
          200: '#BAE5F2',
          300: '#7CD1E8',
          400: '#38B8DC',
          500: '#109ECC', // Primary Blue
          600: '#0C7FA6',
          700: '#0C6685',
          800: '#0F546D',
          900: '#123B5D', // Deep Navy
        },
        navy: {
          50: '#F4F7FB',
          100: '#E8EFF6',
          700: '#1C4A73',
          800: '#163B5D',
          900: '#123B5D',
          950: '#0A2033',
        },
        dark: {
          text: '#172B3A',
        },
        surface: {
          bg: '#F7FAFC',
          border: '#E5EDF2',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          critical: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

