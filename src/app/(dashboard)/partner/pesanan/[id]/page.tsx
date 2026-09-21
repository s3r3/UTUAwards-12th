"use client";
import React from "react"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatRupiah, partnerOrders } from "@/data/partnerDemo";

function dummyDetailFor(id: string): OrderDetail | null {
  const decoded = decodeURIComponent(id);
  const found = partnerOrders.find((o) => o.id === decoded || o.id === `#${decoded.replace(/^#/, "")}`);
  if (!found) return null;
  const qtyNum = parseInt(found.quantity, 10) || 1;
  const unit = qtyNum > 0 ? Math.round(found.total / qtyNum) : found.total;
  return {
    id: found.id.replace(/^#/, ""),
    status: found.status,
    total: found.total,
    shippingCost: 0,
    createdAt: new Date().toISOString(),
    paidAt: found.payment === "Paid" ? new Date().toISOString() : null,
    buyer: { name: found.buyer, email: `${found.buyer.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@example.id`, phone: "+62 812-0000-0000" },
    shippingAddress: {
      name: found.buyer,
      phone: "+62 812-0000-0000",
      street: "Jl. Merdeka No. 88 (data demo)",
      city: found.region,
      province: found.region,
      postalCode: "10110",
    },
    items: [
      {
        id: `${found.id}-item-1`,
        productId: found.product.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        productName: found.product,
        productImage: null,
        quantity: qtyNum,
        price: unit,
        total: found.total,
      },
    ],
    timeline: [
      { label: "Pesanan Diterima (demo)", status: "completed", time: new Date().toISOString() },
      { label: "Pembayaran Dikonfirmasi (demo)", status: found.payment === "Paid" ? "completed" : "pending", time: null },
      { label: "Diproses (demo)", status: ["Diproses", "Siap Dikirim", "Dikirim", "Selesai"].includes(found.status) ? "completed" : "pending", time: null },
      { label: "Dikirim (demo)", status: ["Dikirim", "Selesai"].includes(found.status) ? "completed" : "pending", time: null },
      { label: "Selesai (demo)", status: found.status === "Selesai" ? "completed" : "pending", time: null },
    ],
  };
}

type TimelineItem = { label: string; status: "completed" | "pending" | "current"; time: string | null };

type OrderDetail = {
  id: string;
  status: string;
  total: number;
  shippingCost: number;
  createdAt: string;
  paidAt: string | null;
  buyer: { name: string; email: string; phone: string };
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  } | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: number;
    total: number;
  }>;
  timeline: TimelineItem[];
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-5 w-5 text-gray-500" />,
  PAID: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  PROCESSING: <Package className="h-5 w-5 text-blue-500" />,
  SHIPPING: <Truck className="h-5 w-5 text-purple-500" />,
  DELIVERED: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  CANCELLED: <XCircle className="h-5 w-5 text-red-500" />,
};

export default function PartnerPesananDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/partner/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.id && data.items) {
          setOrder(data);
        } else {
          setOrder(dummyDetailFor(String(orderId)));
        }
        setLoading(false);
      })
      .catch(() => {
        setOrder(dummyDetailFor(String(orderId)));
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Pesanan tidak ditemukan.</p>
      </div>
    );
  }

  const partnerItems = order.items;
  const orderTotal = partnerItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.push("/partner/pesanan")}
      >
        <ArrowLeft size={16} className="mr-1" /> {t.partnerDashboard.back}
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.orderDetail} #{order.id}</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {order.status}
        </span>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-xl font-semibold mb-4">{t.partnerDashboard.orderTimeline}</h2>
        <div className="space-y-4">
          {order.timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                {statusIcons[order.status] || <Clock className="h-4 w-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                {item.time && <p className="text-xs text-gray-500">{new Date(item.time).toLocaleString('id-ID')}</p>}
              </div>
              <span className={`text-xs ${item.status === 'completed' ? 'text-emerald-600' : 'text-gray-400'}`}>
                {item.status === 'completed' ? t.partnerDashboard.completed : t.partnerDashboard.pending}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer & Shipping */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-serif text-xl font-semibold mb-4">{t.partnerDashboard.buyer}</h2>
          <div className="space-y-2 text-sm">
            <p className="font-medium">{order.buyer.name}</p>
            <p className="text-gray-500 dark:text-gray-400">{order.buyer.email}</p>
            <p className="text-gray-500 dark:text-gray-400">{order.buyer.phone}</p>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-serif text-xl font-semibold mb-4">{t.partnerDashboard.shippingAddress}</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{order.shippingAddress.street}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-500 dark:text-gray-400">{order.shippingAddress.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">{t.partnerDashboard.product}</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="p-4 font-semibold">{t.partnerDashboard.productName}</th>
              <th className="p-4 font-semibold text-right">{t.partnerDashboard.price}</th>
              <th className="p-4 font-semibold text-center">{t.partnerDashboard.quantity}</th>
              <th className="p-4 font-semibold text-right">{t.partnerDashboard.total}</th>
            </tr>
          </thead>
          <tbody>
            {partnerItems.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4 text-sm font-medium">{item.productName}</td>
                <td className="p-4 text-right text-sm">{formatRupiah(item.price)}</td>
                <td className="p-4 text-center text-sm">{item.quantity}</td>
                <td className="p-4 text-right text-sm font-medium">{formatRupiah(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 dark:border-gray-800">
              <td colSpan={3} className="p-4 text-right text-sm font-semibold">Subtotal</td>
              <td className="p-4 text-right text-sm font-bold">{formatRupiah(orderTotal)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="p-2 text-right text-sm">Biaya Pengiriman</td>
              <td className="p-2 text-right text-sm">{formatRupiah(order.shippingCost)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="p-4 text-right text-sm font-bold">Total</td>
              <td className="p-4 text-right text-xl font-bold text-emerald-600">{formatRupiah(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {order.status === 'PROCESSING' && (
          <Button variant="primary">{t.partnerDashboard.markReadyForShipment}</Button>
        )}
        {order.status === 'SHIPPING' && (
          <Button variant="primary">{t.partnerDashboard.inputTracking}</Button>
        )}
        <Button variant="outline">{t.partnerDashboard.addNote}</Button>
      </div>
    </div>
  );
}
