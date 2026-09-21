"use client";

import { useTranslations } from "@/lib/i18n";
import {
  formatRupiah,
  partnerBundles,
  partnerCampaigns,
  partnerProducts,
  partnerPromos,
  partnerVouchers,
} from "@/data/partnerDemo";
import { BadgePercent, Gift, Megaphone, PackagePlus, Plus } from "lucide-react";

export default function PartnerMarketingPage() {
  const t = useTranslations();

  const totalViews = partnerCampaigns.reduce((s, c) => s + c.views, 0);
  const totalCampaignOrders = partnerCampaigns.reduce((s, c) => s + c.orders, 0);
  const totalCampaignRevenue = partnerCampaigns.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.campaigns}</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              Data demo
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola kampanye, promosi, diskon grosir, voucher, dan bundel.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus size={16} /> {t.partnerDashboard.createCampaign}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Megaphone size={16} className="text-blue-600" /> {t.partnerDashboard.campaigns}
          </div>
          <p className="mt-1 text-3xl font-bold text-blue-600">{partnerCampaigns.length}</p>
          <p className="mt-1 text-xs text-gray-400">{totalViews.toLocaleString("id-ID")} views kampanye</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <BadgePercent size={16} className="text-orange-600" /> {t.partnerDashboard.promotions}
          </div>
          <p className="mt-1 text-3xl font-bold text-orange-600">{partnerPromos.length}</p>
          <p className="mt-1 text-xs text-gray-400">{totalCampaignOrders} order dari kampanye</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Gift size={16} className="text-emerald-600" /> Voucher aktif
          </div>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{partnerVouchers.length}</p>
          <p className="mt-1 text-xs text-gray-400">{formatRupiah(totalCampaignRevenue)} revenue kampanye</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <PackagePlus size={16} className="text-purple-600" /> {t.partnerDashboard.bundles}
          </div>
          <p className="mt-1 text-3xl font-bold text-purple-600">{partnerBundles.length}</p>
          <p className="mt-1 text-xs text-gray-400">
            {partnerBundles.reduce((s, b) => s + b.sold, 0)} bundel terjual
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">
          Kampanye ({partnerCampaigns.length})
        </h2>
        <table className="w-full min-w-[760px] table-auto">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="p-4 font-semibold">Kampanye</th>
              <th className="p-4 font-semibold">Tipe</th>
              <th className="p-4 font-semibold">Promo</th>
              <th className="p-4 font-semibold">Periode</th>
              <th className="p-4 font-semibold">Views / Order</th>
              <th className="p-4 font-semibold">Revenue</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {partnerCampaigns.map((c) => (
              <tr key={c.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.id} • {c.products} produk</p>
                </td>
                <td className="p-4 text-sm">{c.type}</td>
                <td className="p-4 text-sm">{c.discount}</td>
                <td className="p-4 text-sm text-gray-500">{c.period}</td>
                <td className="p-4 text-sm">
                  {c.views.toLocaleString("id-ID")} / {c.orders}
                </td>
                <td className="p-4 text-sm font-medium">{formatRupiah(c.revenue)}</td>
                <td className="p-4 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === "Berjalan"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : c.status === "Terjadwal"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">
            Promosi Grosir ({partnerPromos.length})
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {partnerPromos.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="mt-1 text-sm text-gray-500">{p.detail}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {p.usage} • {p.period}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "Aktif"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">
            Voucher ({partnerVouchers.length})
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {partnerVouchers.map((v) => (
              <div key={v.code} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-sm font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
                    {v.code}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{v.desc}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {v.quota} • s/d {v.expiry}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    v.status === "Hampir habis"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                  }`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">
          Bundel Hemat ({partnerBundles.length})
        </h2>
        <table className="w-full min-w-[680px] table-auto">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="p-4 font-semibold">Bundel</th>
              <th className="p-4 font-semibold">Isi</th>
              <th className="p-4 font-semibold">Harga</th>
              <th className="p-4 font-semibold">Terjual</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {partnerBundles.map((b) => (
              <tr key={b.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4 text-sm font-medium">{b.name}</td>
                <td className="p-4 text-sm text-gray-500">{b.items}</td>
                <td className="p-4 text-sm">
                  <span className="font-medium">{formatRupiah(b.price)}</span>{" "}
                  <span className="text-xs text-gray-400 line-through">{formatRupiah(b.normalPrice)}</span>
                </td>
                <td className="p-4 text-sm">{b.sold}</td>
                <td className="p-4 text-sm">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">
          {t.partnerDashboard.featuredProducts}
        </h2>
        <table className="w-full min-w-[600px] table-auto">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="p-4 font-semibold">{t.partnerDashboard.product}</th>
              <th className="p-4 font-semibold">{t.partnerDashboard.views}</th>
              <th className="p-4 font-semibold">Orders</th>
              <th className="p-4 font-semibold text-right">{t.partnerDashboard.view}</th>
            </tr>
          </thead>
          <tbody>
            {partnerProducts.slice(0, 4).map((p) => (
              <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4 text-sm font-medium">{p.name}</td>
                <td className="p-4 text-sm">{p.views.toLocaleString("id-ID")}</td>
                <td className="p-4 text-sm">{p.orders}</td>
                <td className="p-4 text-right">
                  <button className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                    {t.partnerDashboard.editProduct}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
