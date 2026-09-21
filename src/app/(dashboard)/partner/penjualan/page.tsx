"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerProducts } from "@/data/partnerDemo";
import { formatRupiah } from "@/data/partnerDemo";
import { Search } from "lucide-react";

export default function PartnerPenjualanPage() {
  const t = useTranslations();

  const totalRevenue = partnerProducts.reduce((acc, p) => acc + p.revenue, 0);
  const totalUnitsSold = partnerProducts.reduce((acc, p) => acc + parseInt(p.sold.replace(/[^0-9]/g, "")), 0);
  const avgOrderValue = totalUnitsSold > 0 ? totalRevenue / totalUnitsSold : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.totalRevenue}</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.totalRevenue}</p>
          <p className="mt-1 text-3xl font-bold">{formatRupiah(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.unitsSold}</p>
          <p className="mt-1 text-3xl font-bold">{totalUnitsSold.toLocaleString()} kg</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.averageOrderValue}</p>
          <p className="mt-1 text-3xl font-bold">{formatRupiah(avgOrderValue)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <Search size={16} />
          <input className="w-64 bg-transparent outline-none" placeholder={t.partnerDashboard.searchProducts} />
        </div>
      </div>

      {partnerProducts.length === 0 ? (
        <div className="grid h-64 place-items-center rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold">{t.partnerDashboard.noProducts}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t.partnerDashboard.addProductDesc}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.productName}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.category}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.unitsSold}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.totalRevenue}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.views}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.ordersCount}</th>
              </tr>
            </thead>
            <tbody>
              {partnerProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium">{product.name}</td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4 text-sm">{product.sold}</td>
                  <td className="p-4 text-sm font-medium">{formatRupiah(product.revenue)}</td>
                  <td className="p-4 text-sm">{product.views.toLocaleString()}</td>
                  <td className="p-4 text-sm">{product.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}