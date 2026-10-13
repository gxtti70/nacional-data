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
  const [below, setBelow] = useState(false)
  const [open, setOpen] = useState(false)

  const place = () => {
    const card = cardRef.current
    const tip = tipRef.current
    if (!card || !tip) return
    const r = card.getBoundingClientRect()
    const need = tip.offsetHeight + 16
    const roomAbove = r.top - 72
    const roomBelow = window.innerHeight - r.bottom
    setBelow(roomAbove < need && roomBelow > roomAbove)
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
      <button type="button" className="shrink-0 border border-line px-2 py-1 text-xs sm:hidden" aria-label="Ver detalles del traspaso" aria-expanded={open} aria-controls={id} onClick={() => { place(); setOpen((value) => !value) }}>
        ⓘ
      </button>

<div
  ref={tipRef}
  id={id}
  role="tooltip"
  className={`pointer-events-none absolute inset-x-0 z-30 border-l-4 bg-tip p-4 text-sm text-tipink shadow-2xl transition-all duration-200 ${below ? 'top-full mt-3 translate-y-1' : 'bottom-full mb-3 -translate-y-1'} ${open ? 'translate-y-0 opacity-100' : 'opacity-0'} sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 ${arriving ? 'border-l-tipin' : 'border-l-tipout'}`}
  style={{ backgroundColor: 'var(--tip-bg)', color: 'var(--tip-ink)' }}
>
  <span 
    aria-hidden 
    className={`absolute ${below ? '-top-1.5' : '-bottom-1.5'} left-8 h-3 w-3 rotate-45 bg-tip shadow-sm`}
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
