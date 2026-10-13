export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 text-sm text-mute">
      <div className="mx-auto max-w-6xl">
  © {new Date().getFullYear()} Archivo de datos del Atlético Nacional · Proyecto independiente, con datos de ESPN.
  <span className="block sm:inline sm:before:content-['_·_']">Fuentes: ESPN, club, DIMAYOR y Transfermarkt.</span>
</div>
    </footer>
  )
}
