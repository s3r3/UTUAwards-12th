'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { regions } from '@/data/regions'

interface RegionalMapProps {
  onRegionSelect: (regionId: string) => void
}

const fishingIcon = L.divIcon({
  html: '<div style="background:#0ea5e9;border:2.5px solid white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">🎣</div>',
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
})

const farmIcon = L.divIcon({
  html: '<div style="background:#22c55e;border:2.5px solid white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">🌾</div>',
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
})

export default function RegionalMap({ onRegionSelect }: RegionalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [4.7, 96.5],
      zoom: window.innerWidth < 640 ? 6 : 7,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const group = L.featureGroup()
    regions.forEach((r) => {
      L.marker([r.lat, r.lng], {
        icon: r.type === 'fishing' ? fishingIcon : farmIcon,
      })
        .addTo(group)
        .on('click', () => onRegionSelect(r.id))
    })
    group.addTo(map)

    if (group.getLayers().length > 0) {
      map.fitBounds(group.getBounds().pad(0.2))
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [onRegionSelect])

  return (
    <div
      ref={containerRef}
      className="h-[300px] sm:h-[400px] lg:h-[600px] w-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    />
  )
}
