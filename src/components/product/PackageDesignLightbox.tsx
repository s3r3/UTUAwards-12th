'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function PackageDesignLightbox({
  images,
  folder,
  index,
  onClose,
  onNavigate,
}: {
  images: string[]
  folder: string
  index: number
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, images.length, onClose, onNavigate])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute right-4 top-4 p-2 text-white/80 hover:text-white"
        onClick={onClose}
        aria-label="Tutup"
      >
        <X size={28} />
      </button>

      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white disabled:opacity-30"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate((index - 1 + images.length) % images.length)
        }}
        disabled={images.length <= 1}
        aria-label="Sebelumnya"
      >
        <span className="text-3xl">‹</span>
      </button>

      <div className="relative h-[80vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt={`${folder} package design ${index + 1}`}
          fill
          unoptimized
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white disabled:opacity-30"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate((index + 1) % images.length)
        }}
        disabled={images.length <= 1}
        aria-label="Berikutnya"
      >
        <span className="text-3xl">›</span>
      </button>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(i)
              }}
              className={`h-2 w-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`Gambar ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
