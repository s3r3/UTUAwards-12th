'use client'

import { useRef, useEffect, useState, CSSProperties, RefObject } from 'react'

interface TiltOptions {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
  easing?: string
}

interface TiltState {
  rotateX: number
  rotateY: number
  scale: number
}

export function useCardTilt(options: TiltOptions = {}): {
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
  shadowStyle: CSSProperties
  isHovering: boolean
} {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 300,
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  } = options

  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      const rotateY = deltaX * maxTilt
      const rotateX = -deltaY * maxTilt

      setTilt({ rotateX, rotateY, scale })
      element.style.transition = 'transform 0ms'
    }

    const handleMouseEnter = () => setIsHovering(true)

    const handleMouseLeave = () => {
      setIsHovering(false)
      setTilt({ rotateX: 0, rotateY: 0, scale: 1 })
      element.style.transition = `transform ${speed}ms ${easing}`
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt, scale, speed, easing])

  const style: CSSProperties = {
    transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  }

  const shadowStyle: CSSProperties = isHovering
    ? {
        boxShadow: `
          ${-tilt.rotateY / maxTilt * 20}px ${tilt.rotateX / maxTilt * 20}px 40px -10px rgba(0, 0, 0, 0.15),
          ${-tilt.rotateY / maxTilt * 10}px ${tilt.rotateX / maxTilt * 10}px 20px -5px rgba(0, 0, 0, 0.1)
        `,
        transition: 'box-shadow 0.3s ease-out',
      }
    : {}

  return { ref, style, shadowStyle, isHovering }
}
