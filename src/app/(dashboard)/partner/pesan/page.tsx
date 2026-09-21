"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerMessages } from "@/data/partnerDemo";

export default function PartnerPesanPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.messages}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Balas percakapan dengan pembeli B2B.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {partnerMessages.map((m, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
            <div className="min-w-0 flex-1 pr-4">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold">{m.buyer}</p>
                <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{m.time}</span>
              </div>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                {t.partnerDashboard.regardingOrder}: {m.subject}
              </p>
              <p className="truncate text-sm text-gray-600 dark:text-gray-300">{m.preview}</p>
            </div>
            <button className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">{t.common.sendButton}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
