"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, Maximize2, Minimize2, Truck } from "lucide-react";
import L, { divIcon, type DivIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import type { Order } from "@/types";

import "leaflet/dist/leaflet.css";

// Helper component to auto-fit bounds safely via hook
function MapBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds.pad(0.25));
  }, [map, bounds]);
  return null;
}

interface RealDeliveryTrackerProps {
  order: Order;
}

// Create custom icons once (outside component for memoization)
const originIcon: DivIcon = divIcon({
  html: '<div class="w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-lg"></div>',
  className: "origin-marker",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destinationIcon: DivIcon = divIcon({
  html: '<div class="w-4 h-4 bg-sky-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
  className: "destination-marker",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const createVehicleIcon = () =>
  divIcon({
    html: '<div class="relative w-6 h-6 flex items-center justify-center"><div class="absolute -inset-2 bg-emerald-400/30 rounded-full blur-lg"></div><div class="relative bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div></div>',
    className: "vehicle-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const vehicleIcon: DivIcon = createVehicleIcon();

// Coordinate lookup per city (Aceh region focus)
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

// Inner map component — separate so key forces clean unmount/remount
function DeliveryMap({
  order,
  zoom,
  mapCenter,
}: {
  order: Order;
  zoom: number;
  mapCenter: [number, number];
}) {
  const destPoint: [number, number] =
    cityCoords[order.address.city] || startPoint;

  const progress = useMemo(
    () =>
      ({
        PENDING: 0.05,
        PAID: 0.1,
        PROCESSING: 0.25,
        SHIPPING: 0.6,
        DELIVERED: 1,
        CANCELLED: 0,
      })[order.status] || 0,
    [order.status],
  );

  const vehiclePosition: [number, number] = [
    startPoint[0] + (destPoint[0] - startPoint[0]) * progress,
    startPoint[1] + (destPoint[1] - startPoint[1]) * progress,
  ];

  const bounds = useMemo(
    () => L.latLngBounds([startPoint, destPoint]),
    [startPoint, destPoint],
  );

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
      className="z-0"
      scrollWheelZoom={false}
    >
      <MapBounds bounds={bounds} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={[startPoint, destPoint]}
        color="#059669"
        dashArray="10, 6"
        weight={4}
        opacity={0.8}
      />
      <Marker position={startPoint} icon={originIcon}>
        <Popup>
          <strong className="text-emerald-700">Asal:</strong> Sigli, Aceh
          (Acelora HQ)
        </Popup>
      </Marker>
      <Marker position={destPoint} icon={destinationIcon}>
        <Popup>
          <strong className="text-sky-700">Tujuan:</strong> {order.address.name}
          <br />
          {order.address.street}, {order.address.city}, {order.address.province}{" "}
          {order.address.postalCode}
        </Popup>
      </Marker>
      <Marker position={vehiclePosition} icon={vehicleIcon}>
        <Popup>
          <strong className="text-amber-700">Sedang dalam perjalanan</strong>
          <br />
          Status: {order.status.replace(/_/g, " ")}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default function RealDeliveryTracker({
  order,
}: RealDeliveryTrackerProps) {
  const [showTracking, setShowTracking] = useState(false);
  const [zoom, setZoom] = useState(6);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    5.3789, 95.9632,
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // delay mount so leaflet client-side is happy
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const progress = useMemo(
    () =>
      ({
        PENDING: 0.05,
        PAID: 0.1,
        PROCESSING: 0.25,
        SHIPPING: 0.6,
        DELIVERED: 1,
        CANCELLED: 0,
      })[order.status] || 0,
    [order.status],
  );

  const handleZoomIn = () => setZoom((z) => Math.min(18, z + 1));
  const handleZoomOut = () => setZoom((z) => Math.max(3, z - 1));
  const handleReset = () => {
    setZoom(6);
    setMapCenter([5.3789, 95.9632]);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setShowTracking(!showTracking)}
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-black transition-colors"
      >
        <Truck size={16} className="text-emerald-600" />
        Tracking Pengiriman
        <ChevronDown
          size={14}
          className={`transition-transform ${showTracking ? "rotate-180" : ""}`}
        />
      </button>

      {showTracking && mounted && (
        <div className="relative my-6 border border-black/15 dark:border-gray-700 rounded-xl overflow-hidden bg-stone-100 dark:bg-gray-900">
          {/* key forces fresh DOM node + fresh Leaflet instance every toggle */}
          <DeliveryMap
            key={`map-${order.id}`}
            order={order}
            zoom={zoom}
            mapCenter={mapCenter}
          />

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Zoom in"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Zoom out"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Reset view"
            >
              <MapPin size={16} />
            </button>
          </div>

          {/* Status summary */}
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
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              Progress: {Math.round(progress * 100)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
