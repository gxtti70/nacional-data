import Link from 'next/link'
import { notFound } from 'next/navigation'
import { players, playerPhoto } from '@/data/players'
import { seasons } from '@/data/seasons'
import Photo from '@/components/ui/Photo'
import SectionHeader from '@/components/ui/SectionHeader'

export function generateStaticParams() {
  return players.map((p) => ({ slug: p.slug }))
}

export default function PlayerDetailPage({ params }: { params: { slug: string } }) {
  const index = players.findIndex((p) => p.slug === params.slug)
  if (index === -1) notFound()
  const player = players[index]
  const prev = players[(index - 1 + players.length) % players.length]
  const next = players[(index + 1) % players.length]

  const playerSeasons = seasons
    .filter((s) => s.stats[player.slug])
    .map((s) => ({ id: s.id, label: s.label, ...s.stats[player.slug] }))

  return (
    <div>
      <Link href="/plantilla" className="mb-6 inline-block text-sm font-semibold text-primary hover:underline">← Volver a plantilla</Link>
      <div className="ficha mb-12 flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
        <div className="w-40 shrink-0 overflow-hidden border border-line bg-surface2 sm:w-48">
  <Photo
    key={player.slug}
    src={playerPhoto(player)}
    alt={`Foto de ${player.name}`}
    label={String(player.number)}
    className="aspect-[3/4] w-full"
  />
</div>
        <div>
          <div className="flex items-center gap-3">
            <span className="border border-line px-2 py-0.5 text-xs font-bold">{player.position}</span>
            <span className="font-num text-xl font-bold text-primary">#{player.number}</span>
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold">{player.name}</h1>
          <p className="mt-1 text-sm text-mute">Nacionalidad: {player.nationality} · Nacimiento: {player.birthDate}</p>
        </div>
      </div>
      <SectionHeader n="◆" title="Rendimiento por temporada" />
      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface2">
              <th className="border-b border-ink px-4 py-3 text-left font-semibold">Temporada</th>
              <th className="border-b border-ink px-4 py-3 text-left font-semibold">Partidos</th>
              <th className="border-b border-ink px-4 py-3 text-left font-semibold">Goles</th>
              <th className="border-b border-ink px-4 py-3 text-left font-semibold">Asistencias</th>
              <th className="border-b border-ink px-4 py-3 text-left font-semibold">Minutos</th>
            </tr>
          </thead>
          <tbody>
            {playerSeasons.map((s) => (
              <tr key={s.id} className="trow">
                <td className="border-b border-line px-4 py-3 font-bold">{s.label}</td>
                <td className="border-b border-line px-4 py-3 font-num">{s.apps}</td>
                <td className="border-b border-line px-4 py-3 font-num text-primary font-bold">{s.goals}</td>
                <td className="border-b border-line px-4 py-3 font-num">{s.assists}</td>
                <td className="border-b border-line px-4 py-3 font-num">{s.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Navegación entre jugadores" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
  <Link href={`/plantilla/${prev.slug}`} className="ficha group flex items-center gap-4 p-4 transition hover:border-primary">
    <Photo src={playerPhoto(prev)} alt={prev.name} label={String(prev.number)} className="h-12 w-12 shrink-0 rounded-full" />
    <div className="min-w-0">
      <span className="text-xs uppercase tracking-wider text-mute">← Anterior</span>
      <h3 className="truncate font-display text-lg font-bold group-hover:text-primary">{prev.name}</h3>
    </div>
  </Link>
  <Link href={`/plantilla/${next.slug}`} className="ficha group flex flex-row-reverse items-center gap-4 p-4 text-right transition hover:border-primary">
    <Photo src={playerPhoto(next)} alt={next.name} label={String(next.number)} className="h-12 w-12 shrink-0 rounded-full" />
    <div className="min-w-0">
      <span className="text-xs uppercase tracking-wider text-mute">Siguiente →</span>
      <h3 className="truncate font-display text-lg font-bold group-hover:text-primary">{next.name}</h3>
    </div>
  </Link>
</nav>
    </div>
  )
}
