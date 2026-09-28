'use client'
import { useState } from 'react'

type Props = { src?: string; alt: string; label: string; className?: string }

export default function Photo({ src, alt, label, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={`grid place-items-center bg-surface2 font-num text-2xl font-extrabold text-primary ${className}`}>
        {label}
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(el) => { if (el && el.complete && el.naturalWidth === 0) setFailed(true) }}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}
