"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerStore } from "@/data/partnerDemo";

const steps = [
  { key: 'verificationPartnerRegistered', status: 'completed' },
  { key: 'verificationBusinessVerified', status: 'completed' },
  { key: 'verificationStoreApproved', status: 'current' },
  { key: 'verificationIdentityVerified', status: 'pending' },
  { key: 'verificationCertificationReview', status: 'pending' },
];

const statusDot: Record<string, string> = {
  completed: 'bg-emerald-500',
  current: 'bg-blue-500',
  pending: 'bg-gray-300 dark:bg-gray-600',
};

export default function PartnerVerifikasiPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.businessVerification}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Lihat progres verifikasi bisnis toko Anda.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <div>
            <p className="font-semibold">{partnerStore.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{partnerStore.status}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.key} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className={`h-3 w-3 rounded-full ${statusDot[s.status]}`} />
            <p className="font-medium">{t.partnerDashboard[s.key as keyof typeof t.partnerDashboard] as string}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-lg font-semibold mb-4">{t.partnerDashboard.missingDocuments}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada dokumen yang masih hilang.</p>
      </div>
    </div>
  );
}
