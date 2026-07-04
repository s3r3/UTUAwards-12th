'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { useTranslations } from '@/lib/i18n'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface Marker {
  lat: number
  lng: number
  label: string
  company: string
  country: string
  products: string[]
  size: number
  color: string
}

const markerData: Marker[] = [
  { lat: 3.139, lng: 101.6869, label: 'Kuala Lumpur', company: 'PT. Global Trade Asia', country: 'Malaysia', products: ['Kopi Gayo', 'Rempah'], size: 0.5, color: '#22c55e' },
  { lat: 52.3676, lng: 4.9041, label: 'Amsterdam', company: 'European Foods Ltd', country: 'Belanda', products: ['Nilam Aceh', 'Seafood'], size: 0.6, color: '#0ea5e9' },
  { lat: 25.2048, lng: 55.2708, label: 'Dubai', company: 'Middle East Trading Co', country: 'UAE', products: ['Kopi Robusta', 'Rempah'], size: 0.5, color: '#f59e0b' },
  { lat: 40.7128, lng: -74.006, label: 'New York', company: 'American Natural Goods', country: 'USA', products: ['Nilam Aceh', 'Produk Olahan'], size: 0.5, color: '#8b5cf6' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo', company: 'Tokyo Fresh Imports', country: 'Jepang', products: ['Seafood', 'Kopi Gayo'], size: 0.5, color: '#22c55e' },
  { lat: -33.8688, lng: 151.2093, label: 'Sydney', company: 'Sydney Seafood Pty', country: 'Australia', products: ['Seafood'], size: 0.4, color: '#0ea5e9' },
  { lat: 48.8566, lng: 2.3522, label: 'Paris', company: 'Euro Fragrance SARL', country: 'Prancis', products: ['Nilam Aceh'], size: 0.4, color: '#f59e0b' },
  { lat: 1.3521, lng: 103.8198, label: 'Singapore', company: 'Southeast Spices Pte', country: 'Singapura', products: ['Rempah', 'Kopi Gayo'], size: 0.4, color: '#8b5cf6' },
  { lat: -6.2088, lng: 106.8456, label: 'Jakarta', company: 'Acelora HQ', country: 'Indonesia', products: ['Pusat Ekosistem'], size: 0.7, color: '#22c55e' },
  { lat: 51.5074, lng: -0.1278, label: 'London', company: 'UK Agro Trading Ltd', country: 'Inggris', products: ['Kopi Gayo', 'Nilam Aceh'], size: 0.5, color: '#0ea5e9' },
]

const arcsData = markerData
  .filter((m) => m.label !== 'Jakarta')
  .map((m) => ({
    startLat: -6.2088, startLng: 106.8456,
    endLat: m.lat, endLng: m.lng,
    color: m.color,
  }))

export default function WorldGlobe() {
  const t = useTranslations()
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 })
  const [hovered, setHovered] = useState<Marker | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) setDimensions({ width, height })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!globeRef.current) return
    const c = globeRef.current.controls()
    if (c) {
      c.autoRotate = true
      c.autoRotateSpeed = 1.2
      c.enableZoom = false
      c.enablePan = false
      c.minPolarAngle = Math.PI / 3
      c.maxPolarAngle = Math.PI / 2
    }
  }, [mounted])

  const handlePointHover = useCallback((point: object | null) => {
    setHovered(point as Marker | null)
  }, [])

  if (!mounted) return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-sm animate-pulse">{t.worldGlobe.loading}</span>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#22c55e"
        atmosphereAltitude={0.12}
        pointsData={markerData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.01}
        pointResolution={32}
        pointsMerge={false}
        onPointHover={handlePointHover}
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2500}
        arcStroke={0.5}
        arcAltitude={0.3}
      />

      {/* Bottom tooltip */}
      {hovered && (
        <div className="absolute bottom-4 left-4 right-4 z-50 pointer-events-none bg-gray-900/95 text-white rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hovered.color }} />
            <p className="font-bold text-sm">{hovered.label}</p>
          </div>
          <p className="text-xs text-gray-300 mt-0.5 ml-4">{hovered.company} · {hovered.country}</p>
          <div className="flex flex-wrap gap-1 mt-2 ml-4">
            {hovered.products.map((p, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-200">{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
