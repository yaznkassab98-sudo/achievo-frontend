/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: '#07080F', 2: '#0D0F1C', 3: '#141628' },
        surface: { DEFAULT: '#111320', 2: '#181B2E', 3: '#1F2340' },
        border:  { DEFAULT: '#1E2238', 2: '#272C4A' },
        amber:   { DEFAULT: '#F5A623', light: '#FDC95A', dim: '#7A5110' },
        coral:   { DEFAULT: '#FF5C3A', light: '#FF8C6A', dim: '#7A2515' },
        text:    { DEFAULT: '#EDE8FF', muted: '#6B7299', faint: '#3A3E5C' },
        green:   { stamp: '#22C55E', dim: '#14532D' },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 10vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)',  { lineHeight: '1',    letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)',  { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      backgroundOpacity: {
        8: '0.08',
        12: '0.12',
      },
    },
  },
  plugins: [],
}
