"use client";

import { useTranslations } from "@/lib/i18n";

const faqs = [
  { q: 'Bagaimana cara memproses pesanan?', a: 'Buka halaman Pesanan, pilih pesanan yang ingin diproses, lalu klik tombol "Proses Pesanan".' },
  { q: 'Berapa lama waktu yang dibutuhkan untuk verifikasi?', a: 'Verifikasi bisnis biasanya diselesaikan dalam 2–5 hari kerja setelah dokumen dikirim.' },
  { q: 'Bagaimana cara mengelola stok produk?', a: 'Gunakan halaman Inventori untuk melihat stok, menyesuaikan ketersediaan, dan menambahkan riwayat masuk.' },
  { q: 'Kapan payout dilakukan?', a: 'Payout dilakukan secara otomatis setelah pesanan selesai dan pembelian dikonfirmasi.' },
];

export default function PartnerBantuanPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.helpCenter}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Temukan jawaban dan dapatkan bantuan.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-lg font-semibold">{t.partnerDashboard.faq}</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="font-medium">{f.q}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-lg font-semibold">{t.partnerDashboard.contactSupport}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Butuh bantuan lebih lanjut? Tim dukungan ACELORA siap membantu.</p>
        <a href="mailto:hello@acelora.com" className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          hello@acelora.com
        </a>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-lg font-semibold">{t.partnerDashboard.gettingStarted}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pelajari cara memanfaatkan fitur mitra ACELORA.</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2"><span className="text-emerald-600">1.</span> Lengkapi informasi toko di halaman Toko.</li>
          <li className="flex items-start gap-2"><span className="text-emerald-600">2.</span> Tambahkan produk pertama di halaman Produk.</li>
          <li className="flex items-start gap-2"><span className="text-emerald-600">3.</span> Pantau pesanan di halaman Pesanan.</li>
          <li className="flex items-start gap-2"><span className="text-emerald-600">4.</span> Gunakan Marketing & Analytics untuk tumbuh.</li>
        </ul>
      </div>
    </div>
  );
}
