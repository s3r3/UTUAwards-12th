'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Maximize2, Minimize2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Order } from '@/types'

interface DeliveryTrackerProps {
  order: Order
}

const ESTIMATED_DELIVERY = new Date(Date.now() + 86400000).toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export default function DeliveryTracker({ order }: DeliveryTrackerProps) {
  const [zoom, setZoom] = useState(1)
  const [viewX, setViewX] = useState(0)
  const [viewY, setViewY] = useState(0)
  const [showTracking, setShowTracking] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  const isDelivered = order.status === 'DELIVERED'

  const progress = {
    PENDING: 0.05,
    PAID: 0.1,
    PROCESSING: 0.25,
    SHIPPING: 0.6,
    DELIVERED: 1,
    CANCELLED: 0,
  }[order.status] || 0

  const updateMapTransform = () => {
    if (mapRef.current) {
      mapRef.current.style.transform = `translate(${viewX}px, ${viewY}px) scale(${zoom})`
    }
  }

  useEffect(() => {
    updateMapTransform()
  }, [zoom, viewX, viewY])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((z) => Math.max(0.5, Math.min(3, z + delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({ x: e.clientX - viewX, y: e.clientY - viewY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setViewX(e.clientX - dragStart.x)
      setViewY(e.clientY - dragStart.y)
    }
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const handleReset = () => {
    setZoom(1)
    setViewX(0)
    setViewY(0)
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setShowTracking(!showTracking)}
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-black transition-colors"
      >
        <MapPin size={16} />
        Tracking Pengiriman
        <ChevronDown size={14} className={`transition-transform ${showTracking ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showTracking && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Map Container */}
            <div className="relative my-6 border border-black/15 rounded-xl overflow-hidden bg-stone-100 dark:bg-gray-900">
              <div
                ref={mapRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="w-full h-80 cursor-grab active:cursor-grabbing"
                style={{ transition: dragging ? 'none' : 'transform 0.1s ease-out' }}
              >
                <div className="w-full h-full relative">
                  {/* Background Map SVG */}
                  <svg viewBox="0 0 800 500" className="w-full h-full opacity-50 dark:opacity-40">
                    <path d="M-50 100 L-20 80 L20 70 L50 90 L60 120 L50 150 L20 170 L-10 180 L-30 160 L-40 130 Z" className="dark:fill-white" />
                    <path d="M280 280 L330 260 L350 290 L340 320 L300 340 L270 320 L260 290 Z" className="dark:fill-white" />
                    <path d="M350 120 L420 100 L450 130 L440 170 L400 200 L360 180 L340 140 Z" className="dark:fill-white" />
                    <path d="M450 220 L520 200 L550 230 L530 280 L480 300 L440 270 L430 240 Z" className="dark:fill-white" />
                  </svg>

                  {/* Path */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path d="M150 150 Q300 100, 450 250" fill="none" className="stroke-emerald-600/30 dark:stroke-emerald-400/30" strokeWidth="4" strokeDasharray="8 8" />
                  </svg>

                  {/* Animated Vehicle */}
                  <motion.div
                    className="absolute z-10 p-2 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-xl shadow-lg"
                    initial={{ left: '150px', top: '150px' }}
                    animate={{ left: `${150 + (450 - 150) * progress}px`, top: `${150 + (250 - 150) * progress}px` }}
                    transition={{ duration: 2, ease: "linear" }}
                  >
                    <div className="w-4 h-3 bg-white rounded-sm" />
                  </motion.div>

                  {/* Markers */}
                  <div className="absolute top-[150px] left-[150px] w-3 h-3 bg-emerald-600 rounded-full border-2 border-white" />
                  <div className="absolute top-[250px] left-[450px] w-3 h-3 bg-sky-600 rounded-full border-2 border-white animate-pulse" />

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200"><Maximize2 size={16}/></button>
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200"><Minimize2 size={16}/></button>
                    <button onClick={handleReset} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200"><MapPin size={16}/></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Steps (placeholder) */}
            <div className="text-xs text-gray-500 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
               Status: {order.status.replace(/_/g, ' ')} | Estimasi: {ESTIMATED_DELIVERY}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}