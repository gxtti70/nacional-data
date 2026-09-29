'use client'
import { useId, useRef, useState } from 'react'
import type { Transfer } from '@/data/transfers'

const HOW_IN: Record<Transfer['type'], string> = {
  Fichaje: 'Fichaje definitivo',
  Libre: 'Llega libre, sin costo de traspaso',
  Cesión: 'Llega cedido (préstamo)',
  Cantera: 'Asciende desde las divisiones menores',
}
const HOW_OUT: Record<Transfer['type'], string> = {
  Fichaje: 'Traspaso definitivo',
  Libre: 'Sale libre, sin costo de traspaso',
  Cesión: 'Sale cedido (préstamo)',
  Cantera: 'Sale de las divisiones menores',
}

export default function TransferCard({ t, dir }: { t: Transfer; dir: 'in' | 'out' }) {
  const id = useId()
  const cardRef = useRef<HTMLDivElement>(null)
const tipRef = useRef<HTMLDivElement>(null)
const [up, setUp] = useState(false)

const place = () => {
  const card = cardRef.current
  const tip = tipRef.current
  if (!card || !tip) return
  const r = card.getBoundingClientRect()
  const need = tip.offsetHeight + 16
  const below = window.innerHeight - r.bottom
  const above = r.top - 72 // alto aproximado del header sticky
  setUp(below < need && above > below)
}
  const arriving = dir === 'in'
  const label = `font-num text-xs font-extrabold uppercase tracking-wider ${arriving ? 'text-tipin' : 'text-tipout'}`

  return (
    <div
      tabIndex={0}
      ref={cardRef}
      onMouseEnter={place}
      onFocus={place}
      aria-describedby={id}
      className="ficha group relative flex items-center justify-between gap-4 p-5 outline-none transition hover:z-20 hover:border-primary focus-within:z-20 focus-visible:border-primary"
    >
      <div className="min-w-0">
        <h3 className="font-display text-lg font-bold">{t.player}</h3>
        <p className="text-sm text-mute">{arriving ? 'Origen' : 'Destino'}: {t.club}</p>
      </div>
      <span className={`shrink-0 border px-2.5 py-1 font-num text-xs font-extrabold ${arriving ? 'border-primary text-primary' : 'border-line text-mute'}`}>
        {t.window}
      </span>

<div
  id={id}
  role="tooltip"
  className={`pointer-events-none absolute inset-x-0 bottom-full z-30 mb-3 -translate-y-1 border-l-4 bg-tip p-4 text-sm text-tipink opacity-0 shadow-2xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${arriving ? 'border-l-tipin' : 'border-l-tipout'}`}
  style={{ backgroundColor: 'var(--tip-bg)', color: 'var(--tip-ink)' }}
>
  <span 
    aria-hidden 
    className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 bg-tip shadow-sm"
    style={{ backgroundColor: 'var(--tip-bg)' }}
  />
  <p className={label}>{arriving ? 'Cómo llega' : 'Cómo se fue'}</p>
  <p className="mt-1 font-semibold">{(arriving ? HOW_IN : HOW_OUT)[t.type]}</p>
  {t.fee && <p className="mt-1 text-xs text-tipmute">Monto reportado: {t.fee}</p>}
  {t.note && (
    <>
      <p className={`${label} mt-3`}>Motivo</p>
      <p className="mt-1 text-tipmute">{t.note}</p>
    </>
  )}
</div>
    </div>
  )
}