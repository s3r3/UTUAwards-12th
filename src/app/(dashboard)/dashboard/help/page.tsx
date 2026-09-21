'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function UserHelpPage() {
  const t = useTranslations()
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    { q: t.member.faq1q, a: t.member.faq1a },
    { q: t.member.faq2q, a: t.member.faq2a },
    { q: t.member.faq3q, a: t.member.faq3a },
    { q: t.member.faq4q, a: t.member.faq4a },
    { q: t.member.faq5q, a: t.member.faq5a },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-serif text-xl font-semibold text-gray-950 dark:text-white">{t.member.helpTitle}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.member.helpSubtitle}</p>
        <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
          <MessageCircle size={16} /> {t.member.contactUs}
        </Link>
      </div>

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {faqs.map((f, i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-gray-950 dark:text-white">
              {f.q}
              <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
