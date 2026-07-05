'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useTranslations } from '@/lib/i18n'
import { Target, Eye, Anchor, Sprout, Globe, Users } from 'lucide-react'

const getValues = (t: ReturnType<typeof useTranslations>) => [
  { icon: Sprout, title: t.about.val1title, desc: t.about.val1desc },
  { icon: Globe, title: t.about.val2title, desc: t.about.val2desc },
  { icon: Users, title: t.about.val3title, desc: t.about.val3desc },
  { icon: Anchor, title: t.about.val4title, desc: t.about.val4desc },
]

export default function AboutPage() {
  const t = useTranslations()
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.about.title} <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">{t.about.titleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.about.desc}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Target className="mr-2" size={16} /> {t.about.mission}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t.about.missionTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t.about.missionDesc}
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">✓</span> {t.about.list1}</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">✓</span> {t.about.list2}</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">✓</span> {t.about.list3}</li>
            </ul>
          </div>
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 text-ocean-700 text-sm font-medium mb-4">
              <Eye className="mr-2" size={16} /> {t.about.vision}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t.about.visionTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about.visionDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{t.about.values}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getValues(t).map((v, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100 dark:border-gray-700">
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

      <Footer />
    </main>
  )
}
