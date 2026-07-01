import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Target, Eye, Anchor, Sprout, Globe, Users } from 'lucide-react'

const values = [
  { icon: Sprout, title: 'Keberlanjutan', desc: 'Mendorong praktik agro-maritim yang ramah lingkungan dan berkelanjutan.' },
  { icon: Globe, title: 'Konektivitas Global', desc: 'Menghubungkan UMKM Aceh dengan pasar internasional melalui teknologi.' },
  { icon: Users, title: 'Pemberdayaan', desc: 'Meningkatkan kapasitas pelaku usaha melalui mentoring dan pelatihan.' },
  { icon: Anchor, title: 'Kearifan Lokal', desc: 'Menggabungkan tradisi agro-maritim Aceh dengan inovasi modern.' },
]

const milestones = [
  { year: '2024', event: 'Riset & Validasi Konsep Metuah Hub' },
  { year: '2025', event: 'Pengembangan Platform MVP & Pilot Program' },
  { year: '2026', event: 'Peluncuran Platform & The 12th UTU Awards' },
  { year: '2027', event: 'Ekspansi Mitra Internasional Asia-Eropa' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Tentang <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">Metuah Hub</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Metuah Hub adalah platform digital ekosistem agro-maritim Aceh yang mentransformasi komoditas
            lokal menjadi pemain utama rantai pasok global melalui integrasi teknologi, mentoring, dan
            kemitraan internasional.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Target className="mr-2" size={16} /> Misi Kami
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Memperkuat Ekosistem Agro-Maritim Aceh
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Kami percaya bahwa kekayaan agro-maritim Aceh — mulai dari Kopi Gayo, Nilam Aceh,
              hingga hasil laut premium — memiliki potensi luar biasa untuk bersaing di kancah global.
              Metuah Hub hadir sebagai jembatan antara pelaku usaha lokal dengan pasar dunia.
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">✓</span> Digitalisasi rantai pasok komoditas Aceh</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">✓</span> Pendampingan sertifikasi halal, HACCP & ekspor</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">✓</span> Koneksi langsung ke buyer internasional</li>
            </ul>
          </div>
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 text-ocean-700 text-sm font-medium mb-4">
              <Eye className="mr-2" size={16} /> Visi Kami
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Aceh Sebagai Hub Agro-Maritim Global
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pada tahun 2030, kami membayangkan Aceh menjadi pusat agro-maritim terkemuka di
              Asia Tenggara — dengan produk-produk berkualitas dunia, UMKM yang berdaya saing,
              dan ekosistem digital yang terintegrasi dari hulu ke hilir. Metuah Hub akan menjadi
              platform utama yang mengorkestrasi ekosistem ini.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 text-white">
                  <v.icon size={28} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Roadmap</h2>
          <div className="relative border-l-2 border-primary-300 dark:border-primary-700 ml-4">
            {milestones.map((m, i) => (
              <div key={i} className="mb-8 ml-8 relative">
                <div className="absolute -left-[2.6rem] top-1 w-5 h-5 rounded-full gradient-primary border-4 border-white dark:border-gray-900" />
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{m.year}</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
