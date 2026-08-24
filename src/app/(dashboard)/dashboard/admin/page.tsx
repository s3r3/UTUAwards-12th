'use client';

import Link from 'next/link';
import { Package, ShoppingBag, Users, Shield } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useUIStore } from '@/store/ui.store';

// ponytail: dummy data until real payments API exists
const dummyPayments = [
  { id: 'pay_001', user: 'Alice Smith', amount: 150.0, method: 'Credit Card', status: 'completed', timestamp: new Date('2026-08-20T10:00:00Z') },
  { id: 'pay_002', user: 'Bob Johnson', amount: 75.5, method: 'PayPal', status: 'pending', timestamp: new Date('2026-08-21T11:30:00Z') },
  { id: 'pay_003', user: 'Charlie Brown', amount: 200.0, method: 'Stripe', status: 'completed', timestamp: new Date('2026-08-22T14:00:00Z') },
  { id: 'pay_004', user: 'Diana Prince', amount: 50.0, method: 'Credit Card', status: 'failed', timestamp: new Date('2026-08-23T09:00:00Z') },
  { id: 'pay_005', user: 'Ethan Hunt', amount: 120.75, method: 'PayPal', status: 'completed', timestamp: new Date('2026-08-24T16:00:00Z') },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

function PaymentList({ payments }: { payments: typeof dummyPayments }) {
  const t = useTranslations();
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white text-gray-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-semibold">
            <th className="p-4">ID</th>
            <th className="p-4">{t.dashboard.owner}</th>
            <th className="p-4">{t.dashboard.orderTotal}</th>
            <th className="p-4">Method</th>
            <th className="p-4">{t.dashboard.orderStatus}</th>
            <th className="p-4">{t.dashboard.date}</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-4 font-mono text-xs">{p.id}</td>
              <td className="p-4">{p.user}</td>
              <td className="p-4">{t.common.currency} {p.amount.toFixed(2)}</td>
              <td className="p-4">{p.method}</td>
              <td className="p-4">
                <span className={`rounded-full px-2 py-1 text-xs ${statusStyles[p.status] ?? ''}`}>{p.status}</span>
              </td>
              <td className="p-4">{p.timestamp.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardPage() {
  const t = useTranslations();
  const items = [
    { href: '/dashboard/admin/orders', label: t.dashboard.adminOrders, icon: ShoppingBag },
    { href: '/dashboard/admin/products', label: t.dashboard.adminProducts, icon: Package },
    { href: '/dashboard/admin/users', label: t.dashboard.adminUsers, icon: Users },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8 flex items-center">
        <h1 className="text-2xl font-bold">
          <Shield size={24} className="mr-2 inline-block" /> {t.dashboard.adminPanel}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-4 rounded-2xl border p-4 transition-shadow duration-200 hover:shadow-md">
            <div className="rounded-xl bg-primary-100 p-3 text-primary-600"><item.icon size={24} /></div>
            <p className="font-semibold">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <PaymentList payments={dummyPayments} />
      </div>
    </div>
  );
}
