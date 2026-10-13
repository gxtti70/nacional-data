export default function SectionHeader({ n, title, as: Heading = 'h1' }: { n: string; title: string; as?: 'h1' | 'h2' }) {
  return (
    <div className="rule2 mb-10 flex items-baseline gap-4 pb-2">
      <span className="font-num text-5xl font-extrabold leading-none text-primary">{n}</span>
      <Heading className="font-display text-3xl font-bold leading-none sm:text-5xl">{title}</Heading>
    </div>
  )
}
