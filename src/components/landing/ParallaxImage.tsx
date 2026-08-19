'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ParallaxImageProps {
  src: string
  alt: string
  height?: string
  overlay?: boolean
}

export default function ParallaxImage({ src, alt, height = 'h-80 md:h-[480px]', overlay = true }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden`}>
      <motion.div className="absolute inset-x-0 -top-20 -bottom-20" style={{ y }}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </motion.div>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-gray-950/20 to-gray-950/60" />
      )}
    </div>
  )
}