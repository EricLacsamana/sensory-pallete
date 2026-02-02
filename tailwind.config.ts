import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)'],
      display: ['var(--font-fredoka)'],
    },
    extend: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#ff6b35',
        accent: '#feba49',
        surface: '#0f1419',
        'surface-light': '#1a202c',
        'surface-lighter': '#2d3748',
        muted: '#718096',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(254, 186, 73, 0.3)',
        'glow-lg': '0 0 40px rgba(254, 186, 73, 0.5)',
        'inset-glow': 'inset 0 0 20px rgba(254, 186, 73, 0.2)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 50px rgba(254, 186, 73, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(254, 186, 73, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(254, 186, 73, 0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'slide-in': {
          'from': { transform: 'translateY(10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
export default config
