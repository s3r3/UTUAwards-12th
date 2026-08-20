import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PRODUCT_CATEGORIES } from '@/constants/products'
import ProductDetailClient, { RelatedProducts } from '@/components/product/ProductDetailClient'


export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  const [product, rawReviews] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { owner: { select: { name: true } } },
    }),
    prisma.review.findMany({
      where: { productId: id },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const reviews = rawReviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() }))
  const displayReviews = reviews.length > 0 ? reviews : []

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Produk Tidak Ditemukan</h1>
      </div>
    )
  }

  // Related products: same category, excluding current — fallback static if DB down
  let related: typeof product[] = []
  try {
    related = await prisma.product.findMany({
      where: { category: product.category, status: 'APPROVED', id: { not: product.id } },
      select: {
        id: true, name: true, category: true, description: true, image: true, images: true, origin: true, price: true, compareAt: true, stock: true, weight: true, status: true, legality: true, packageDesign: true, ownerId: true, createdAt: true, updatedAt: true,
        owner: { select: { name: true, email: true } }, // Include owner here
      },
      take: 3,
    })
  } catch {} // DB down → empty section hide-able

  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category)
  const isAvailable = product.stock > 0
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://acelora.id'

  // Calculate rating stats
  const avgRating = reviews.length > 0 ? Math.round((reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length) * 20) / 20 : 0
  const reviewCount = reviews.length

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

  const escapeScriptTags = (html: string) => html.replace(/<\//g, '\\u003c/')

  return (
    <div className="min-h-screen pt-24 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeScriptTags(JSON.stringify(breadcrumb)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeScriptTags(JSON.stringify(productSchema)) }} />

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
            packageDesign: product.packageDesign || undefined,
            ownerId: product.ownerId,
            createdAt: product.createdAt,
            owner: product.owner,
          }}
          category={category}
          isAvailable={isAvailable}
          reviews={displayReviews}
          rating={avgRating}
          reviewCount={reviewCount}
        />



        {related.length > 0 && (
          <RelatedProducts
            product={{ ...product, image: product.image || undefined, compareAt: product.compareAt || undefined, weight: product.weight || undefined, legality: product.legality || undefined, packageDesign: product.packageDesign || undefined }}
            products={related.map((r) => ({
              id: r.id,
              name: r.name,
              category: r.category,
              description: r.description,
              image: r.image || undefined,
              images: r.images,
              origin: r.origin,
              price: r.price,
              compareAt: r.compareAt || undefined,
              stock: r.stock,
              weight: r.weight || undefined,
              status: r.status,
              legality: r.legality || undefined,
              packageDesign: r.packageDesign || undefined,
              ownerId: r.ownerId,
              createdAt: r.createdAt,
            }))}
          />
        )}
      </div>
    </div>
  )
}