export const partnerStore = {
  name: 'Kopi Gayo Mandiri',
  status: 'Verified Partner',
  location: 'Aceh Tengah, Aceh',
  owner: 'Rahmat Hidayat',
  email: 'partner@acelora.id',
  phone: '+62 812 4567 8890',
  website: 'kopigayomandiri.id',
  category: 'Coffee Producer',
  description: 'Produsen kopi Arabika Gayo dari dataran tinggi Aceh Tengah dengan jaringan petani binaan dan kapasitas B2B.',
  capacity: '500 kg / bulan',
  availableCapacity: '180 kg',
  moq: '100 kg',
  leadTime: '3–5 hari',
  distribution: ['Aceh', 'Sumatra', 'Jawa'],
}

export const partnerActions = [
  { label: '3 pesanan perlu diproses', href: '/partner/pesanan?status=PENDING', tone: 'amber' },
  { label: '2 produk menunggu review', href: '/partner/produk?status=PENDING', tone: 'ocean' },
  { label: '4 produk stok menipis', href: '/partner/inventori?status=low', tone: 'rose' },
  { label: '1 informasi toko perlu diperbarui', href: '/partner/toko', tone: 'emerald' },
]

export const partnerSales = [
  { day: 'Sen', date: '2026-09-14', value: 2850000 },
  { day: 'Sel', date: '2026-09-15', value: 3150000 },
  { day: 'Rab', date: '2026-09-16', value: 2600000 },
  { day: 'Kam', date: '2026-09-17', value: 4250000 },
  { day: 'Jum', date: '2026-09-18', value: 3850000 },
  { day: 'Sab', date: '2026-09-19', value: 5200000 },
  { day: 'Min', date: '2026-09-20', value: 4950000 },
]

export const partnerProducts = [
  { id: 'kopi-arabika-gayo', name: 'Kopi Arabika Gayo', category: 'Coffee', price: 120000, stock: 420, moq: 100, status: 'Active', updated: '2026-09-18', sold: '1.240 kg', revenue: 98400000, views: 4820, orders: 48, capacity: 500, committed: 320, origin: 'Aceh Tengah' },
  { id: 'tuna-frozen', name: 'Tuna Frozen', category: 'Seafood', price: 92000, stock: 180, moq: 200, status: 'Active', updated: '2026-09-17', sold: '820 kg', revenue: 74200000, views: 3210, orders: 24, capacity: 300, committed: 210, origin: 'Aceh Besar' },
  { id: 'minyak-nilam-aceh', name: 'Minyak Nilam Aceh', category: 'Patchouli', price: 150000, stock: 85, moq: 25, status: 'Active', updated: '2026-09-16', sold: '340 kg', revenue: 51000000, views: 2104, orders: 18, capacity: 120, committed: 75, origin: 'Aceh Selatan' },
  { id: 'virgin-coconut-oil', name: 'Virgin Coconut Oil', category: 'Processed', price: 75000, stock: 8, moq: 50, status: 'Pending Approval', updated: '2026-09-15', sold: '120 kg', revenue: 9000000, views: 980, orders: 5, capacity: 180, committed: 172, origin: 'Aceh Barat' },
  { id: 'kayu-manis-aceh', name: 'Kayu Manis Aceh', category: 'Spices', price: 28000, stock: 0, moq: 100, status: 'Draft', updated: '2026-09-14', sold: '90 kg', revenue: 2520000, views: 720, orders: 3, capacity: 250, committed: 250, origin: 'Aceh Barat' },
]

export const partnerOrders = [
  { id: '#ACL-10293', buyer: 'PT Nusantara Foods', region: 'Jakarta Selatan', product: 'Kopi Arabika Gayo', quantity: '500 kg', total: 42500000, payment: 'Paid', status: 'Diproses', date: '18 Sep' },
  { id: '#ACL-10292', buyer: 'CV Bahari Sejahtera', region: 'Medan', product: 'Tuna Frozen', quantity: '200 kg', total: 18400000, payment: 'Paid', status: 'Siap Dikirim', date: '17 Sep' },
  { id: '#ACL-10291', buyer: 'PT Aceh Food Supply', region: 'Banda Aceh', product: 'Minyak Nilam Aceh', quantity: '50 kg', total: 7500000, payment: 'Pending', status: 'Baru', date: '16 Sep' },
  { id: '#ACL-10290', buyer: 'PT Nusantara Foods', region: 'Jakarta Selatan', product: 'Kopi Arabika Gayo', quantity: '300 kg', total: 25500000, payment: 'Paid', status: 'Dikirim', date: '15 Sep' },
  { id: '#ACL-10289', buyer: 'Kafe Aroma Gayo', region: 'Banda Aceh', product: 'Kopi Arabika Gayo', quantity: '100 kg', total: 12000000, payment: 'Paid', status: 'Selesai', date: '14 Sep' },
  { id: '#ACL-10288', buyer: 'UD Rempah Nusa', region: 'Surabaya', product: 'Kayu Manis Aceh', quantity: '250 kg', total: 7000000, payment: 'Paid', status: 'Selesai', date: '13 Sep' },
  { id: '#ACL-10287', buyer: 'PT Segar Maritim', region: 'Jakarta Utara', product: 'Tuna Frozen', quantity: '400 kg', total: 36800000, payment: 'Paid', status: 'Dikirim', date: '12 Sep' },
  { id: '#ACL-10286', buyer: 'CV Organik Lestari', region: 'Yogyakarta', product: 'Virgin Coconut Oil', quantity: '50 kg', total: 3750000, payment: 'Pending', status: 'Baru', date: '11 Sep' },
  { id: '#ACL-10285', buyer: 'PT Aroma Esensial', region: 'Bandung', product: 'Minyak Nilam Aceh', quantity: '25 kg', total: 3750000, payment: 'Paid', status: 'Selesai', date: '10 Sep' },
  { id: '#ACL-10284', buyer: 'Toko Barokah Jaya', region: 'Medan', product: 'Kayu Manis Aceh', quantity: '150 kg', total: 4200000, payment: 'Paid', status: 'Dibatalkan', date: '09 Sep' },
]

export const partnerCampaigns = [
  { id: 'CMP-01', name: 'Panen Raya Gayo 9.9', type: 'Flash Sale', status: 'Berjalan', discount: '15% hingga Rp 500rb', period: '09 – 12 Sep 2026', products: 3, views: 8420, orders: 62, revenue: 38400000 },
  { id: 'CMP-02', name: 'Ekspor Nilam Batch #4', type: 'Pre-order B2B', status: 'Terjadwal', discount: 'Gratis QC + COA', period: '22 – 30 Sep 2026', products: 1, views: 1930, orders: 0, revenue: 0 },
  { id: 'CMP-03', name: 'Seafood Cold-Chain Week', type: 'Bundel', status: 'Berjalan', discount: 'Beli 300kg gratis 20kg', period: '15 – 21 Sep 2026', products: 2, views: 5110, orders: 21, revenue: 41200000 },
  { id: 'CMP-04', name: 'Lebaran Rempah 2026', type: 'Voucher', status: 'Selesai', discount: 'Rp 250rb min. 100kg', period: '10 – 28 Agu 2026', products: 4, views: 6240, orders: 48, revenue: 29800000 },
]

export const partnerPromos = [
  { id: 'PRM-01', name: 'Diskon Grosir Kopi ≥300kg', detail: 'Potongan 8% otomatis untuk pembelian Kopi Arabika Gayo ≥ 300 kg', status: 'Aktif', usage: '128/500', period: 'Berlaku s/d 30 Sep 2026' },
  { id: 'PRM-02', name: 'Gratis Ongkir Cold-Chain Jawa', detail: 'Subsidi ongkir Rp 1,2 jt untuk Tuna Frozen tujuan Pulau Jawa', status: 'Aktif', usage: '64/200', period: 'Berlaku s/d 21 Sep 2026' },
  { id: 'PRM-03', name: 'Cashback Nilam 5%', detail: 'Cashback 5% untuk repeat order Minyak Nilam dalam 30 hari', status: 'Draf', usage: '0/100', period: 'Belum dijadwalkan' },
]

export const partnerVouchers = [
  { code: 'GAYO500', desc: 'Potongan Rp 500rb, min. belanja Rp 5jt', quota: 'Terpakai 86/200', status: 'Aktif', expiry: '30 Sep 2026' },
  { code: 'NILAM100', desc: 'Potongan Rp 100rb, min. belanja Rp 1jt', quota: 'Terpakai 41/150', status: 'Aktif', expiry: '30 Sep 2026' },
  { code: 'TUNA12', desc: 'Diskon 12% Tuna Frozen, maks. Rp 2jt', quota: 'Terpakai 112/150', status: 'Hampir habis', expiry: '21 Sep 2026' },
  { code: 'MITRAbaru', desc: 'Diskon 10% untuk pembeli B2B pertama', quota: 'Terpakai 23/100', status: 'Aktif', expiry: '31 Okt 2026' },
]

export const partnerBundles = [
  { id: 'BND-01', name: 'Paket Roastery Starter', items: 'Kopi Arabika Gayo 100kg + Kayu Manis 25kg', price: 12700000, normalPrice: 14200000, sold: 18, status: 'Aktif' },
  { id: 'BND-02', name: 'Paket Cold-Chain Hemat', items: 'Tuna Frozen 200kg + VCO 20kg', price: 19200000, normalPrice: 21400000, sold: 9, status: 'Aktif' },
]

export const partnerCustomers = [
  { company: 'PT Nusantara Foods', region: 'Jakarta', orders: 12, revenue: 128400000, lastOrder: '18 Sep', products: 'Kopi Arabika Gayo, Minyak Nilam Aceh' },
  { company: 'CV Bahari Sejahtera', region: 'Sumatra Utara', orders: 8, revenue: 74200000, lastOrder: '17 Sep', products: 'Tuna Frozen' },
  { company: 'PT Aceh Food Supply', region: 'Aceh', orders: 5, revenue: 43800000, lastOrder: '16 Sep', products: 'Kopi Arabika Gayo' },
]

export const partnerNotifications = [
  { category: 'Orders', title: 'NEW ORDER', message: 'PT Nusantara Foods placed a new order.', time: '5 min ago', unread: true },
  { category: 'Products', title: 'PRODUCT APPROVED', message: 'Kopi Arabika Gayo has been approved.', time: '1 hour ago', unread: true },
  { category: 'Inventory', title: 'LOW STOCK', message: 'Virgin Coconut Oil is below minimum stock.', time: '3 hours ago', unread: false },
]

export const partnerMessages = [
  { buyer: 'PT Nusantara Foods', subject: 'Regarding Order #ACL-10293', preview: 'Can we schedule shipment for Monday?', time: '10:24' },
  { buyer: 'CV Bahari Sejahtera', subject: 'Question about MOQ', preview: 'Is 150 kg possible for the first order?', time: 'Yesterday' },
]

export const partnerPayouts = [
  { id: '#PAY-001', amount: 24500000, status: 'Paid', date: '18 Sep' },
  { id: '#PAY-002', amount: 18200000, status: 'Pending', date: '15 Sep' },
]

export function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`
}
