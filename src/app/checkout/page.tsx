'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import { ShoppingBag } from 'lucide-react'

interface Address {
  id: string; label?: string; name: string; phone: string; street: string
  city: string; province: string; postalCode: string; isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, totalItems, clearCart } = useCartStore()
  const t = useTranslations()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', name: '', phone: '', street: '', city: '', province: '', postalCode: '' })

  useEffect(() => {
    fetch('/api/addresses').then(r => r.json()).then(d => {
      if (d.success) {
        setAddresses(d.data)
        const def = d.data.find((a: Address) => a.isDefault)
        if (def) setSelectedAddress(def.id)
      }
    })
  }, [])

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleSaveAddress = async () => {
    const res = await fetch('/api/addresses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const d = await res.json()
    if (d.success) {
      setAddresses(prev => [...prev, d.data])
      setSelectedAddress(d.data.id)
      setShowForm(false)
      setForm({ label: '', name: '', phone: '', street: '', city: '', province: '', postalCode: '' })
    }
  }

  const handlePay = async () => {
    if (!selectedAddress) { setError('Please select an address'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), addressId: selectedAddress }),
    })
    const d = await res.json()
    if (d.success) {
      clearCart()
      window.location.href = d.data.url
    } else {
      setError(d.error || 'Something went wrong'); setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">{t.checkout.title}</h1>
        <div className="grid md:grid-cols-[1fr_350px] gap-8">
          <div>
            <h2 className="font-semibold mb-4">{t.checkout.shippingAddress}</h2>
            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map(addr => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer ${selectedAddress === addr.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={e => setSelectedAddress(e.target.value)} className="mt-1" />
                    <div>
                      <p className="font-medium">{addr.name} {addr.label && <span className="text-xs text-gray-500">({addr.label})</span>}</p>
                      <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <button onClick={() => setShowForm(!showForm)} className="text-sm text-primary-600 font-medium">+ {t.checkout.newAddress}</button>
            {showForm && (
              <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className="col-span-2 px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.labelPlaceholder} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.name} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.phone} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <input className="col-span-2 px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.street} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.city} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.province} value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
                  <input className="px-3 py-2 rounded-lg border text-sm" placeholder={t.checkout.postalCode} value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
                </div>
                <button onClick={handleSaveAddress} className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium">{t.checkout.saveAddress}</button>
              </div>
            )}
          </div>
          <div className="h-fit p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-24">
            <h3 className="font-semibold mb-4">{t.checkout.orderSummary}</h3>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate">{item.name} x{item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>{t.cart.total}</span>
              <span>Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <button onClick={handlePay} disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50">
              <ShoppingBag size={20} /> {loading ? t.checkout.processing : t.checkout.pay}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
