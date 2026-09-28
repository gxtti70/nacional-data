import type { HistoryEvent } from '@/data/history'

export default function Timeline({ events }: { events: HistoryEvent[] }) {
  return (
    <ol className="relative ml-28 border-l border-line sm:ml-36">
      {events.map((e) => (
        <li key={e.year + e.title} className="relative pb-10 pl-8">
          <span className={`absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full border-2 ${e.gold ? 'border-gold bg-gold' : 'border-primary bg-bg'}`} />
          <span className={`absolute right-full top-0 mr-6 w-20 text-right font-num text-3xl font-extrabold leading-none sm:w-24 ${e.gold ? 'text-gold' : 'text-primary'}`}>{e.year}</span>
          <h3 className="font-display text-2xl font-semibold">{e.title}</h3>
          <p className="text-mute">{e.text}</p>
        </li>
      ))}
    </ol>
  )
}
