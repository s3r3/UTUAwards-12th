"use client";

import { useEffect, useMemo, useRef } from "react";
import L, { divIcon } from "leaflet";
import type { Order } from "@/types";

import "leaflet/dist/leaflet.css";

const originIcon = divIcon({
  html: '<div class="w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-lg"></div>',
  className: "origin-marker",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destinationIcon = divIcon({
  html: '<div class="w-4 h-4 bg-sky-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
  className: "destination-marker",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const vehicleIcon = divIcon({
  html: '<div class="relative w-6 h-6 flex items-center justify-center"><div class="absolute -inset-2 bg-emerald-400/30 rounded-full blur-lg"></div><div class="relative bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div></div>',
  className: "vehicle-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface DeliveryMapInnerProps {
  order: Order;
  zoom: number;
  mapCenter: [number, number];
  startPoint: [number, number];
  destPoint: [number, number];
}

export default function DeliveryMapInner({
  order,
  zoom,
  mapCenter,
  startPoint,
  destPoint,
}: DeliveryMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    // Guard: element may carry stale _leaflet_id (Strict Mode remount
    // atau duplikat modul leaflet). Paksa bersih sebelum init.
    const elAny = el as HTMLDivElement & { _leaflet_id?: number };
    if (elAny._leaflet_id !== undefined) {
      delete elAny._leaflet_id;
    }

    const map = L.map(el, {
      center: mapCenter,
      zoom,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.polyline([startPoint, destPoint], {
      color: "#059669",
      dashArray: "10, 6",
      weight: 4,
      opacity: 0.8,
    }).addTo(map);

    L.marker(startPoint, { icon: originIcon })
      .addTo(map)
      .bindPopup("<strong>Asal:</strong> Sigli, Aceh (Acelora HQ)");

    L.marker(destPoint, { icon: destinationIcon }).addTo(map).bindPopup(
      `<strong>Tujuan:</strong> ${order.address.name}<br/>${order.address.street}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}`,
    );

    vehicleMarkerRef.current = L.marker(vehiclePosition, {
      icon: vehicleIcon,
    })
      .addTo(map)
      .bindPopup(
        `<strong>Sedang dalam perjalanan</strong><br/>Status: ${order.status.replace(/_/g, " ")}`,
      );

    map.fitBounds(L.latLngBounds([startPoint, destPoint]).pad(0.25));
    mapRef.current = map;

    return () => {
      map.remove();
      delete elAny._leaflet_id;
      mapRef.current = null;
      vehicleMarkerRef.current = null;
    };
    // Init sekali per mount — posisi diupdate lewat effect di bawah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update posisi kendaraan saat status berubah
  useEffect(() => {
    vehicleMarkerRef.current?.setLatLng(vehiclePosition);
  }, [vehiclePosition]);

  // Sinkronkan zoom dari kontrol luar
  useEffect(() => {
    mapRef.current?.setZoom(zoom);
  }, [zoom]);

  return (
    <div
      ref={containerRef}
      style={{ height: 400, width: "100%" }}
      className="z-0"
    />
  );
}
