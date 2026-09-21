'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { userFallbackReviews } from '@/data/userDemo'

interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: string
  product?: { name: string } | null
  productName?: string
}

export default function UserReviewsPage() {
  const t = useTranslations()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews?_limit=20')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setReviews(d.data)
        else setReviews(userFallbackReviews as unknown as Review[])
      })
      .catch(() => setReviews(userFallbackReviews as unknown as Review[]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}</div>

  return (
    <div className="space-y-3">
      {reviews.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <Star size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-gray-950 dark:text-white">{t.member.noReviews}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.member.noReviewsDesc}</p>
        </div>
      )}
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-950 dark:text-white">{r.product?.name || r.productName || t.member.productFallback}</p>
            <span className="flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400"><Star size={14} fill="currentColor" /> {r.rating}/5</span>
          </div>
          {r.comment && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      ))}
    </div>
  )
}
