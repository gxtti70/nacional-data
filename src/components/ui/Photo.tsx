'use client'
import { useEffect, useRef, useState } from 'react'

type Props = { src?: string; alt: string; label: string; className?: string }

export default function Photo({ src, alt, label, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Reinicia el estado cuando cambia la imagen
  useEffect(() => { setFailed(false) }, [src])

  // Cubre el caso en que la imagen ya falló antes de hidratar
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth === 0) setFailed(true)
  }, [src])

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
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}