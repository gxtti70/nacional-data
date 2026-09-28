import SectionHeader from '@/components/ui/SectionHeader'
import SampleNote from '@/components/ui/SampleNote'
import { attendance, stadiumCapacity } from '@/data/attendance'

export default function AsistenciasPage() {
  return (
    <div>
      <SectionHeader n="IV" title="Asistencia al estadio" />
      <SampleNote>Promedio de espectadores por temporada en miles.</SampleNote>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {attendance.map((item) => (
          <div key={item.season} className="ficha p-6">
            <span className="font-num text-xs text-mute">TEMPORADA {item.season}</span>
            <div className="mt-2 font-num text-6xl font-extrabold text-primary">{item.avg}k</div>
            <p className="mt-1 text-sm text-mute">Espectadores promedio por encuentro</p>
          </div>
        ))}
        <div className="ficha p-6 bg-surface2">
          <span className="font-num text-xs text-mute">CAPACIDAD MÁXIMA</span>
          <div className="mt-2 font-num text-6xl font-extrabold">{stadiumCapacity}k</div>
          <p className="mt-1 text-sm text-mute">Estadio Atanasio Girardot</p>
        </div>
      </div>
    </div>
  )
}
