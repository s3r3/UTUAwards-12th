'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export function ProductDetailBack() {
  const t = useTranslations()
  return (
    <Link
      href="/products"
      className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400"
    >
      <ArrowLeft size={20} />
      {t.common.back}
    </Link>
  )
}

export function ProductDetailNotFound() {
  const t = useTranslations()
  return (
    <div className="flex min-h-screen items-center justify-center pb-12 pt-24">
      <h1 className="text-2xl font-bold text-gray-950 dark:text-white">{t.dashboard.productNotFound}</h1>
    </div>
  )
}
