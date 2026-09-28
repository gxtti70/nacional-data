export default function StatFigure({ value, label, gold }: { value: string | number; label: string; gold?: boolean }) {
  return (
    <div>
      <div className={`font-num text-7xl font-extrabold leading-[.9] sm:text-8xl ${gold ? 'text-gold' : 'text-ink'}`}>{value}</div>
      <div className="mt-1 text-sm text-mute">{label}</div>
    </div>
  )
}
