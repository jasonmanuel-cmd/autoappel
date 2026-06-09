import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          red: '#ff2400',
          dark: '#000000',
          card: '#111318',
          border: '#1F2128',
          muted: '#6B7280',
        },
        /* Semantic tokens — reference CSS variables */
        bg: 'var(--color-bg)',
        'bg-elevated': 'var(--color-bg-elevated)',
        card: 'var(--color-card)',
        'card-hover': 'var(--color-card-hover)',
        border: 'var(--color-border)',
        'border-hover': 'var(--color-border-hover)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        text: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        subtle: 'var(--color-text-subtle)',
        'muted-fg': 'var(--color-muted-fg)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        'danger-bg': 'var(--color-danger-bg)',
        orange: 'var(--color-orange)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: 'var(--card-radius)',
        input: 'var(--input-radius)',
        btn: 'var(--btn-radius)',
      },
    },
  },
  plugins: [],
}
export default config
