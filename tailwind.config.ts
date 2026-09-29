import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        mute: 'var(--mute)',
        primary: 'var(--primary)',
        deep: 'var(--deep)',
        gold: 'var(--gold)',
        alert: 'var(--alert)',
        tip: 'var(--tip-bg)',
        tipink: 'var(--tip-ink)',
        tipmute: 'var(--tip-mute)',
        tipin: 'var(--tip-in)',
        tipout: 'var(--tip-out)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        num: ['var(--font-num)', 'Impact', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
