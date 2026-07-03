'use client'

import { useState, useEffect, useCallback } from 'react'
import { Package, Plus, Search, Edit3, Trash2, X, ImageIcon, Loader2, MapPin, Tag } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useTranslations } from '@/lib/i18n'

interface Product {
  id: string
  name: string
  category: string
  description: string
  origin: string
  status: string
  image?: string | null
  legality?: string | null
  createdAt: string
}

const categories = [
  { value: 'COFFEE', label: 'Kopi Gayo', image: '/images/kopi_arabica.png' },
  { value: 'PATCHOULI', label: 'Nilam Aceh', image: '/images/PatchouliOil.png' },
  { value: 'SEAFOOD', label: 'Seafood', image: '/images/VannameiShrimp.png' },
  { value: 'SPICES', label: 'Rempah', image: '/images/rempahcustomAceh.png' },
  { value: 'PROCESSED', label: 'Produk Olahan', image: '/images/ikantongkolasap.png' },
]

const statusBadge: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PENDING: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  VERIFIED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const initialForm = { name: '', category: 'COFFEE', description: '', origin: '', image: '', legality: '' }

export default function MyProductsPage() {
  const t = useTranslations()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [previewImg, setPreviewImg] = useState('')
  const [detail, setDetail] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const json = await res.json()
      if (json.success) setProducts(json.data)
    } catch (e) {
      console.error('Failed to fetch products', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const openAdd = () => {
    setEditing(null)
    setForm(initialForm)
    setPreviewImg('')
    setModal('add')
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, category: p.category, description: p.description, origin: p.origin, image: p.image || '', legality: p.legality || '' })
    setPreviewImg(p.image || '')
    setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/products/${editing.id}` : '/api/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ownerId: 'seed-owner' }),
      })
      const json = await res.json()
      if (json.success) {
        setModal(null)
        fetchProducts()
      }
    } catch (e) {
      console.error('Save failed', e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setDeleteId(null)
        setProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (e) {
      console.error('Delete failed', e)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryMeta = (cat: string) => categories.find((c) => c.value === cat)

  const statusOrder = ['PENDING', 'REVIEW', 'VERIFIED', 'APPROVED', 'REJECTED']
  const sorted = [...filtered].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard.myProducts}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {products.length} produk terdaftar
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              ☰
            </button>
          </div>
          <Button onClick={openAdd} className="gap-2"><Plus size={16} /> {t.dashboard.addProduct}</Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text" placeholder="Cari produk..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t.dashboard.noProductsFound}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {t.dashboard.noProductsDesc}
          </p>
          <Button onClick={openAdd} className="gap-2"><Plus size={16} /> {t.dashboard.addProduct} Pertama</Button>
        </div>
      )}

      {/* Product Grid/List */}
      {!loading && products.length > 0 && sorted.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
          <Search size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Produk &quot;{search}&quot; tidak ditemukan</p>
          <button onClick={() => setSearch('')} className="text-sm text-primary-600 mt-1 hover:underline">{t.dashboard.clearFilter}</button>
        </div>
      )}

      {!loading && sorted.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => {
            const cat = getCategoryMeta(p.category)
            return (
              <div key={p.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-primary-500/30 transition-all">
                {/* Image */}
                <div
                  className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => setDetail(p)}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <img src={cat?.image || '/images/kopi_arabica.png'} alt="" className="w-full h-full object-cover opacity-70" />
                  )}
                  <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[p.status] || statusBadge.PENDING}`}>
                    {p.status}
                  </span>
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(p) }} className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors"><Edit3 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(p.id) }} className="p-2 bg-white/90 rounded-lg text-red-600 hover:bg-white transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 cursor-pointer" onClick={() => setDetail(p)}>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-snug line-clamp-2">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin size={11} /> {p.origin}
                    <span className="mx-1">·</span>
                    <Tag size={11} /> {cat?.label || p.category}
                  </div>
                  {p.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{p.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {!loading && sorted.length > 0 && viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.map((p) => {
              const cat = getCategoryMeta(p.category)
              return (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover rounded-xl" /> : <img src={cat?.image || "/images/kopi_arabica.png"} alt="" className="w-full h-full object-cover rounded-xl" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cat?.label} · {p.origin}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[p.status] || statusBadge.PENDING}`}>{p.status}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modal !== null} onClose={() => setModal(null)} title={editing ? 'Edit Produk' : t.dashboard.addProduct + ' Baru'} size="xl">
        <div className="space-y-5">
          <Input id="name" label="Nama Produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Kopi Arabica Gayo Premium" required />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.dashboard.category}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.dashboard.productImage}</label>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Input
                  id="image" placeholder="URL gambar (opsional)" value={form.image}
                  onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreviewImg(e.target.value) }}
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400">atau upload</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <ImageIcon size={18} />
                  Pilih dari galeri
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string
                        setForm({ ...form, image: dataUrl })
                        setPreviewImg(dataUrl)
                      }
                      reader.readAsDataURL(file)
                    }
                  }} />
                </label>
              </div>
              <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                {previewImg ? (
                  <img src={previewImg} alt="preview" className="w-full h-full object-cover" onError={() => setPreviewImg('')} />
                ) : (
                  <ImageIcon size={24} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.dashboard.description}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ceritakan tentang produk Anda..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
              rows={3} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="origin" label="Asal Daerah" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Contoh: Gayo Lues" required />
            <Input id="legality" label="Legalitas (opsional)" value={form.legality} onChange={(e) => setForm({ ...form, legality: e.target.value })} placeholder="Contoh: BPOM, Halal MUI" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Button variant="outline" onClick={() => setModal(null)}>{t.dashboard.cancel}</Button>
            <Button onClick={handleSave} isLoading={saving}>{editing ? 'Simpan Perubahan' : t.dashboard.addProduct}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title={t.dashboard.deleteProduct + " Produk"} size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} className="text-red-500" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">{t.dashboard.deleteConfirm}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.dashboard.deleteWarning}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t.dashboard.cancel}</Button>
            <Button className="!bg-red-600 hover:!bg-red-700" onClick={() => deleteId && handleDelete(deleteId)}>{t.dashboard.deleteProduct}</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={detail?.name || ''} size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="h-48 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
              {detail.image ? (
                <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
              ) : (
                <img src={getCategoryMeta(detail.category)?.image || "/images/kopi_arabica.png"} alt="" className="w-full h-full object-cover opacity-70" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[detail.status] || statusBadge.PENDING}`}>{detail.status}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{getCategoryMeta(detail.category)?.label}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{detail.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">{t.dashboard.origin}</span> <span className="text-gray-900 dark:text-white font-medium">{detail.origin}</span></div>
              <div><span className="text-gray-500">{t.dashboard.date}</span> <span className="text-gray-900 dark:text-white font-medium">{new Date(detail.createdAt).toLocaleDateString('id-ID')}</span></div>
              {detail.legality && <div className="col-span-2"><span className="text-gray-500">{t.dashboard.legality}</span> <span className="text-gray-900 dark:text-white font-medium">{detail.legality}</span></div>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
