"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerPayouts, formatRupiah } from "@/data/partnerDemo";

export default function PartnerKeuanganPage() {
  const t = useTranslations();

  const totalPaid = partnerPayouts.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = partnerPayouts.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.payments}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Pantau penihan dan riwayat payout toko Anda.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.totalSalesFinance}</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{formatRupiah(totalPaid)}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.partnerDashboard.paid}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500">{t.partnerDashboard.pending}</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{formatRupiah(totalPending)}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Menunggu diproses</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <h2 className="border-b border-gray-200 p-4 text-lg font-semibold dark:border-gray-800">{t.partnerDashboard.payoutHistory}</h2>
        <table className="w-full min-w-[500px] table-auto">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="p-4 font-semibold">ID Payout</th>
              <th className="p-4 font-semibold">{t.partnerDashboard.total}</th>
              <th className="p-4 font-semibold">{t.partnerDashboard.status}</th>
              <th className="p-4 font-semibold">{t.partnerDashboard.date}</th>
            </tr>
          </thead>
          <tbody>
            {partnerPayouts.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4 text-sm font-medium">{p.id}</td>
                <td className="p-4 text-sm font-medium">{formatRupiah(p.amount)}</td>
                <td className="p-4 text-sm">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-sm">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
