"use client";
import React from "react"

import { useTranslations } from "@/lib/i18n";
import { partnerOrders } from "@/data/partnerDemo";
import { formatRupiah } from "@/data/partnerDemo";
import { Package, Truck, CheckCircle, ClipboardList } from "lucide-react";

type FulfillmentOrder = {
  id: string;
  buyer: string;
  product: string;
  quantity: string;
  total: number;
  status: string;
  date: string;
};

export default function PartnerFulfillmentPage() {
  const t = useTranslations();

  const processingOrders = partnerOrders.filter(o => o.status === 'Diproses');
  const readyToShipOrders = partnerOrders.filter(o => o.status === 'Siap Dikirim');
  const shippedOrders = partnerOrders.filter(o => o.status === 'Dikirim');

  const statusIcons: Record<string, React.ReactNode> = {
    Diproses: <ClipboardList className="h-5 w-5 text-blue-500" />,
    'Siap Dikirim': <Package className="h-5 w-5 text-orange-500" />,
    Dikirim: <Truck className="h-5 w-5 text-purple-500" />,
    Selesai: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">Fulfillment</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.processingOrders}</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{processingOrders.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.readyToShipOrders}</p>
          <p className="mt-1 text-3xl font-bold text-orange-600">{readyToShipOrders.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.shippedOrders}</p>
          <p className="mt-1 text-3xl font-bold text-purple-600">{shippedOrders.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">{t.partnerDashboard.processingOrders}</h2>
        {processingOrders.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Tidak ada pesanan yang perlu diproses.</p>
        ) : (
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.orderId}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.orderBuyer}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.orderProduct}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.orderQty}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.total}</th>
                <th className="p-4 font-semibold text-right">{t.partnerDashboard.processOrder}</th>
              </tr>
            </thead>
            <tbody>
              {processingOrders.map((order: FulfillmentOrder) => (
                <tr key={order.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium">{order.id}</td>
                  <td className="p-4 text-sm">{order.buyer}</td>
                  <td className="p-4 text-sm">{order.product}</td>
                  <td className="p-4 text-sm">{order.quantity}</td>
                  <td className="p-4 text-sm font-medium">{formatRupiah(order.total)}</td>
                  <td className="p-4 text-right">
                    <button className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700">
                      {t.partnerDashboard.processOrder}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">{t.partnerDashboard.readyToShipOrders}</h2>
        {readyToShipOrders.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Tidak ada pesanan yang siap dikirim.</p>
        ) : (
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.orderId}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.orderBuyer}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.orderProduct}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.total}</th>
                <th className="p-4 font-semibold text-right">{t.partnerDashboard.markReadyForShipment}</th>
              </tr>
            </thead>
            <tbody>
              {readyToShipOrders.map((order: FulfillmentOrder) => (
                <tr key={order.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium">{order.id}</td>
                  <td className="p-4 text-sm">{order.buyer}</td>
                  <td className="p-4 text-sm">{order.product}</td>
                  <td className="p-4 text-sm font-medium">{formatRupiah(order.total)}</td>
                  <td className="p-4 text-right">
                    <button className="rounded-lg bg-purple-600 px-3 py-1 text-sm font-medium text-white hover:bg-purple-700">
                      {t.partnerDashboard.inputTracking}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">{t.partnerDashboard.shippedOrders}</h2>
        {shippedOrders.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Tidak ada pesanan dalam pengiriman.</p>
        ) : (
          <div className="p-4">
            <div className="space-y-3">
              {shippedOrders.map((order: FulfillmentOrder) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    {statusIcons[order.status] || <Package className="h-5 w-5" />}
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.buyer} • {order.date}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sedang dalam pengiriman</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}