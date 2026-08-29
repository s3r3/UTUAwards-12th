'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18NStore } from '@/lib/i18n'

interface NewsItem {
  title: { id: string; en: string }
  date: string
  excerpt: { id: string; en: string }
}

interface RegionNewsProps {
  news: NewsItem[]
}

export default function RegionNews({ news }: RegionNewsProps) {
  const lang = useI18NStore((s) => s.lang)
  const isEn = lang === 'en'
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {news.map((item, index) => (
        <motion.article
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-all hover:border-primary-300 dark:hover:border-primary-700"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-5 text-left flex items-start gap-3"
          >
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 pr-2">
                {isEn ? item.title.en : item.title.id}
              </h4>
              <time className="mt-1 block text-[11px] text-gray-500 dark:text-gray-500 font-mono">
                {item.date}
              </time>
            </div>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5">
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {isEn ? item.excerpt.en : item.excerpt.id}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.article>
      ))}
    </div>
  )
}
