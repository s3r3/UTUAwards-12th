import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PRODUCT_CATEGORIES } from '@/constants/products'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import TraceabilityTimeline from '@/components/product/TraceabilityTimeline'

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { status: 'APPROVED' },
    select: { id: true },
  })
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true, image: true },
  })

  if (!product) return { title: 'Produk Tidak Ditemukan' }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://acelora.id'

  return {
    title: `${product.name} | Acelora`,
    description: product.description,
    alternates: { canonical: `${APP_URL}/products/${id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      url: `${APP_URL}/products/${id}`,
      images: product.image ? [{ url: product.image, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { owner: { select: { name: true, email: true } } },
  })

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Produk Tidak Ditemukan</h1>
      </div>
    )
  }

  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category)
  const isAvailable = product.stock > 0
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://acelora.id'

  const breadcrumb = {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${APP_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${APP_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${APP_URL}/products/${product.id}` },
    ],
  }

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Acelora' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: product.price,
      availability: `https://schema.org/${isAvailable ? 'InStock' : 'OutOfStock'}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Acelora' },
    },
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6"
        >
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <ProductDetailClient
          product={{
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            image: product.image || undefined,
            images: product.images,
            origin: product.origin,
            price: product.price,
            compareAt: product.compareAt || undefined,
            stock: product.stock,
            weight: product.weight || undefined,
            status: product.status,
            legality: product.legality || undefined,
            ownerId: product.ownerId,
            createdAt: product.createdAt,
            owner: product.owner,
          }}
          category={category}
          isAvailable={isAvailable}
        />

        <TraceabilityTimeline />
      </div>
    </div>
  )
}