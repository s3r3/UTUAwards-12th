"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerProducts } from "@/data/partnerDemo";
import { Search } from "lucide-react";

export default function PartnerInventoriPage() {
  const t = useTranslations();

  const totalStock = partnerProducts.reduce((acc, p) => acc + p.stock, 0);
  const outOfStock = partnerProducts.filter(p => p.stock === 0).length;
  const lowStock = partnerProducts.filter(p => p.stock > 0 && p.stock < p.moq / 2).length;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.inventory}</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.totalStock}</p>
          <p className="mt-1 text-3xl font-bold">{totalStock.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.outOfStock}</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{outOfStock}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.lowStock}</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{lowStock}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.capacity}</p>
          <p className="mt-1 text-3xl font-bold">{partnerProducts.reduce((acc, p) => acc + p.capacity, 0).toLocaleString()} kg</p>
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
            <h3 className="text-lg font-semibold">{t.partnerDashboard.noInventory}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t.partnerDashboard.noInventoryDesc}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.productName}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.currentStock}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.minimum}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.capacity}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.committed}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.adjustStock}</th>
              </tr>
            </thead>
            <tbody>
              {partnerProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium">{product.name}</td>
                  <td className="p-4 text-sm">{product.stock} kg</td>
                  <td className="p-4 text-sm">{product.moq} kg</td>
                  <td className="p-4 text-sm">{product.capacity} kg</td>
                  <td className="p-4 text-sm">{product.committed} kg</td>
                  <td className="p-4 text-right">
                    <button className="text-emerald-600 hover:underline dark:text-emerald-400 text-sm">
                      {t.partnerDashboard.adjustStock}
                    </button>
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