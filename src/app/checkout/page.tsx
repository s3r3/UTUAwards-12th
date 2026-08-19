'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cart.store'
import { useTranslations } from '@/lib/i18n'
import { ShoppingBag, Building2, Store, CreditCard, Wallet, MapPin, Search, ChevronDown } from 'lucide-react'

interface Address {
  id: string; label?: string; name: string; phone: string; street: string
  city: string; province: string; postalCode: string; isDefault: boolean
}

// Mock address autocomplete — outputs human-readable address strings
const ADDRESS_SUGGESTIONS = [
  'Jl. Teuku Umar No. 12, Banda Aceh, Aceh 23111',
  'Jl. Sultan Iskandar Muda, Banda Aceh, Aceh 23241',
  'Jl. Diponegoro No. 5, Banda Aceh, Aceh 23122',
  'Jl. Blang Bintang Lama, Aceh Besar, Aceh 23372',
  'Jl. Prada, Banda Aceh, Aceh 23124',
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
  const [addressQuery, setAddressQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)

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

  const applyDiscount = () => {
    // Mock: any code gives 10% off
    if (discountCode.trim()) {
      setDiscount(subtotal() * 0.1)
    } else {
      setDiscount(0)
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
      router.push('/checkout/success?order_id=' + d.data.orderId)
    } else {
      setError(d.error || t.common.error); setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  const shipping = 15000
  const total = subtotal() - discount + shipping
  const finalTotal = Math.max(total, 0)

  const inputCls = 'w-full px-0 py-2.5 bg-transparent border-b border-black/15 focus:outline-none focus:border-black text-sm text-gray-900 placeholder:text-gray-400 transition-colors'
  const selectRow = (active: boolean) =>
    `flex items-center gap-4 px-4 py-3.5 border transition-colors cursor-pointer ${active ? 'border-black bg-white text-gray-900' : 'border-black/15 text-gray-600 hover:border-black/40'}`

  return (
    <div className="min-h-screen pt-28 pb-12 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_420px]">
          {/* ============ LEFT — Checkout Steps ============ */}
          <div className="px-0 lg:pr-14 lg:pl-4 py-10">
            <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-2">{t.checkout.title}</h1>
            <p className="text-sm text-gray-500 mb-10">
              <span className="font-mono text-xs tracking-widest">[{totalItems()} items]</span>
            </p>

            {/* Express Checkout */}
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-4">Express Checkout</p>
              <div className="grid grid-cols-3 gap-3">
                {['Shop Pay', 'PayPal', 'G Pay'].map(label => (
                  <button key={label} className="border border-black/15 py-3 text-xs font-medium uppercase tracking-wider hover:border-black transition-colors text-gray-700 dark:text-gray-300">
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-5">
                <span className="mr-3 text-gray-300 font-mono text-sm">01</span>Kontak
              </h2>
              <input type="email" placeholder="Email" className={inputCls} />
            </section>

            {/* Delivery / Address */}
            <section className="mb-10">
              <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-5">
                <span className="mr-3 text-gray-300 font-mono text-sm">02</span>{t.checkout.shippingAddress}
              </h2>

              {/* Address Search / Map mockup */}
              <div className="relative mb-6">
                <div className="flex items-center border border-black/15 px-4 focus-within:border-black transition-colors">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={addressQuery}
                    onChange={e => { setAddressQuery(e.target.value); setShowSuggestions(true) }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Cari alamat, jalan, atau kota..."
                    className="flex-1 px-3 py-3 bg-transparent outline-none text-sm"
                  />
                  <MapPin size={16} className="text-gray-400" />
                </div>
                {showSuggestions && addressQuery && (
                  <div className="absolute top-full left-0 right-0 z-20 border border-black/15 bg-white shadow-xl mt-1">
                    {ADDRESS_SUGGESTIONS.filter(s => s.toLowerCase().includes(addressQuery.toLowerCase())).map((s, i) => (
                      <button
                        key={i}
                        onMouseDown={() => {
                          const [street, city, province, postalCode] = s.split(', ')
                          setAddressQuery(s)
                          setForm(f => ({ ...f, street, city, province, postalCode: postalCode?.split(' ')[1] || '' }))
                          setShowSuggestions(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-stone-100 text-gray-700 border-b border-black/5 last:border-0 flex items-center gap-2"
                      >
                        <MapPin size={14} className="text-gray-400" /> {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-black bg-stone-50 dark:bg-gray-900' : 'border-black/15 hover:border-black/40'}`}>
                      <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={e => setSelectedAddress(e.target.value)} className="mt-1 accent-black" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{addr.name} {addr.label && <span className="text-xs text-gray-500">({addr.label})</span>}</p>
                        <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                        <p className="text-sm text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <button onClick={() => setShowForm(!showForm)} className="text-sm text-gray-700 dark:text-gray-300 underline underline-offset-4 hover:text-black">+ {t.checkout.newAddress}</button>
              {showForm && (
                <div className="mt-4 border border-black/15 p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <input className={inputCls + ' col-span-2'} placeholder={t.checkout.labelPlaceholder} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                    <input className={inputCls} placeholder={t.checkout.name} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    <input className={inputCls} placeholder={t.checkout.phone} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <input className={inputCls + ' col-span-2'} placeholder={t.checkout.street} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
                    <input className={inputCls} placeholder={t.checkout.city} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    <input className={inputCls} placeholder={t.checkout.province} value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
                    <input className={inputCls} placeholder={t.checkout.postalCode} value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
                  </div>
                  <button onClick={handleSaveAddress} className="px-6 py-2.5 bg-black text-white text-xs font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors">{t.checkout.saveAddress}</button>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="mb-10">
              <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-5">
                <span className="mr-3 text-gray-300 font-mono text-sm">03</span>{t.checkout.paymentMethod}
              </h2>
              <div className="divide-y divide-black/10 border border-black/15">
                {/* QRIS / VA */}
                {[
                  { id: 'qris', label: 'QRIS / Virtual Account', sub: 'BCA • Mandiri • BNI • BRI', icon: Wallet },
                  { id: 'cstore', label: t.checkout.convenienceStore, sub: 'Indomaret • Alfamart', icon: Store },
                  { id: 'card', label: 'Kartu Kredit / Debit', sub: 'Visa • Mastercard • Amex', icon: CreditCard },
                  { id: 'wallet', label: 'PayPal / E-Wallet', sub: 'PayPal • GoPay • OVO • DANA', icon: Building2 },
                ].map(m => (
                  <label key={m.id} className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition-colors ${paymentMethod === m.id ? 'bg-stone-50 dark:bg-gray-900' : 'hover:bg-stone-50/50 dark:hover:bg-gray-900/50'}`}>
                    <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={e => setPaymentMethod(e.target.value)} className="accent-black" />
                    <m.icon size={20} className={paymentMethod === m.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p>
                      <p className="text-xs text-gray-500">{m.sub}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-300" />
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* ============ RIGHT — Order Summary (dark sticky) ============ */}
          <aside className="lg:sticky lg:top-28 lg:h-fit bg-gray-950 text-gray-300 px-8 py-10">
            <h3 className="font-serif text-xl font-semibold text-white mb-8">Ringkasan Pesanan</h3>

            {/* Items */}
            <div className="space-y-5 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-gray-800">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm text-white whitespace-nowrap">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-3">Kode Diskon</p>
              <div className="flex">
                <input
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  placeholder="ACELORA10"
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 focus:border-gray-600 outline-none text-sm text-white placeholder:text-gray-600"
                />
                <button onClick={applyDiscount} className="px-5 bg-white text-gray-900 text-xs font-semibold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Apply
                </button>
              </div>
              {discount > 0 && <p className="text-xs text-emerald-400 mt-2">Diskon 10% diterapkan: −Rp {discount.toLocaleString('id-ID')}</p>}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 border-t border-gray-800 pt-6 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-white">Rp {subtotal().toLocaleString('id-ID')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Diskon</span>
                  <span className="text-emerald-400">−Rp {discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Pengiriman</span>
                <span className="text-white">Rp {shipping.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                <span className="font-serif text-base text-white">Total</span>
                <span className="font-serif text-2xl text-white">Rp {finalTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-950 text-white text-sm font-semibold uppercase tracking-widest hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              {loading ? t.checkout.processing : 'Bayar Sekarang'}
            </button>
            <p className="text-xs text-gray-600 text-center mt-4">{t.checkout.secureNote}</p>
          </aside>
        </div>
      </div>
    </div>
  )
}
