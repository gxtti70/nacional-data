'use client'

export default function ThemeToggle() {
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      root.dataset.theme = next
      try { localStorage.setItem('n-theme', next) } catch {}
    }
    const doc = document as any
    if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return }
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    doc.startViewTransition(apply).ready.then(() =>
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 600, easing: 'ease-in', pseudoElement: '::view-transition-new(root)' },
      ),
    )
  }
  return (
    <button
      onClick={toggle}
      aria-label="Cambiar entre modo claro y oscuro"
      className="grid h-10 w-10 flex-none place-items-center rounded-full border border-line hover:border-primary"
    >
      <svg className="tg-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
      </svg>
    </button>
  )
}
