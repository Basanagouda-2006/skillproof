/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Centralized design tokens - the ONLY place colors are defined.
        // Components must reference these, never hardcode hex values.
        indigo: {
          950: '#0B0F2E',
          900: '#12163F',
          800: '#1A1F52',
          700: '#242B6B',
        },
        brand: {
          blue: '#3654F0',
          violet: '#6A4CF0',
          cyan: '#38D4E0',
        },
        slate: {
          950: '#0D1020',
          900: '#151832',
          700: '#3E4260',
          500: '#6B6F91',
          300: '#B3B6D1',
          100: '#E7E8F5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          off: '#F7F7FC',
        },
        evidence: {
          strong: '#1E9E6B',
          moderate: '#D69A1E',
          weak: '#C15B2B',
          none: '#8A8DAA',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'trace-gradient': 'linear-gradient(135deg, #12163F 0%, #242B6B 55%, #3654F0 100%)',
      },
    },
  },
  plugins: [],
};
