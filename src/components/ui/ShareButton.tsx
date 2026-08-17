'use client'

import { useState, useCallback } from 'react'
import { Share2, Copy, Check } from 'lucide-react'

interface ShareButtonProps {
  url: string
  title?: string
  className?: string
}

export default function ShareButton({ url, title = 'Bagikan produk ini', className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [url])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }, [title, url])

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleShare}
        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={title}
      >
        <Share2 size={18} />
      </button>
      <span className="text-xs text-gray-500 dark:text-gray-400">Bagikan</span>
    </div>
  )
}