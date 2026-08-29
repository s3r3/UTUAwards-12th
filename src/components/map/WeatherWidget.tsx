'use client'

import { useEffect, useState } from 'react'

interface WeatherData {
  temperature: number
  humidity: number
  description: string
  icon: string
}

const WEATHER_DESCS: Record<number, string> = {
  0: 'Cerah', 1: 'Cerah Berawan', 2: 'Berawan', 3: 'Berawan',
  45: 'Kabut', 48: 'Kabut Berkarat',
  51: 'Gerimis Ringan', 53: 'Gerimis Sedang', 55: 'Gerimis Lebat',
  61: 'Hujan Ringan', 63: 'Hujan Sedang', 65: 'Hujan Lebat',
  71: 'Salju Ringan', 73: 'Salju Sedang', 75: 'Salju Lebat',
  95: 'Badai Petir',
}

const WEATHER_ICONS: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  95: '⛈️',
}

export default function WeatherWidget({ lat = 5.5, lng = 95.3 }: { lat?: number; lng?: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const controller = new AbortController()
        const tid = setTimeout(() => controller.abort(), 5000)
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FBanda_Aceh`,
          { signal: controller.signal }
        )
        clearTimeout(tid)
        if (!res.ok) return
        const data = await res.json()
        const { temperature_2m, relative_humidity_2m, weather_code } = data.current
        setWeather({
          temperature: temperature_2m,
          humidity: relative_humidity_2m,
          description: WEATHER_DESCS[weather_code] || 'Unknown',
          icon: WEATHER_ICONS[weather_code] || '🌡️',
        })
      } catch {
        // silent fallback — no console spam
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => { clearInterval(interval) }
  }, [lat, lng])

  if (loading) return <div className="animate-pulse h-20 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
  if (!weather) return null

  return (
    <div className="rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 p-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{weather.icon}</span>
        <span className="text-sm font-medium opacity-80">{weather.description}</span>
      </div>
      <div className="text-3xl font-bold">{weather.temperature}°C</div>
      <div className="mt-1 flex items-center gap-1 text-xs opacity-80">
        <span>💧</span>
        <span>{weather.humidity}% humidity</span>
      </div>
    </div>
  )
}
