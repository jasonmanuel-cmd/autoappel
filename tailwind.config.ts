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
          red: '#C0392B',
          dark: '#1a0a0a',
          card: '#2d1010',
          border: '#5c1a1a',
          muted: '#8B0000',
        },
      },
    },
  },
  plugins: [],
}
export default config
