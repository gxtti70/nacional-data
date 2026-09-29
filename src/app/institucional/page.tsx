import SectionHeader from '@/components/ui/SectionHeader'
import SectionIntro from '@/components/ui/SectionIntro'
import { orgTree } from '@/data/institution'
import { staff } from '@/data/staff'

export default function InstitucionalPage() {
  return (
    <div>
      <SectionHeader n="III" title="Institucional y cuerpo técnico" />
      <SectionIntro>Directivos y cuerpo técnico responsables del club en la actualidad.</SectionIntro>
      <div className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold">Estructura directiva</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {orgTree.map((item) => (
            <div key={item.name} className="ficha p-6">
              <span className="text-xs uppercase tracking-wider text-primary">{item.role}</span>
              <h3 className="mt-1 font-display text-xl font-bold">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-6 font-display text-2xl font-bold">Cuerpo técnico actual</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {staff.map((st) => (
            <div key={st.role} className="ficha p-6">
              <span className="text-xs uppercase tracking-wider text-mute">{st.role}</span>
              <h3 className="mt-1 font-display text-lg font-bold">{st.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
