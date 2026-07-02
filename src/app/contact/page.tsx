'use client'

import { useState } from 'react'
import { useTranslations } from "@/lib/i18n"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSent(true)
    }, 1500)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.contact.pageTitle} <span className="bg-gradient-to-r from-primary-600 to-ocean-600 bg-clip-text text-transparent">{t.contact.pageTitleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.contact.pageDesc}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.contact.infoTitle}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">info@metuahhub.id</p>
                    <p className="text-gray-600 dark:text-gray-400">partnership@metuahhub.id</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t.contact.phone}</h3>
                    <p className="text-gray-600 dark:text-gray-400">+62 651 123456</p>
                    <p className="text-gray-600 dark:text-gray-400">+62 812 3456 7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t.contact.address}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Jl. T. Nyak Arief No. 1<br />
                      Banda Aceh, Aceh 23111<br />
                      Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white mx-auto mb-4">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.contact.success}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t.contact.successDesc}</p>
                  <button onClick={() => setSent(false)} className="mt-4 text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    {t.contact.send}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.contact.send}</h2>
                  <Input id="name" label="Nama Lengkap" placeholder="Masukkan nama Anda" required />
                  <Input id="email" label="Email" type="email" placeholder="email@contoh.com" required />
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contact.subject}</label>
                    <select id="subject" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none" required>
                      <option value="">{t.contact.chooseSubject}</option>
                      <option value="partnership">{t.contact.partnership}</option>
                      <option value="product">{t.contact.products}</option>
                      <option value="mentoring">{t.contact.mentoring}</option>
                      <option value="general">Umum</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contact.message}</label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tulis pesan Anda..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    <Send size={18} className="mr-2" /> {t.contact.send}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
