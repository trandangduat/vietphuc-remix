/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lacquer: {
          DEFAULT: '#0A0D12',
          surface: '#12161F',
          card: '#181E29',
          border: '#242D3D',
          hover: '#1F2736',
        },
        imperial: {
          gold: '#C69B56',
          'gold-light': '#E2BE7C',
          'gold-dark': '#9A7332',
          red: '#8B1E1E',
          'red-bright': '#B82828',
          teal: '#1A4B54',
          'teal-light': '#266D7A',
        },
        silk: {
          ivory: '#F7F4EE',
          muted: '#9DA6B2',
          dark: '#484F58',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        calligraphy: ['"Dancing Script"', '"Caveat"', 'cursive'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      },
      boxShadow: {
        'atrium': '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(198, 155, 86, 0.1)',
        'gold-glow': '0 0 20px rgba(198, 155, 86, 0.25)',
      }
    },
  },
  plugins: [],
}
