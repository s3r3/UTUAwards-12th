export default function TraceabilityTimeline() {
  const steps = [
    { title: 'Panen Raya', desc: 'Dipetik langsung oleh petani/nelayan lokal bersertifikat di Aceh', date: 'Hari ke-1', icon: '🌱' },
    { title: 'Kurasi & Kendali Mutu', desc: 'Pemeriksaan kualitas di Acelora Metuah Hub, Banda Aceh', date: 'Hari ke-2', icon: '🔍' },
    { title: 'Sertifikasi & Legalitas', desc: 'Validasi halal, BPOM, dan standar ekspor internasional', date: 'Hari ke-3', icon: '📜' },
    { title: 'Pengiriman Global', desc: 'Dikirim via kargo udara/laut ke destinasi domestik & internasional', date: 'Hari ke-5', icon: '✈️' },
  ]

  return (
    <div className="my-12 p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:print:text-black dark:text-white">
        Jejak Asal (Traceability) Produk
      </h3>
      <div className="relative border-l-2 border-primary-500 ml-4 pl-6 space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm shadow-md">
              {step.icon}
            </span>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                {step.date}
              </span>
              <h4 className="font-semibold text-gray-900 dark:text-white mt-1">{step.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}