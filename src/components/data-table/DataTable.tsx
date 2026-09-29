'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Photo from '@/components/ui/Photo'
import Sparkline from '@/components/charts/Sparkline'

export type Column = { key: string; header: string; kind?: 'text' | 'num' | 'bar' | 'spark' | 'pos' | 'player' | 'action' }
type Row = Record<string, any>

export default function DataTable({ columns, rows, defaultSort, rowKey = 'slug' }: {
  columns: Column[]; rows: Row[]; defaultSort: string; rowKey?: string
}) {
  const [sort, setSort] = useState({ key: defaultSort, dir: -1 })
  const [ready, setReady] = useState(false)
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id) }, [])

  const max = useMemo(
    () => Object.fromEntries(columns.filter((c) => c.kind === 'bar').map((c) => [c.key, Math.max(1, ...rows.map((r) => Number(r[c.key])))])),
    [columns, rows],
  )
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir),
    [rows, sort],
  )

  const onKey = (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    const tr = (e.target as HTMLElement).closest('tr')
    if (!tr) return
    if (e.key === 'ArrowDown') { (tr.nextElementSibling as HTMLElement | null)?.focus(); e.preventDefault() }
    if (e.key === 'ArrowUp') { (tr.previousElementSibling as HTMLElement | null)?.focus(); e.preventDefault() }
    if (e.key === 'Enter') tr.querySelector('a')?.click()
  }

  const cell = (c: Column, r: Row) => {
    switch (c.kind) {
      case 'bar':
        return (
          <div className="flex min-w-[150px] items-center gap-3">
            <b className="min-w-8 font-num text-xl font-extrabold">{r[c.key]}</b>
            <i className="block h-2 bg-deep transition-[width] duration-700" style={{ width: ready ? `${(Number(r[c.key]) / max[c.key]) * 100}%` : 0 }} />
          </div>
        )
      case 'spark': return <Sparkline values={r[c.key]} />
      case 'pos': return <span className="border border-line px-1.5 py-0.5 text-xs">{r[c.key]}</span>
      case 'player': {
        const label = r.number != null ? String(r.number) : String(r.name).split(' ').map((w: string) => w[0]).join('').slice(0, 2)
        const inner = (
          <span className="flex items-center gap-3">
            <Photo src={r.photo} alt={r.name} label={label} className="h-9 w-9 shrink-0" />
            <span className="font-medium">{r.name}</span>
          </span>
        )
        return r.href ? <Link href={r.href} className="hover:text-primary">{inner}</Link> : inner
      }
      case 'action':
  return r[c.key] ? (
    <Link
      href={r[c.key]}
      className="whitespace-nowrap border border-primary px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-bg"
    >
      Ver perfil →
    </Link>
  ) : null
      default: return r[c.key]
    }
  }

  if (rows.length === 0) return <p className="border border-line p-6 text-mute">Sin datos para este filtro.</p>

  return (
    <div className="overflow-x-auto border border-line bg-surface">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-surface2">
            <th className="border-b border-ink px-3.5 py-2.5 text-left font-semibold">#</th>
            {columns.map((c) => {
             const sortable = c.kind !== 'spark' && c.kind !== 'action'
              return (
                <th
                  key={c.key}
                  aria-sort={sort.key === c.key ? (sort.dir < 0 ? 'descending' : 'ascending') : 'none'}
                  className="whitespace-nowrap border-b border-ink px-3.5 py-2.5 text-left font-semibold"
                >
                  {sortable ? (
                    <button onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? -s.dir : -1 }))}>
                      {c.header}
                      {sort.key === c.key && <span className="ml-1 text-primary">{sort.dir < 0 ? '▼' : '▲'}</span>}
                    </button>
                  ) : c.header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody onKeyDown={onKey}>
          {sorted.map((r, i) => (
            <tr key={r[rowKey]} tabIndex={0} className="trow">
              <td className="border-b border-line px-3.5 py-2.5 font-num text-xl font-extrabold text-mute">{i + 1}</td>
              {columns.map((c) => <td key={c.key} className="border-b border-line px-3.5 py-2.5">{cell(c, r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
