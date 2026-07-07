'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, ArrowLeft, MapPin, Package } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const t = useTranslations()

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(d => { if (d.success) setProduct(d.data) }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.common.loading}</div>
  if (!product) return <div className="min-h-screen pt-24 flex items-center justify-center">{t.products.notFound}</div>

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.image || '', quantity, stock: product.stock })
    router.push('/cart')
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-primary-600">
          <ArrowLeft size={20} /> {t.common.back}
        </button>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50">
            {product.image && <Image src={product.image} alt={product.name} fill className="object-cover" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-4">Rp {product.price.toLocaleString('id-ID')}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} /> {t.products.origin}: {product.origin}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500"><Package size={16} /> {t.products.stock}: {product.stock > 0 ? `${product.stock}` : t.products.outOfStock}</div>
            </div>
            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">{t.products.quantity}:</span>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={18} /></button>
                    <span className="px-4 py-2 font-medium text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2"><Plus size={18} /></button>
                  </div>
                </div>
                <button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white font-semibold bg-primary-500 hover:bg-primary-600">
                  <ShoppingCart size={20} /> {t.products.addToCart}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
