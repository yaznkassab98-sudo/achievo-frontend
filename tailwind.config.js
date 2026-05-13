/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#07080F', 2: '#0D0F1C', 3: '#141628' },
        surface: { DEFAULT: '#111320', 2: '#181B2E', 3: '#1F2340' },
        border: { DEFAULT: '#1E2238', 2: '#272C4A' },
        amber: { DEFAULT: '#F5A623', light: '#FDC95A', dim: '#7A5110' },
        coral: { DEFAULT: '#FF5C3A', light: '#FF8C6A', dim: '#7A2515' },
        text: { DEFAULT: '#EDE8FF', muted: '#6B7299', faint: '#3A3E5C' },
        green: { stamp: '#22C55E', dim: '#14532D' },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        stamp: 'stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-amber': 'pulseAmber 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        stamp: {
          '0%': { transform: 'scale(1.4) rotate(-8deg)', opacity: 0 },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        },
        pulseAmber: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0.3)' },
          '50%': { boxShadow: '0 0 0 12px rgba(245,166,35,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
