import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        g1: '#2d5a00',
        g2: '#457d00',
        g3: '#6aab1a',
        g4: '#a8cf6f',
        g5: '#dff0c0',
        g6: '#f3faeb',
        ink: '#0f1a06',
        muted: '#4a5e37',
        faint: '#c8ddb0',
        cream: '#faf8f3',
        sand: '#f0ead8',
        red: '#e84d1c',
        gold: '#c47d00',
        blue: '#0779e4',
      },
      fontFamily: {
        cabinet: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        lora: ['var(--font-lora)', "'Lora'", 'serif'],
      },
      boxShadow: {
        card: '0 8px 40px rgba(45, 90, 0, 0.13)',
        nav: '0 4px 32px rgba(45, 90, 0, 0.1), 0 1px 0 rgba(255,255,255,0.8) inset',
        'nav-scrolled':
          '0 8px 48px rgba(45, 90, 0, 0.16), 0 1px 0 rgba(255,255,255,0.9) inset',
        btn: '0 2px 12px rgba(45, 90, 0, 0.35)',
        'btn-hover': '0 4px 24px rgba(45, 90, 0, 0.35)',
        hero: '0 10px 36px rgba(45, 90, 0, 0.4)',
        kpi: '0 4px 20px rgba(45, 90, 0, 0.07)',
      },
      borderRadius: {
        pill: '100px',
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '28px',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'ticker-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        ticker: 'ticker 90s linear infinite',
        'ticker-reverse': 'ticker-reverse 90s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
