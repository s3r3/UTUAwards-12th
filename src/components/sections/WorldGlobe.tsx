'use client'

import { useState, useRef, useEffect } from 'react'

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

function project(lat: number, lng: number, w: number, h: number) {
  const x = (lng + 180) * (w / 360)
  const latRad = lat * Math.PI / 180
  const mercN = Math.PI - 0.5 * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad)))
  const y = h * mercN / (2 * Math.PI)
  return { x, y }
}

function arcPath(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  w: number, h: number
) {
  const p1 = project(from.lat, from.lng, w, h)
  const p2 = project(to.lat, to.lng, w, h)
  const midX = (p1.x + p2.x) / 2
  const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  const bulge = Math.max(dist * 0.08, 20)
  return `M ${p1.x} ${p1.y} Q ${midX} ${(p1.y + p2.y) / 2 - bulge} ${p2.x} ${p2.y}`
}

const arcsData = markerData
  .filter((m) => m.label !== 'Jakarta')
  .map((m) => ({ from: { lat: -6.2088, lng: 106.8456 }, to: { lat: m.lat, lng: m.lng }, color: m.color }))

export default function WorldGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 800, h: 450 })
  const [hovered, setHovered] = useState<Marker | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect
        if (width > 0 && height > 0) setDims({ w: Math.round(width), h: Math.round(height) })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const W = dims.w
  const H = Math.round(dims.w / 2)

  return (
    <div ref={containerRef} className="relative w-full h-full aspect-[2/1] max-h-[500px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Map background */}
        <image href="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" width={W} height={H} />

        {/* Grid lines */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}>
          {[-120, -60, 0, 60, 120].map((lng) => {
            const { x } = project(0, lng, W, H)
            return <line key={lng} x1={x} y1={0} x2={x} y2={H} />
          })}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const { y } = project(lat, 0, W, H)
            return <line key={lat} x1={0} y1={y} x2={W} y2={y} />
          })}
        </g>

        {/* Arcs */}
        {arcsData.map((a, i) => (
          <path
            key={i}
            d={arcPath(a.from, a.to, W, H)}
            fill="none"
            stroke={a.color}
            strokeWidth={1.2}
            strokeOpacity={0.5}
            strokeDasharray="6 4"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
          </path>
        ))}

        {/* Markers */}
        {markerData.map((m) => {
          const { x, y } = project(m.lat, m.lng, W, H)
          const r = Math.max(m.size * 10, 8)
          const isHovered = hovered?.label === m.label
          return (
            <g key={m.label} onMouseEnter={() => setHovered(m)} onMouseLeave={() => setHovered(null)} onClick={() => setHovered(hovered?.label === m.label ? null : m)} style={{ cursor: 'pointer' }}>
              {/* Glow */}
              <circle cx={x} cy={y} r={r * 2} fill={m.color} opacity={isHovered ? 0.3 : 0.1}>
                {isHovered && <animate attributeName="r" values={r * 1.5 + ';' + r * 3 + ';' + r * 1.5} dur="1.5s" repeatCount="indefinite" />}
              </circle>
              {/* Dot */}
              <circle cx={x} cy={y} r={r} fill={m.color} stroke="white" strokeWidth={isHovered ? 2 : 1.5} />
              {/* Label on hover */}
              {isHovered && (
                <text x={x} y={y - r - 8} textAnchor="middle" fill="white" fontSize={12} fontWeight={600}
                  stroke="rgba(0,0,0,0.5)" strokeWidth={3} paintOrder="stroke"
                >
                  {m.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
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
