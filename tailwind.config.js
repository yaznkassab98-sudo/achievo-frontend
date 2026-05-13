/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: '#F4F6FB', 2: '#FFFFFF', 3: '#EEF3FF' },
        surface: { DEFAULT: '#FFFFFF', 2: '#F4F6FB', 3: '#EEF3FF' },
        border:  { DEFAULT: '#E8ECF4', 2: '#D1D9EA' },
        blue:    { DEFAULT: '#2767FF', light: '#EEF3FF', dim: '#1A4DB5' },
        amber:   { DEFAULT: '#FF8A3D', light: '#FFF3EA', dim: '#C45E1A' },
        coral:   { DEFAULT: '#FF4D3B', light: '#FF8070', dim: '#7A2515' },
        text:    { DEFAULT: '#111827', muted: '#6B7A99', faint: '#9DAEC5' },
        green:   { stamp: '#22C55E', dim: '#166534' },
        navy:    { DEFAULT: '#0A1B33', 2: '#0F2444', 3: '#142D55' },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body:    ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 10vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)',  { lineHeight: '1',    letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)',  { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      opacity: {
        8: '0.08',
        12: '0.12',
      },
    },
  },
  plugins: [],
}
