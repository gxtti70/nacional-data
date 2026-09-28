export default function SampleNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mb-8 border-l-[3px] border-gold pl-3 text-sm text-mute">
      {children ?? 'Datos de muestra para validar el diseño. Reemplazar por datos verificados en src/data.'}
    </p>
  )
}
