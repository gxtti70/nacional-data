export default function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="rule2 mb-10 flex items-baseline gap-4 pb-2">
      <span className="font-num text-5xl font-extrabold leading-none text-primary">{n}</span>
      <h1 className="font-display text-3xl font-bold leading-none sm:text-5xl">{title}</h1>
    </div>
  )
}
