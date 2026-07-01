'use client'

import { useQuery } from '@tanstack/react-query'
import { useProductStore } from '@/store/product.store'
import { useEffect } from 'react'
import type { Product } from '@/types'

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'Failed to fetch')
  return json.data
}

export function useProducts() {
  const query = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
  const { setProducts, products } = useProductStore()

  useEffect(() => {
    if (query.data) setProducts(query.data)
  }, [query.data, setProducts])

  return { products: query.data || products, isLoading: query.isLoading, error: query.error }
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to fetch')
      return json.data as Product
    },
  })
}
