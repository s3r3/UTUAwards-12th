import Midtrans from 'midtrans-client'

const isProduction = process.env.NODE_ENV === 'production'

export const snap = new Midtrans.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export const core = new Midtrans.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export function getPaymentMethods(): { id: string; label: string; icon: string }[] {
  return [
    { id: 'qris', label: 'QRIS', icon: 'qris' },
    { id: 'bca_va', label: 'BCA Virtual Account', icon: 'bank' },
    { id: 'mandiri_va', label: 'Mandiri Virtual Account', icon: 'bank' },
    { id: 'bri_va', label: 'BRI Virtual Account', icon: 'bank' },
    { id: 'bni_va', label: 'BNI Virtual Account', icon: 'bank' },
    { id: 'alfamart', label: 'Alfamart', icon: 'store' },
    { id: 'indomaret', label: 'Indomaret', icon: 'store' },
  ]
}
