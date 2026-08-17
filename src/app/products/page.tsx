import { Suspense } from 'react'
import ProductsClient from '@/components/products/ProductsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-primary-500" />
      </div>
    }>
      <ProductsClient />
    </Suspense>
  )
}