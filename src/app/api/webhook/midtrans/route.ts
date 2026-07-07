import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { core } from '@/lib/midtrans'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // Verify notification with Midtrans
    const statusResponse = await core.transaction.notification(body)
    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    if (!orderId) return NextResponse.json({ error: 'No orderId' }, { status: 400 })

    let newStatus: string | null = null

    // Map Midtrans status to our order status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || fraudStatus === null) {
        newStatus = 'PAID'
      }
    } else if (transactionStatus === 'pending') {
      newStatus = 'PENDING'
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      newStatus = 'CANCELLED'
    }

    if (newStatus === 'PAID') {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (order && order.status !== 'PAID') {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID', paidAt: new Date() },
        })

        // Decrement stock
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }
    } else if (newStatus) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus as any },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Midtrans notification error:', error)
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 })
  }
}
