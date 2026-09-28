export default function Sparkline({ values }: { values: number[] }) {
  const w = 64, h = 22
  const m = Math.max(...values, 1)
  const pts = values.map((v, i) => `${values.length > 1 ? (i * w) / (values.length - 1) : 0},${h - (v / m) * h}`).join(' ')
  return (
    <svg className="sp" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline points={pts} />
    </svg>
  )
}
