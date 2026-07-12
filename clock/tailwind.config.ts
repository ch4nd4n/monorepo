import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0d0c0a',
        foreground: '#f1f0ee',
        muted: '#1f1e1b',
        'muted-foreground': '#a3a19d',
        faint: '#716e6a',
        accent: '#f75d59',
        'accent-hover': '#ff726c',
        'accent-press': '#e54c4a',
        'on-accent': '#100606',
        positive: '#4eb068',
        danger: '#f75d59',
        border: '#2d2b28',
        'border-strong': '#44423e',
        card: '#161513',

        'light-bg': '#fbfaf8',
        'light-surface': '#ffffff',
        'light-surface-2': '#f4f2ef',
        'light-border': '#e1dfdc',
        'light-border-strong': '#c6c4c0',
        'light-text': '#151411',
        'light-muted': '#5a5853',
        'light-faint': '#898681',
        'light-accent': '#e23439',
        'light-accent-hover': '#cd1526',
        'light-accent-press': '#bb061e',
        'light-on-accent': '#fffafa',
        'light-positive': '#25984d',
        'light-danger': '#d01c29',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
