"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah, partnerOrders } from "@/data/partnerDemo";
import { PackageSearch, Search } from "lucide-react";

type Order = {
  id: string;
  buyer: string;
  product: string;
  quantity: string;
  total: number;
  status: string;
  date: string;
  viewLink: string;
};

const dummyOrders: Order[] = partnerOrders.map((o) => ({
  id: o.id,
  buyer: o.buyer,
  product: o.product,
  quantity: o.quantity,
  total: o.total,
  status: o.status,
  date: o.date,
  viewLink: `/partner/pesanan/${encodeURIComponent(o.id)}`,
}));

const statusFilters = ["Semua", "Baru", "Diproses", "Siap Dikirim", "Dikirim", "Selesai", "Dibatalkan"];

function statusStyle(status: string) {
  if (status === "Baru") return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
  if (status === "Diproses") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  if (status === "Siap Dikirim") return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  if (status === "Dikirim") return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";
  if (status === "Selesai") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "Dibatalkan") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300";
}

export default function PartnerPesananPage() {
  const t = useTranslations();
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/partner/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          setIsDemo(false);
        }
      })
      .catch(() => {
        // fallback ke dummy
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        q === "" ||
        o.id.toLowerCase().includes(q) ||
        o.buyer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchStatus = status === "Semua" || o.status === status;
      return matchQuery && matchStatus;
    });
  }, [orders, query, status]);

  const needAction = orders.filter((o) => ["Baru", "Diproses", "Siap Dikirim"].includes(o.status)).length;
  const revenue = orders.filter((o) => o.status !== "Dibatalkan").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.allOrders}</h1>
            {isDemo && !loading && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Data demo
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {orders.length} pesanan • {needAction} perlu tindakan • {formatRupiah(revenue)} nilai pesanan
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">Perlu diproses</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{needAction}</p>
          <p className="mt-1 text-xs text-gray-400">Baru + Diproses + Siap Dikirim</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">Selesai</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {orders.filter((o) => o.status === "Selesai").length}
          </p>
          <p className="mt-1 text-xs text-gray-400">Pesanan terpenuhi</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">Nilai pesanan</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{formatRupiah(revenue)}</p>
          <p className="mt-1 text-xs text-gray-400">Di luar yang dibatalkan</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 sm:w-80 dark:border-gray-800 dark:text-gray-400">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
              placeholder="Cari ID, pembeli, produk..."
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : filtered.length === 0 ? (
        <div className="grid h-64 place-items-center rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <div>
            <PackageSearch className="mx-auto mb-3 text-gray-400" size={32} />
            <h3 className="text-lg font-semibold">{t.partnerDashboard.noOrders}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t.partnerDashboard.noOrdersDesc}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[820px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.orderId}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.buyer}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.product}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.quantity}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.total}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.status}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.date}</th>
                <th className="p-4 font-semibold text-right">{t.partnerDashboard.view}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <td className="p-4 text-sm font-medium">{order.id}</td>
                  <td className="p-4 text-sm">{order.buyer}</td>
                  <td className="p-4 text-sm">{order.product}</td>
                  <td className="p-4 text-sm">{order.quantity}</td>
                  <td className="p-4 text-sm font-medium">{formatRupiah(order.total)}</td>
                  <td className="p-4 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{order.date}</td>
                  <td className="p-4 text-right">
                    <Link href={order.viewLink} className="text-emerald-600 hover:underline dark:text-emerald-400">
                      {t.partnerDashboard.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
