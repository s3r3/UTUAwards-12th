"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n";
import { partnerActions, partnerOrders, partnerProducts, formatRupiah } from "@/data/partnerDemo"; // Assuming these are available
import MetricCard from "@/components/partner/MetricCard";
import PartnerSalesChart from "@/components/partner/PartnerSalesChart";
import { ArrowRight } from "lucide-react";

export default function PartnerDashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations();

  const totalSalesValue = partnerOrders.reduce((acc, order) => acc + order.total, 0);
  const activeOrdersCount = partnerOrders.filter(order => order.status !== 'Selesai' && order.status !== 'Dibatalkan').length;
  const activeProductsCount = partnerProducts.filter(product => product.status === 'Active').length;
  const lowStockProductsCount = partnerProducts.filter(product => product.stock <= product.moq / 2 && product.stock > 0).length; // Example logic for low stock

  return (
    <div className="space-y-8">
      {/* Welcome & Action Required */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-2xl font-semibold">
          {t.partnerDashboard.welcome} {session?.user?.name?.split(' ')[0]}!
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {t.partnerDashboard.welcomeSubtitle}
        </p>

        {partnerActions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {t.partnerDashboard.actionCenter}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {partnerActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className={`flex items-center justify-between rounded-lg p-4 transition-colors ${action.tone === 'amber' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30' :
                    action.tone === 'rose' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30' :
                    action.tone === 'ocean' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30' :
                    'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30'
                  }`}
                >
                  <p className="text-sm font-medium">{action.label}</p>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          titleKey="totalSales"
          value={formatRupiah(totalSalesValue)}
          descriptionKey="totalRevenue"
          tone="emerald"
        />
        <MetricCard
          titleKey="activeOrders"
          value={activeOrdersCount.toString()}
          descriptionKey="processingOrders"
          tone="ocean"
        />
        <MetricCard
          titleKey="activeProducts"
          value={activeProductsCount.toString()}
          descriptionKey="active"
          tone="emerald"
        />
        <MetricCard
          titleKey="lowStock"
          value={lowStockProductsCount.toString()}
          descriptionKey="lowStock"
          tone="rose"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <PartnerSalesChart />
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-serif text-lg font-semibold">{t.partnerDashboard.topProducts}</h3>
          <ul className="mt-4 space-y-3">
            {partnerProducts
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((product) => (
                <li key={product.id} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatRupiah(product.revenue)}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">{t.partnerDashboard.recentOrders}</h3>
          <Link href="/partner/pesanan" className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">
            {t.partnerDashboard.viewAll}
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.orderId}</th>
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.buyer}</th>
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.product}</th>
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.quantity}</th>
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.total}</th>
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.status}</th>
                <th className="py-2 pr-3 font-semibold">{t.partnerDashboard.date}</th>
                <th className="py-2 pl-3 font-semibold text-right">{t.partnerDashboard.view}</th>
              </tr>
            </thead>
            <tbody>
              {partnerOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-3 pr-3 text-sm font-medium">{order.id}</td>
                  <td className="py-3 pr-3 text-sm">{order.buyer}</td>
                  <td className="py-3 pr-3 text-sm">{order.product}</td>
                  <td className="py-3 pr-3 text-sm">{order.quantity}</td>
                  <td className="py-3 pr-3 text-sm font-medium">{formatRupiah(order.total)}</td>
                  <td className="py-3 pr-3 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === 'Diproses' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      order.status === 'Siap Dikirim' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      order.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-sm">{order.date}</td>
                  <td className="py-3 pl-3 text-right">
                    <Link href={`/partner/pesanan/${order.id.replace('#', '')}`} className="text-emerald-600 hover:underline dark:text-emerald-400">
                      {t.partnerDashboard.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}