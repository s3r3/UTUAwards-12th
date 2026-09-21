'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'

export default function UserWishlistPage() {
  const t = useTranslations()
  const [ids, setIds] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    let cancelled = false
    const seedIfEmpty = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem('acelora-wishlist') || '[]') as string[]
        if (saved.length > 0) {
          if (!cancelled) setIds(saved)
          return
        }
        const res = await fetch('/api/products')
        const json = await res.json()
        const seed = json.success && Array.isArray(json.data)
          ? (json.data as { id: string }[]).slice(0, 3).map((p) => p.id)
          : []
        if (!cancelled) {
          if (seed.length > 0) {
            localStorage.setItem('acelora-wishlist', JSON.stringify(seed))
            setIds(seed)
          } else {
            setIds([])
          }
        }
      } catch {
        if (!cancelled) setIds([])
      }
    }
    seedIfEmpty()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); setLoading(false); return }
    setLoading(true)
    Promise.all(ids.map((id) => fetch(`/api/products/${id}`).then(r => r.json()).catch(() => null)))
      .then((res) => setProducts(res.filter((r) => r?.success).map((r) => r.data as Product)))
      .finally(() => setLoading(false))
  }, [ids])

  const remove = (id: string) => {
    const next = ids.filter((x) => x !== id)
    setIds(next)
    localStorage.setItem('acelora-wishlist', JSON.stringify(next))
  }

  if (loading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}</div>

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <Heart size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h2 className="font-serif text-xl font-semibold text-gray-950 dark:text-white">{t.member.wishlistEmpty}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.member.wishlistEmptyDesc}</p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">{t.member.exploreProducts}</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{t.member.savedCount.replace('{count}', String(products.length))}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <Link href={`/products/${p.id}`} className="relative block h-44 bg-stone-100 dark:bg-gray-800">
              {p.image && <Image src={p.image} alt={p.name} fill unoptimized className="object-cover" />}
            </Link>
            <div className="p-4">
              <Link href={`/products/${p.id}`} className="line-clamp-1 text-sm font-semibold text-gray-950 hover:underline dark:text-white">{p.name}</Link>
              <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">Rp {(p.price || 0).toLocaleString('id-ID')}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => addItem({ productId: p.id, name: p.name, price: p.price || 0, image: p.image || '', stock: p.stock ?? 99, quantity: 1 })}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-950 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                >
                  <ShoppingCart size={14} /> {t.member.addToCart}
                </button>
                <button onClick={() => remove(p.id)} className="rounded-lg border border-gray-200 p-2 text-red-500 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-900/20" aria-label={t.member.remove}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
