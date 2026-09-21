"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerCustomers, formatRupiah } from "@/data/partnerDemo";
import { Search } from "lucide-react";

export default function PartnerPelangganPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.b2bCustomers}</h1>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <Search size={16} />
          <input className="w-64 bg-transparent outline-none" placeholder={t.common.searchPlaceholder} />
        </div>
      </div>

      {partnerCustomers.length === 0 ? (
        <div className="grid h-64 place-items-center rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold">{t.partnerDashboard.noOrders}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t.partnerDashboard.noOrdersDesc}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.company}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.region}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.ordersCount}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.customerRevenue}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.lastOrder}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.productsPurchased}</th>
              </tr>
            </thead>
            <tbody>
              {partnerCustomers.map((customer) => (
                <tr key={customer.company} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium">{customer.company}</td>
                  <td className="p-4 text-sm">{customer.region}</td>
                  <td className="p-4 text-sm">{customer.orders}</td>
                  <td className="p-4 text-sm font-medium">{formatRupiah(customer.revenue)}</td>
                  <td className="p-4 text-sm">{customer.lastOrder}</td>
                  <td className="p-4 text-sm">{customer.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}