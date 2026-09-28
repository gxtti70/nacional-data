import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import StatFigure from '@/components/ui/StatFigure'
import SampleNote from '@/components/ui/SampleNote'
import { honours } from '@/data/history'
import { currentSeason } from '@/data/seasons'
import { players } from '@/data/players'
import { gallery } from '@/data/gallery'
import Photo from '@/components/ui/Photo'

export default function Home() {
  return (
    <div>
      <div className="mb-12 border-b border-line pb-8">
        <span className="mb-3 inline-block border border-primary px-3 py-1 font-num text-sm tracking-wider text-primary">ARCHIVO OFICIAL DE DATOS</span>
        <h1 className="font-display text-5xl font-bold leading-tight sm:text-7xl">
          Atlético <span className="text-primary">Nacional</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-mute">
          Repositorio histórico, estadísticas detalladas de plantilla, registros de asistencias y palmarés del rey de copas colombiano.
        </p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="ficha p-6"><StatFigure value="1947" label="Año de fundación" /></div>
        <div className="ficha p-6"><StatFigure value={currentSeason.label} label="Temporada activa" gold /></div>
        <div className="ficha p-6"><StatFigure value={players.length} label="Jugadores en registro" /></div>
      </div>

      <div className="mb-16">
        <SectionHeader n="I" title="Palmarés destacado" />
        <SampleNote />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {honours.map((h) => (
            <div key={h.name} className="ficha p-6">
              <span className={`font-num text-4xl font-extrabold ${h.gold ? 'text-gold' : 'text-primary'}`}>
                {h.count !== null ? h.count : '—'}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">{h.name}</h3>
              <p className="mt-1 text-sm text-mute">{h.years}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold">Últimas entradas en Galería</h2>
          <Link href="/galeria" className="text-sm font-semibold text-primary hover:underline">Ver archivo completo →</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {gallery.slice(0, 3).map((item) => (
            <div key={item.id} className="ficha overflow-hidden">
              <Photo src={item.src} alt={item.title} label={String(item.year)} className="h-48 w-full" />
              <div className="p-4">
                <span className="font-num text-xs text-primary">{item.year}</span>
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-mute">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
