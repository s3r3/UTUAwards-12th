"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Maximize2,
  Minimize2,
  Truck,
} from "lucide-react";
import type { Order } from "@/types";

import "leaflet/dist/leaflet.css";

// Leaflet hanya dijalankan di browser.
// Ini penting untuk Next.js agar MapContainer tidak dibuat saat SSR.
import DeliveryMapInner from "./DeliveryMapInner";

interface RealDeliveryTrackerProps {
  order: Order;
}

const cityCoords: Record<string, [number, number]> = {
  Sigli: [5.3789, 95.9632],
  "Banda Aceh": [5.5483, 95.3247],
  "Aceh Besar": [5.3554, 95.4856],
  "Aceh Selatan": [3.6986, 97.4486],
  "Aceh Tengah": [4.5977, 96.8354],
  "Aceh Timur": [4.7523, 97.4386],
  "Aceh Jaya": [4.8606, 95.6354],
  "Aceh Barat": [4.3827, 95.2856],
  Lhokseumawe: [5.18, 97.15],
  Langsa: [4.4761, 97.9694],
  Sabang: [5.8244, 95.3247],
  Meulaboh: [4.1316, 96.1189],
  Takengon: [4.6157, 96.8317],
  Medan: [3.5952, 98.6722],
};

const getProgress = (status: Order["status"]) => {
  const progressMap: Partial<Record<Order["status"], number>> = {
    PENDING: 0.05,
    PAID: 0.1,
    PROCESSING: 0.25,
    SHIPPING: 0.6,
    DELIVERED: 1,
    CANCELLED: 0,
  };

  return progressMap[status] ?? 0;
};

export default function RealDeliveryTracker({
  order,
}: RealDeliveryTrackerProps) {
  const [showTracking, setShowTracking] = useState(false);

  const [zoom, setZoom] = useState(6);

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    5.3789,
    95.9632,
  ]);

  // Dibuat stabil berdasarkan city order.
  const { startPoint, destPoint } = useMemo(() => {
    const start = cityCoords.Sigli;

    const destination =
      cityCoords[order.address.city] ?? start;

    return {
      startPoint: start,
      destPoint: destination,
    };
  }, [order.address.city]);

  const progress = useMemo(
    () => getProgress(order.status),
    [order.status]
  );

  const handleZoomIn = () => {
    setZoom((currentZoom) => Math.min(18, currentZoom + 1));
  };

  const handleZoomOut = () => {
    setZoom((currentZoom) => Math.max(3, currentZoom - 1));
  };

  const handleReset = () => {
    setZoom(6);
    setMapCenter([5.3789, 95.9632]);
  };

  const toggleTracking = () => {
    setShowTracking((current) => !current);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={toggleTracking}
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-black transition-colors"
      >
        <Truck
          size={16}
          className="text-emerald-600"
        />

        Tracking Pengiriman

        <ChevronDown
          size={14}
          className={`transition-transform ${
            showTracking ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`relative my-6 border border-black/15 dark:border-gray-700 rounded-xl overflow-hidden bg-stone-100 dark:bg-gray-900 transition-all duration-300 ${
          showTracking ? "block" : "h-0 invisible"
        }`}
      >
        <DeliveryMapInner
          order={order}
          zoom={zoom}
          mapCenter={mapCenter}
          startPoint={startPoint}
          destPoint={destPoint}
        />

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Zoom in"
          >
            <Maximize2 size={16} />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Zoom out"
          >
            <Minimize2 size={16} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Reset view"
          >
            <MapPin size={16} />
          </button>
        </div>

        {/* Status Summary */}
        <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-lg max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                progress >= 1
                  ? "bg-emerald-600"
                  : progress >= 0.6
                    ? "bg-purple-600"
                    : progress >= 0.25
                      ? "bg-blue-600"
                      : "bg-amber-600"
              } animate-pulse`}
            />

            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Status: {order.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
            <motion.div
              className="h-2 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${progress * 100}%`,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            />
          </div>

          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            Progress: {Math.round(progress * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
