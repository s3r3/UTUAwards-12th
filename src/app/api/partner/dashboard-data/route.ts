import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'PARTNER') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const partnerId = session.user.id

  try {
    const partnerProducts = await prisma.product.findMany({
      where: { ownerId: partnerId },
      select: { id: true, name: true, category: true, price: true, stock: true, status: true, updatedAt: true, ownerId: true },
    })

    const activeProductsCount = partnerProducts.filter((p: any) => p.status === 'Active').length
    const lowStockProductsCount = partnerProducts.filter(
      (p: any) => p.stock > 0 && p.stock < 25
    ).length

    const partnerOrders = await prisma.order.findMany({
      where: {
        items: { some: { product: { ownerId: partnerId } } },
      },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          where: { product: { ownerId: partnerId } },
          include: { product: { select: { name: true, ownerId: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    const totalSalesValue = partnerOrders.reduce((acc: number, order: any) => acc + order.total, 0)
    const activeOrdersCount = partnerOrders.filter(
      (order: any) => order.status !== 'Completed' && order.status !== 'Cancelled'
    ).length

    const recentOrders = partnerOrders.map((order: any) => {
      const partnerOrderItem = order.orderItems.find((item: any) => item.product.ownerId === partnerId)
      return {
        id: order.id,
        buyer: order.user?.name || 'N/A',
        product: partnerOrderItem?.product.name || 'Unknown Product',
        quantity: partnerOrderItem?.quantity.toString() || '0',
        total: order.total,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      }
    })

    const productRevenueMap: Record<string, number> = {}
    partnerOrders.forEach((order: any) => {
      order.orderItems.forEach((item: any) => {
        if (item.product.ownerId === partnerId) {
          productRevenueMap[item.productId] = (productRevenueMap[item.productId] || 0) + item.total
        }
      })
    })

    const topProducts = Object.entries(productRevenueMap)
      .map(([productId, revenue]) => {
        const product = partnerProducts.find((p: any) => p.id === productId)
        return {
          id: productId,
          name: product?.name || 'Unknown Product',
          category: product?.category || 'Unknown',
          revenue,
        }
      })
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)

    const salesChartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const value = Math.floor(Math.random() * 5000000) + 1000000
      return {
        day: date.toLocaleDateString('id-ID', { weekday: 'short' }).replace('.', ''),
        date: date.toISOString().split('T')[0],
        value,
      }
    })

    return NextResponse.json({
      totalSales: formatRupiah(totalSalesValue),
      activeOrdersCount,
      activeProductsCount,
      lowStockProductsCount,
      recentOrders,
      topProducts,
      salesChartData,
    })
  } catch (error) {
    console.error('Error fetching partner dashboard data:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
