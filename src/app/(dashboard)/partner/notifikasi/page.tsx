"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerNotifications } from "@/data/partnerDemo";

const categoryColors: Record<string, string> = {
  Orders: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Products: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  Inventory: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Marketing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  System: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300',
};

export default function PartnerNotifikasiPage() {
  const t = useTranslations();
  const tabs = [
    { id: 'all', label: t.partnerDashboard.allNotifications },
    { id: 'Orders', label: t.partnerDashboard.ordersNotifications },
    { id: 'Products', label: t.partnerDashboard.productsNotifications },
    { id: 'Inventory', label: t.partnerDashboard.inventoryNotifications },
    { id: 'Marketing', label: t.partnerDashboard.marketingNotifications },
    { id: 'System', label: t.partnerDashboard.systemNotifications },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.notifications}</h1>
        <button className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">{t.partnerDashboard.markAllAsRead}</button>
      </div>

      <div className="flex space-x-1 overflow-x-auto rounded-lg bg-gray-100 p-1 text-xs font-medium dark:bg-gray-800">
        {tabs.map((tab) => (
          <button key={tab.id} className="whitespace-nowrap rounded-md px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {partnerNotifications.map((n, i) => (
          <div key={i} className={`flex items-start gap-4 border-b border-gray-100 p-4 dark:border-gray-800 ${n.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
            <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${categoryColors[n.category] || categoryColors.System}`}>
              {n.category}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{n.title}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{n.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
              {n.unread && (
                <button className="mt-2 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400">{t.partnerDashboard.markAsRead}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
