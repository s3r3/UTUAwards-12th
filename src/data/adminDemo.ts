// Fallback demo data for admin console when API is unreachable/empty.
// Mirrors partnerDemo.ts style so admin pages render nicely offline.

export const adminFallbackOrders = [
  { id: 'cm_demo_1', status: 'PENDING', total: 42500000, createdAt: new Date().toISOString(), user: { name: 'PT Nusantara Foods', email: 'ops@nusantara.id' }, items: [{ name: 'Kopi Arabika Gayo', quantity: 5, price: 8500000 }] },
  { id: 'cm_demo_2', status: 'PAID', total: 18400000, createdAt: new Date().toISOString(), user: { name: 'CV Bahari Sejahtera', email: 'halo@bahari.id' }, items: [{ name: 'Tuna Frozen', quantity: 2, price: 9200000 }] },
  { id: 'cm_demo_3', status: 'PROCESSING', total: 7500000, createdAt: new Date().toISOString(), user: { name: 'PT Aceh Food Supply', email: 'admin@acehfood.id' }, items: [{ name: 'Minyak Nilam', quantity: 1, price: 7500000 }] },
]

export const adminFallbackProducts = [
  { id: 'p_demo_1', name: 'Kopi Arabika Gayo', owner: { id: 'u1', name: 'Kopi Gayo Mandiri', email: 'partner@acelora.id' }, category: 'COFFEE', date: '18 Sep', status: 'APPROVED' },
  { id: 'p_demo_2', name: 'Virgin Coconut Oil', owner: { id: 'u1', name: 'Kopi Gayo Mandiri', email: 'partner@acelora.id' }, category: 'PROCESSED', date: '15 Sep', status: 'PENDING' },
  { id: 'p_demo_3', name: 'Tuna Frozen', owner: { id: 'u2', name: 'Bahari Sejahtera', email: 'halo@bahari.id' }, category: 'SEAFOOD', date: '17 Sep', status: 'REVIEW' },
]

export const adminFallbackUsers = [
  { id: 'u_demo_1', name: 'Ahmad Fauzan', email: 'ahmad@example.com', role: 'USER', products: 5, createdAt: new Date().toISOString() },
  { id: 'u_demo_2', name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'USER', products: 3, createdAt: new Date().toISOString() },
  { id: 'u_demo_3', name: 'Admin Acelora', email: 'admin@acelora.id', role: 'ADMIN', products: 0, createdAt: new Date().toISOString() },
  { id: 'u_demo_4', name: 'Kopi Gayo Mandiri', email: 'partner@acelora.id', role: 'PARTNER', products: 4, createdAt: new Date().toISOString() },
]

export const adminFallbackPartners = [
  { id: 'm_demo_1', name: 'Kopi Gayo Mandiri', owner: 'Rahmat Hidayat', category: 'Coffee Producer', location: 'Aceh Tengah', status: 'VERIFIED', orders: 48, revenue: 98400000 },
  { id: 'm_demo_2', name: 'Bahari Sejahtera', owner: 'Cut Mala', category: 'Seafood', location: 'Aceh Besar', status: 'PENDING', orders: 24, revenue: 74200000 },
  { id: 'm_demo_3', name: 'Nilam Aceh Selatan', owner: 'Teuku Rizal', category: 'Patchouli', location: 'Aceh Selatan', status: 'REVIEW', orders: 18, revenue: 51000000 },
]

export const adminFallbackNotifications = [
  { id: 'n1', title: 'Pesanan baru #ACL-10293', desc: 'PT Nusantara Foods memesan 500 kg Kopi Arabika Gayo.', date: '5 mnt lalu', unread: true },
  { id: 'n2', title: 'Produk menunggu approval', desc: 'Virgin Coconut Oil diajukan oleh Kopi Gayo Mandiri.', date: '1 jam lalu', unread: true },
  { id: 'n3', title: 'Mitra baru mendaftar', desc: 'Nilam Aceh Selatan mengajukan verifikasi bisnis.', date: '3 jam lalu', unread: false },
]

export function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`
}
