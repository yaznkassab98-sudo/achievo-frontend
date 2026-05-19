/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: '#07080F', 2: '#0E0F1A', 3: '#1A1B2E' },
        surface: { DEFAULT: '#0E0F1A', 2: '#1A1B2E', 3: '#232542' },
        border:  { DEFAULT: 'rgba(255,255,255,0.08)', 2: 'rgba(255,255,255,0.14)' },
        blue:    { DEFAULT: '#2767FF', light: 'rgba(39,103,255,0.15)', dim: '#1F58E0', 2: '#4E83FF' },
        amber:   { DEFAULT: '#F5A623', light: 'rgba(245,166,35,0.15)', dim: '#C47E0A' },
        coral:   { DEFAULT: '#FF4D3B', light: 'rgba(255,77,59,0.15)', dim: '#CC2A18' },
        green:   { DEFAULT: '#22C55E', light: 'rgba(34,197,94,0.15)', stamp: '#22C55E' },
        violet:  { DEFAULT: '#A78BFA', light: 'rgba(167,139,250,0.15)' },
        pink:    { DEFAULT: '#F472B6', light: 'rgba(244,114,182,0.15)' },
        orange:  { DEFAULT: '#FB923C', light: 'rgba(251,146,60,0.15)' },
        text:    { DEFAULT: '#F0F2FF', muted: '#6B7A99', faint: '#3A3F5C' },
        bronze:  { DEFAULT: '#CD7F32' },
        silver:  { DEFAULT: '#A8B8C8' },
        gold:    { DEFAULT: '#F5A623' },
        platinum:{ DEFAULT: '#38BDF8' },
        navy:    { DEFAULT: '#0E0F1A', 2: '#1A1B2E', 3: '#232542' },
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body:    ['Archivo', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 10vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)',  { lineHeight: '1',    letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)',  { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        'input': '8px',
        'card':  '12px',
        'modal': '20px',
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
        'elevated': '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
        'blue':     '0 0 0 1px rgba(39,103,255,0.4), 0 10px 30px -10px rgba(39,103,255,0.5)',
      },
    },
  },
  plugins: [],
}
