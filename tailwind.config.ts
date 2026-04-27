import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        tight: ['var(--font-inter-tight)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        instrument: ['var(--font-instrument-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '1272px',
      },
      colors: {
        'brand-ink': '#0f3d3e',
        'brand-lime': '#d3fa62',
        ink: '#20201e',
        'ink-deep': '#1b1d1e',
        'ink-black': '#0a0a0a',
        'ui-333': '#333333',
        'neutral-line': '#cccccc',
        'neutral-border': '#dddddd',
        'surface-mute': '#fafafa',
        'pill-surface': '#e7e2e1a1',
        'pill-border': '#f7ffde',
        hairline: '#0000001a',
        'health-green': '#15803d',
        'health-yellow': '#d97706',
        'health-red': '#ef4444',
        'accent-warn': '#ffaf68',
        'link-brand': '#0f3d3e',
      },
      boxShadow: {
        card: '0 0 0 1px #0000001a, 0 1px 3px #0000001a',
      },
    },
  },
  plugins: [],
};
export default config;
