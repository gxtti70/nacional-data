import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { fixtures } from '@/data/fixtures'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('Partidos y resultados', 'Calendario, fixtures y resultados del Atlético Nacional.')

const dateFormat = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })

export default function PartidosPage() {
  const sorted = [...fixtures].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div>
      <SectionHeader n="VII" title="Partidos y resultados" />
      <SectionIntro>Calendario y marcadores de Atlético Nacional sincronizados desde ESPN.</SectionIntro>
      {sorted.length ? (
        <div className="space-y-3">
          {sorted.map((match) => (
            <article key={match.id} className="ficha grid gap-3 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="sm:text-right"><p className="font-display text-lg font-bold">{match.home}</p><p className="text-xs text-mute">Local</p></div>
              <div className="min-w-32 text-center">
                <p className="font-num text-2xl font-extrabold">{match.homeScore ?? '—'} <span className="text-mute">:</span> {match.awayScore ?? '—'}</p>
                <p className="mt-1 text-xs font-semibold text-primary">{match.statusDetail || match.status}</p>
              </div>
              <div><p className="font-display text-lg font-bold">{match.away}</p><p className="text-xs text-mute">Visitante</p></div>
              <p className="text-sm text-mute sm:col-span-3">{dateFormat.format(new Date(match.date))} · {match.competition}{match.stage ? ` · ${match.stage}` : ''}</p>
            </article>
          ))}
        </div>
      ) : <p className="ficha p-6 text-mute">Todavía no hay partidos sincronizados. Ejecuta <code>npm run sync:espn</code>.</p>}
    </div>
  )
}
