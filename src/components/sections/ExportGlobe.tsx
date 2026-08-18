'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useUIStore } from '@/store/ui.store'
import { SAMPLE_PRODUCTS } from '@/constants/products'
import type { GlobeMethods } from 'react-globe.gl'

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// Aceh (Banda Aceh) as the origin point
const ACEH_LAT = 5.55
const ACEH_LNG = 95.32

// Export destinations with coordinates for arcs
const EXPORT_DESTINATIONS = [
  { country: 'USA', city: 'New York', flag: '🇺🇸', lat: 40.71, lng: -74.0, color: '#60a5fa' },
  { country: 'Japan', city: 'Tokyo', flag: '🇯🇵', lat: 35.68, lng: 139.69, color: '#fbbf24' },
  { country: 'Germany', city: 'Berlin', flag: '🇩🇪', lat: 52.52, lng: 13.41, color: '#3b82f6' },
  { country: 'South Korea', city: 'Seoul', flag: '🇰🇷', lat: 37.57, lng: 126.98, color: '#f59e0b' },
  { country: 'France', city: 'Paris', flag: '🇫🇷', lat: 48.85, lng: 2.35, color: '#10b981' },
  { country: 'India', city: 'Mumbai', flag: '🇮🇳', lat: 19.07, lng: 72.83, color: '#8b5cf6' },
  { country: 'Singapore', city: 'Singapore', flag: '🇸🇬', lat: 1.35, lng: 103.82, color: '#ef4444' },
  { country: 'Malaysia', city: 'Kuala Lumpur', flag: '🇲🇾', lat: 3.14, lng: 101.69, color: '#f59e0b' },
  { country: 'Italy', city: 'Rome', flag: '🇮🇹', lat: 41.89, lng: 12.49, color: '#60a5fa' },
  { country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', lat: 52.37, lng: 4.89, color: '#ef4444' },
]

// Arcs data: Aceh -> each export destination
const ARC_DATA = [
  ...EXPORT_DESTINATIONS.map((dest) => ({
    startLat: ACEH_LAT,
    startLng: ACEH_LNG,
    endLat: dest.lat,
    endLng: dest.lng,
    country: dest.country,
    city: dest.city,
    flag: dest.flag,
  })),
]

// Marker data: Aceh itself + major export destinations
const MARKER_DATA = [
  { lat: ACEH_LAT, lng: ACEH_LNG, size: 0.3, color: '#f59e0b', label: 'Aceh, Indonesia' },
  ...EXPORT_DESTINATIONS.map((dest) => ({
    lat: dest.lat,
    lng: dest.lng,
    size: 0.15,
    color: dest.color,
    label: `${dest.city}, ${dest.country}`,
  })),
]

export default function ExportGlobe() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined)
  const theme = useUIStore((s) => s.theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-primary-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <Globe
        ref={globeEl}
        width={undefined}
        height={undefined}
        globeImageUrl={theme === 'dark'
          ? 'https://cdn.jsdelivr.net/gh/ajduber/ReactGlobe.gl/example/img/globe-dark.jpg'
          : 'https://cdn.jsdelivr.net/gh/ajduber/ReactGlobe.gl/example/img/globe.jpg'
        }
        backgroundColor="rgba(0,0,0,0)"
        showGraticules={false}
        showAtmosphere={true}
        atmosphereColor={theme === 'dark' ? '#3b82f6' : '#60a5fa'}
        atmosphereAltitude={0.25}
        arcsData={ARC_DATA}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => ['#f59e0b', '#f59e0b']}
        arcStroke={0.5}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashInitialGap={() => Math.random() * 5}
        arcDashAnimateTime={1000}
        arcLabel={(d: any) => `${d.flag} ${d.city}, ${d.country}`}
        ringsData={MARKER_DATA}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius={(d: any) => d.size * 2}
        ringColor={(d: any) => d.color}
        ringPropagationSpeed={0.5}
        ringRepeatPeriod={1000}
        labelsData={MARKER_DATA}
        labelLat="lat"
        labelLng="lng"
        labelText={(d: any) => d.label}
        labelSize={0.6}
        labelColor={(d: any) => d.color}
        labelAltitude={0.01}
      />

      {/* Destination cards overlay */}
      <div className="absolute bottom-4 left-4 right-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {EXPORT_DESTINATIONS.slice(0, 6).map((dest: any) => {
            const sampleProduct = SAMPLE_PRODUCTS.find(p => p.exportDestinations?.includes(dest.country))
            return (
              <div
                key={dest.country}
                className="flex-shrink-0 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center min-w-[80px]"
              >
                <div className="text-xl mb-1">{dest.flag}</div>
                <div className="text-xs font-semibold text-gray-900 dark:text-white">{dest.country}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{dest.city}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
