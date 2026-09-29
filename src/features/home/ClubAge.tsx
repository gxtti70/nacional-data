'use client'
import { useEffect, useState } from 'react'

type Milestone = { year: number; label: string; gold?: boolean }

export default function ClubAge({ founded, current, milestones }: {
  founded: number; current: number; milestones: Milestone[]
}) {
  const age = current - founded
  const span = current - founded
  const [n, setN] = useState(0)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(age); return }
    let raf = 0
    const start = performance.now()
    const dur = 1600
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      setN(Math.round(age * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [age])

  const progress = age === 0 ? 0 : (n / age) * 100
  const points: Milestone[] = [...milestones, { year: current, label: 'Hoy' }]

  return (
    <section aria-label="Edad del club" className="ficha relative mb-16 p-8 sm:p-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -right-4 -top-6 select-none font-num text-[10rem] font-extrabold leading-none text-transparent opacity-30 [-webkit-text-stroke:1.5px_var(--primary)] sm:text-[16rem]">
          {founded}
        </span>
      </div>

      <div className="relative grid items-end gap-8 sm:grid-cols-[auto_1fr]">
        <div className="flex items-end gap-4">
          <span className="sr-only">{age} años de historia</span>
          <span aria-hidden className="font-num text-[8rem] font-extrabold leading-[.8] tabular-nums text-primary sm:text-[12rem]">{n}</span>
          <span aria-hidden className="pb-2 font-num text-3xl font-extrabold uppercase leading-none tracking-wider text-gold sm:text-5xl">años</span>
        </div>
        <div className="max-w-xl">
          <p className="font-num text-sm tracking-[.25em] text-gold">FUNDADO EN {founded}</p>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">Más de siete décadas de historia verdolaga</h2>
          <p className="mt-3 text-mute">De la fundación en Medellín a dos Copas Libertadores: el recorrido de un club que se hizo grande a pulso.</p>
        </div>
      </div>

      <div className="relative mx-8 mt-14 pb-16">
        <div className="h-0.5 bg-line" />
        <div className="absolute left-0 top-0 h-0.5 bg-primary" style={{ width: `${progress}%` }} />
        {points.map((m) => {
          const pct = span === 0 ? 0 : ((m.year - founded) / span) * 100
          const on = progress >= pct
          return (
            <div key={`${m.year}-${m.label}`} className="absolute top-[-7px] -translate-x-1/2 text-center" style={{ left: `${pct}%` }}>
              <span className={`block h-4 w-4 rotate-45 border-2 transition-colors duration-300 ${on ? (m.gold ? 'border-gold bg-gold' : 'border-primary bg-primary') : 'border-line bg-bg'}`} />
              <span className={`mt-4 block font-num text-lg font-extrabold leading-none ${m.gold ? 'text-gold' : 'text-primary'}`}>{m.year}</span>
              <span className="mt-1 hidden whitespace-nowrap text-xs text-mute sm:block">{m.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}