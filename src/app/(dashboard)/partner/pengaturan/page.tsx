"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerStore } from "@/data/partnerDemo";

const items = [
  { key: 'account' },
  { key: 'owner' },
  { key: 'password' },
  { key: 'business' },
  { key: 'store' },
  { key: 'notifications' },
  { key: 'security' },
  { key: 'logout' },
];

export default function PartnerPengaturanPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.account}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Kelola akun dan preferensi toko Anda.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {items.map((item, i) => (
          <button key={item.key} className={`flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
            <span className="font-medium">{t.partnerDashboard[item.key as keyof typeof t.partnerDashboard] as string}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-lg font-semibold mb-4">{t.partnerDashboard.owner}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">{t.partnerDashboard.ownerName}</p>
            <p className="mt-1 font-medium">{partnerStore.owner}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">{t.partnerDashboard.storeEmail}</p>
            <p className="mt-1 font-medium">{partnerStore.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">{t.partnerDashboard.storePhone}</p>
            <p className="mt-1 font-medium">{partnerStore.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">{t.partnerDashboard.storeWebsite}</p>
            <p className="mt-1 font-medium">{partnerStore.website}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
