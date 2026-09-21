"use client";

import { useTranslations } from "@/lib/i18n";
import { partnerStore } from "@/data/partnerDemo";
import Button from "@/components/ui/Button";

export default function PartnerTokoPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.store}</h1>
        <Button variant="primary">{t.partnerDashboard.editStore}</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Store Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="font-serif text-xl font-semibold">{t.partnerDashboard.businessInformation}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">{t.partnerDashboard.storeName}</dt>
              <dd className="font-medium">{partnerStore.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">{t.partnerDashboard.category}</dt>
              <dd className="font-medium">{partnerStore.category}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-gray-500">{t.partnerDashboard.storeDescription}</dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">{partnerStore.description}</dd>
            </div>
          </dl>
        </div>

        {/* Verification Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-serif text-xl font-semibold">{t.partnerDashboard.verification}</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span className="text-lg">✓</span>
              <span>{t.partnerDashboard.verificationPartnerRegistered}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span className="text-lg">✓</span>
              <span>{t.partnerDashboard.verificationBusinessVerified}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
