'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/landing/Footer'
import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/lib/i18n'
import type { AcehLocation, AcehRegency } from '@/data/acehLocations'

const inputCls = 'w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-colors text-sm bg-white dark:bg-gray-900 text-gray-950 dark:text-white'
const labelCls = 'block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'

export default function ApplyPartnerPage() {
  const t = useTranslations()
  const [locations, setLocations] = useState<AcehLocation[]>([])
  const [province, setProvince] = useState('')
  const [regency, setRegency] = useState('')
  const [district, setDistrict] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/locations')
      .then((r) => r.json())
      .then((res) => { if (res.success) setLocations(res.data) })
      .catch(() => {})
  }, [])

  const selectedProvince = locations.find((p) => p.province === province)
  const selectedRegency: AcehRegency | undefined = selectedProvince?.regencies.find((r) => r.name === regency)

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] dark:bg-gray-950">
        <Navbar />
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[16px] p-12">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4 text-gray-950 dark:text-white">{t.apply.successTitle}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t.apply.successDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                {t.apply.backHome}
              </Link>
              <Link href="/menjadi-mitra" className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {t.apply.viewStatus}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] dark:bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto py-20 px-6">
        <div className="flex justify-center gap-8 mb-12 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="text-primary-600 dark:text-primary-400 font-semibold">{t.apply.step1}</span>
          <span>{t.apply.step2}</span>
          <span>{t.apply.step3}</span>
        </div>

        <div className="mb-10 text-center">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">{t.apply.eyebrow}</p>
          <h1 className="font-serif text-2xl font-bold mb-3 text-gray-950 dark:text-white">{t.apply.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t.apply.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[16px] p-8 md:p-10 space-y-10">
          <div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 first:border-0 first:pt-0">
              <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-1">{t.apply.bizTitle}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t.apply.bizDesc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>{t.apply.bizName}</label>
                  <input required type="text" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t.apply.ownerName}</label>
                  <input required type="text" className={inputCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>{t.apply.bizType}</label>
                  <select required className={`${inputCls} appearance-none`} defaultValue="">
                    <option value="" disabled>{t.apply.bizTypePlaceholder}</option>
                    <option>{t.apply.bizFarmer}</option>
                    <option>{t.apply.bizFisher}</option>
                    <option>{t.apply.bizProducer}</option>
                    <option>{t.apply.bizMsme}</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t.apply.province}</label>
                  <select required value={province} onChange={(e) => { setProvince(e.target.value); setRegency(''); setDistrict('') }} className={`${inputCls} appearance-none`} >
                    <option value="">{t.apply.provincePlaceholder}</option>
                    {locations.map((p) => <option key={p.province} value={p.province}>{p.province}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t.apply.regency}</label>
                  <select required value={regency} disabled={!province} onChange={(e) => { setRegency(e.target.value); setDistrict('') }} className={`${inputCls} appearance-none disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400`}>
                    <option value="">{t.apply.regencyPlaceholder}</option>
                    {selectedProvince?.regencies.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>{t.apply.district}</label>
                  <select required value={district} disabled={!regency} onChange={(e) => setDistrict(e.target.value)} className={`${inputCls} appearance-none disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400`}>
                    <option value="">{t.apply.districtPlaceholder}</option>
                    {selectedRegency?.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t.apply.bizEmail}</label>
                  <input required type="email" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t.apply.bizPhone}</label>
                  <input required type="tel" className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-1">{t.apply.productTitle}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t.apply.productDesc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelCls}>{t.apply.productCategory}</label>
                  <select required className={`${inputCls} appearance-none`} defaultValue="">
                    <option value="" disabled>{t.apply.productCategoryPlaceholder}</option>
                    <option>Agriculture</option>
                    <option>Maritime</option>
                    <option>Livestock</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>{t.apply.sampleName}</label>
                  <input required type="text" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t.apply.productOrigin}</label>
                  <input required type="text" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t.apply.capacity}</label>
                  <input required type="text" className={inputCls} placeholder={t.apply.capacityPlaceholder} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-start gap-3">
                <input required type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  {t.apply.confirm}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full h-14 bg-primary-600 text-white rounded-[10px] font-medium hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.apply.submitting}</> : t.apply.submit}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}
