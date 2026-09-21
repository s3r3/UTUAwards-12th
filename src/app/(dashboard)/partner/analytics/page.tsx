"use client";

import { useTranslations } from "@/lib/i18n";
import PartnerSalesChart from "@/components/partner/PartnerSalesChart";
import MetricCard from "@/components/partner/MetricCard";

export default function PartnerAnalyticsPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.analyticsOverview}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Analisis performa bisnis dan produk Anda.</p>
      </div>

      <div className="flex space-x-1 overflow-x-auto rounded-lg bg-gray-100 p-1 text-sm font-medium dark:bg-gray-800">
        <button className="whitespace-nowrap rounded-md px-3 py-2 text-emerald-600 bg-white dark:bg-gray-700 dark:text-emerald-400">{t.partnerDashboard.salesChart7Days}</button>
        <button className="whitespace-nowrap rounded-md px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">{t.partnerDashboard.salesChart30Days}</button>
        <button className="whitespace-nowrap rounded-md px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">{t.partnerDashboard.salesChart3Months}</button>
        <button className="whitespace-nowrap rounded-md px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">{t.partnerDashboard.salesChart1Year}</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard titleKey="totalRevenue" value="Rp 342.500.000" descriptionKey="vsLastPeriod" tone="emerald" />
        <MetricCard titleKey="unitsSold" value="3.540 kg" descriptionKey="vsLastPeriod" tone="ocean" />
        <MetricCard titleKey="averageOrderValue" value="Rp 1.141.666" descriptionKey="vsLastPeriod" tone="amber" />
        <MetricCard titleKey="conversionRate" value="3.2%" descriptionKey="vsLastPeriod" tone="rose" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-lg font-semibold mb-4">{t.partnerDashboard.revenueTrend}</h2>
        <PartnerSalesChart />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-serif text-lg font-semibold mb-4">{t.partnerDashboard.productPerformanceAnalytics}</h2>
          <div className="space-y-3">
            {[
              { name: "Kopi Arabika Gayo", cat: "Coffee", rev: "Rp 98.400.000", orders: 48, views: 4820 },
              { name: "Tuna Frozen", cat: "Seafood", rev: "Rp 74.200.000", orders: 24, views: 3210 },
              { name: "Minyak Nilam Aceh", cat: "Patchouli", rev: "Rp 51.000.000", orders: 18, views: 2104 },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{p.cat} • {p.rev} revenue</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">{p.orders} pesanan</p>
                  <p className="text-xs text-gray-500">{p.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-serif text-lg font-semibold mb-4">{t.partnerDashboard.customerRegions}</h2>
          <div className="space-y-3">
            {[
              { region: "Jakarta", cust: 3, rev: "Rp 246.400.000" },
              { region: "Sumatra Utara", cust: 2, rev: "Rp 118.000.000" },
              { region: "Aceh", cust: 1, rev: "Rp 43.800.000" },
            ].map((r) => (
              <div key={r.region} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-medium">{r.region}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{r.cust} pelanggan</p>
                  </div>
                </div>
                <p className="font-semibold">{r.rev}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
