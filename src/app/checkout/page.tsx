'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import { ShoppingBag, Building2, Store } from 'lucide-react'

interface Address {
  id: string; label?: string; name: string; phone: string; street: string
  city: string; province: string; postalCode: string; isDefault: boolean
}

const paymentMethods = (t: any) => [
  { id: 'bank_transfer', label: t.checkout.bankTransfer, icon: Building2 },
  { id: 'cstore', label: t.checkout.convenienceStore, icon: Store },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, totalItems, clearCart } = useCartStore()
  const t = useTranslations()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', name: '', phone: '', street: '', city: '', province: '', postalCode: '' })

  useEffect(() => {
    if (items.length === 0) { router.push('/cart'); return }
    fetch('/api/addresses').then(r => r.json()).then(d => {
      if (d.success) {
        setAddresses(d.data)
        const def = d.data.find((a: Address) => a.isDefault)
        if (def) setSelectedAddress(def.id)
      }
    })
  }, [items, router])

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
    if (!selectedAddress) { setError(t.checkout.selectAddress); return }
    setLoading(true); setError('')
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), addressId: selectedAddress }),
    })
    const d = await res.json()
    if (d.success) {
      clearCart()
      router.push('/orders/' + d.data.orderId)
    } else {
      setError(d.error || t.common.error); setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.checkout.title}</h1>
        <div className="grid md:grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div className="space-y-6">
            {/* Address */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.checkout.shippingAddress}</h2>
              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={e => setSelectedAddress(e.target.value)} className="mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{addr.name} {addr.label && <span className="text-xs text-gray-500">({addr.label})</span>}</p>
                        <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                        <p className="text-sm text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <button onClick={() => setShowForm(!showForm)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ {t.checkout.newAddress}</button>
              {showForm && (
                <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input className="col-span-2 px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.labelPlaceholder} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                    <input className="px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.name} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    <input className="px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.phone} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <input className="col-span-2 px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.street} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
                    <input className="px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.city} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    <input className="px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.province} value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
                    <input className="px-3 py-2.5 rounded-lg border text-sm" placeholder={t.checkout.postalCode} value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
                  </div>
                  <button onClick={handleSaveAddress} className="px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium">{t.checkout.saveAddress}</button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.checkout.paymentMethod}</h2>
              <div className="space-y-3">
                {paymentMethods(t).map(method => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={e => setPaymentMethod(e.target.value)} className="sr-only" />
                    <method.icon size={24} className={paymentMethod === method.id ? 'text-primary-600' : 'text-gray-400'} />
                    <span className="font-medium text-gray-900 dark:text-white">{method.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">{t.checkout.midtransNote || 'Setelah checkout, lakukan transfer ke rekening yang tertera.'}</p>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="h-fit p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-28">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.checkout.orderSummary}</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 truncate">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg">
              <span className="text-gray-900 dark:text-white">{t.cart.total}</span>
              <span className="text-primary-600">Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-ocean-500 text-white font-semibold hover:from-primary-600 hover:to-ocean-600 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/25"
            >
              <ShoppingBag size={20} />
              {loading ? t.checkout.processing : `${t.checkout.payNow} Rp ${subtotal().toLocaleString('id-ID')}`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">{t.checkout.secureNote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
