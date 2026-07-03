'use client'

import { useTranslations } from "@/lib/i18n"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Linkedin, Twitter, Mail } from 'lucide-react'

const team = [
  { name: 'Muhammad Farid', role: 'Ketua', bio: 'Mahasiswa Universitas Jabal Ghafur', social: { linkedin: '#', twitter: '#' } },
  { name: 'Putra Ramadhan', role: 'Anggota', bio: 'Mahasiswa Universitas Jabal Ghafur', social: { linkedin: '#', twitter: '#' } },
  { name: 'Budi Santoso', role: 'Anggota', bio: 'Mahasiswa Universitas Jabal Ghafur', social: { linkedin: '#', twitter: '#' } }
]

const advisors = [
  { name: 'Tri Mulya Dharma, S.Kom., M.T', role: 'Advisor', bio: 'Dosen Teknik Informatika Jabal Ghafur' },
  
]

export default function TeamPage() {
  const t = useTranslations()
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.team.pageTitle} <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">{t.team.pageTitleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Didukung oleh tim profesional yang berpengalaman di bidang agro-maritim, teknologi, dan bisnis internasional.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t.team.coreTeam}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <div key={i} className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-ocean-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{m.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">{m.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{m.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href={m.social.linkedin} className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Linkedin size={18} /></a>
                  <a href={m.social.twitter} className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Twitter size={18} /></a>
                  <a href="#" className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Mail size={18} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t.team.advisors}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            {advisors.map((a, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-ocean-400 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {a.name.split(' ').filter(n => n !== 'Dr.' && n !== 'Prof.').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{a.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">{a.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{a.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
