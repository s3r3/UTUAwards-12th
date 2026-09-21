// Fallback demo data for user member area when API is unreachable/empty.

export const userFallbackNotifications = [
  { id: '1', title: 'Pesanan Dikirim', desc: 'Pesanan #ORD-12345 sedang dalam perjalanan.', date: '2 jam lalu', unread: true, type: 'order' },
  { id: '2', title: 'Pembayaran Berhasil', desc: 'Pembayaran untuk #ORD-12344 telah diverifikasi.', date: '1 hari lalu', unread: false, type: 'payment' },
  { id: '3', title: 'Produk Favorit Kembali', desc: 'Kopi Arabika Gayo Specialty telah hadir kembali!', date: '2 hari lalu', unread: false, type: 'product' },
]

export const userFallbackAddresses = [
  { id: 'a1', label: 'Rumah', name: 'Ahmad Fauzan', phone: '+62 812 0000 1111', street: 'Jl. Merdeka No. 10', city: 'Banda Aceh', province: 'Aceh', postalCode: '23111', isDefault: true },
  { id: 'a2', label: 'Kantor', name: 'Ahmad Fauzan', phone: '+62 812 0000 1111', street: 'Jl. Sudirman Kav. 5', city: 'Medan', province: 'Sumatera Utara', postalCode: '20111', isDefault: false },
]

export const userFallbackReviews = [
  { id: 'r1', productName: 'Kopi Arabika Gayo', rating: 5, comment: 'Aromanya kuat, pengiriman cepat.', createdAt: new Date().toISOString() },
  { id: 'r2', productName: 'Tuna Frozen', rating: 4, comment: 'Segar, packing rapi.', createdAt: new Date().toISOString() },
]

export const userHelpFaqs = [
  { q: 'Bagaimana cara melacak pesanan?', a: 'Buka Pesanan Saya, pilih pesanan, lalu lihat status dan riwayat pengiriman di halaman detail.' },
  { q: 'Bagaimana cara mengubah alamat pengiriman?', a: 'Buka menu Alamat, tambah alamat baru lalu tandai sebagai default sebelum checkout.' },
  { q: 'Apakah wishlist tersimpan di akun?', a: 'Wishlist tersimpan di perangkat ini. Masuk agar tersinkron saat ganti perangkat (segera hadir).' },
  { q: 'Bagaimana cara memberi ulasan?', a: 'Buka Ulasan Saya setelah pesanan DELIVERED, lalu tulis rating dan komentar untuk produk.' },
  { q: 'Bagaimana menjadi mitra?', a: 'Kunjungi halaman Menjadi Mitra, isi formulir, tim kami akan verifikasi dalam 1–3 hari kerja.' },
]
