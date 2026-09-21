'use client'

import { useEffect, useState } from 'react'
import { MapPin, Plus, Star, Trash2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { userFallbackAddresses } from '@/data/userDemo'

interface Address {
  id: string
  label?: string | null
  name: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

const emptyForm = {
  label: '',
  name: '',
  phone: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false,
}

export default function UserAddressesPage() {
  const t = useTranslations()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  /**
   * Initial load
   *
   * Fetch dilakukan langsung di dalam effect.
   * Tidak memanggil fungsi yang langsung melakukan setState
   * dari body effect.
   */
  useEffect(() => {
    let cancelled = false

    const fetchAddresses = async () => {
      try {
        const res = await fetch('/api/addresses')

        if (!res.ok) {
          throw new Error('Failed to fetch addresses')
        }

        const json = await res.json()

        if (cancelled) return

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setAddresses(json.data)
        } else {
          setAddresses(userFallbackAddresses)
        }
      } catch {
        if (!cancelled) {
          setAddresses(userFallbackAddresses)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAddresses()

    return () => {
      cancelled = true
    }
  }, [])

  /**
   * Reload addresses after save/delete.
   *
   * Fungsi ini tidak dipanggil langsung dari useEffect.
   */
  const reloadAddresses = async () => {
    try {
      const res = await fetch('/api/addresses')

      if (!res.ok) {
        throw new Error('Failed to reload addresses')
      }

      const json = await res.json()

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setAddresses(json.data)
      } else {
        setAddresses(userFallbackAddresses)
      }
    } catch {
      setAddresses(userFallbackAddresses)
    }
  }

  /**
   * Save address
   */
  const save = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.street ||
      !form.city
    ) {
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const json = await res.json()

      if (json.success) {
        setShowForm(false)
        setForm(emptyForm)

        await reloadAddresses()
      }
    } catch (error) {
      console.error('Failed to save address:', error)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Delete address
   */
  const remove = async (id: string) => {
    // Demo/fallback address
    if (id.startsWith('a')) {
      setAddresses((prev) =>
        prev.filter((address) => address.id !== id)
      )

      return
    }

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete address')
      }

      await reloadAddresses()
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  const fields = [
    {
      key: 'label' as const,
      label: t.checkout.label,
    },
    {
      key: 'name' as const,
      label: t.checkout.name,
    },
    {
      key: 'phone' as const,
      label: t.checkout.phone,
    },
    {
      key: 'street' as const,
      label: t.checkout.street,
    },
    {
      key: 'city' as const,
      label: t.checkout.city,
    },
    {
      key: 'province' as const,
      label: t.checkout.province,
    },
    {
      key: 'postalCode' as const,
      label: t.checkout.postalCode,
    },
  ]

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Address Button */}
      <button
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        <Plus size={16} />

        {t.member.addAddress}
      </button>

      {/* Address Form */}
      {showForm && (
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <label
              key={key}
              className={`block text-sm ${
                key === 'street' ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>

              <input
                type="text"
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-gray-950 outline-none transition-colors focus:border-emerald-500 dark:border-gray-700 dark:text-white"
              />
            </label>
          ))}

          {/* Default Address */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
            />

            {t.member.setDefault}
          </label>

          {/* Save */}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-950"
            >
              {saving
                ? t.member.saving
                : t.member.saveAddress}
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-gray-950 dark:text-white">
                <MapPin size={15} />

                {address.label || t.member.productFallback}
              </p>

              {address.isDefault && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <Star size={11} />

                  {t.member.isDefault}
                </span>
              )}
            </div>

            {/* Name & Phone */}
            <p className="mt-3 text-sm font-medium text-gray-950 dark:text-white">
              {address.name} · {address.phone}
            </p>

            {/* Address */}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {address.street}, {address.city},{' '}
              {address.province} {address.postalCode}
            </p>

            {/* Delete */}
            <button
              type="button"
              onClick={() => remove(address.id)}
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-red-500 hover:underline"
            >
              <Trash2 size={13} />

              {t.member.remove}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}