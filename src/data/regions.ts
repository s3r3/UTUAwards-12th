export interface Region {
  id: string
  name: string
  nameEn: string
  type: 'fishing' | 'agriculture'
  lat: number
  lng: number
  village: string
  district: string
  description: { id: string; en: string }
  products: { id: string; en: string }[]
  season: { id: string; en: string }
  news: { title: { id: string; en: string }; date: string; excerpt: { id: string; en: string } }[]
}

export const regions: Region[] = [
  {
    id: 'aceh-utara',
    name: 'Aceh Utara',
    nameEn: 'North Aceh',
    type: 'fishing',
    lat: 5.2,
    lng: 97.1,
    village: 'Lhokseumawe',
    district: 'Aceh Utara',
    description: {
      id: 'Perairan selat Malaya kaya akan ikan tuna, cakalang, dan udang. Nelayan lokal menghasilkan hasil tangkapan segar setiap pagi.',
      en: 'The Strait of Malacca waters are rich in tuna, skipjack tuna, and shrimp. Local fishermen produce fresh catches every morning.',
    },
    products: [
      { id: 'Ikan Tuna', en: 'Tuna' },
      { id: 'Cakalang', en: 'Skipjack Tuna' },
      { id: 'Udang', en: 'Shrimp' },
      { id: 'Kerapu', en: 'Grouper' },
    ],
    season: {
      id: 'Musim Barat (Desember–Maret): Ikan Tuna & Cakalang',
      en: 'West Season (December–March): Tuna & Skipjack',
    },
    news: [
      { title: { id: 'Nelayan Lhokseumawe Raup Untung dari Musim Ikan Tuna', en: 'Lhokseumawe Fishermen Profit from Tuna Season' }, date: '2026-08-15', excerpt: { id: 'Produksi tuna meningkat 30% dibanding musim sebelumnya.', en: 'Tuna production increased 30% compared to previous season.' } },
      { title: { id: 'Pemerintah Dukung Pengembangan Budidaya Udang', en: 'Government Supports Shrimp Farming Development' }, date: '2026-08-10', excerpt: { id: 'Program pengembangan tambak udang di Aceh Utara mendapatkan dana pemerintah.', en: 'Shrimp farming development program in North Aceh receives government funding.' } },
    ],
  },
  {
    id: 'aceh-tengah',
    name: 'Aceh Tengah',
    nameEn: 'Central Aceh',
    type: 'agriculture',
    lat: 4.0,
    lng: 96.8,
    village: 'Takengon',
    district: 'Aceh Tengah',
    description: {
      id: 'Dataran tinggi Gayo dengan tanah vulkanik subur. Tempat kelahiran kopi Gayo dunia dan cengkeh premium.',
      en: 'Gayo highlands with fertile volcanic soil. The birthplace of world-famous Gayo coffee and premium cloves.',
    },
    products: [
      { id: 'Kopi Gayo Arabica', en: 'Gayo Arabica Coffee' },
      { id: 'Cengkeh', en: 'Cloves' },
      { id: 'Sayuran Organik', en: 'Organic Vegetables' },
    ],
    season: {
      id: 'Musim Panen (Juli–September): Kopi Gayo & Cengkeh',
      en: 'Harvest Season (July–September): Gayo Coffee & Cloves',
    },
    news: [
      { title: { id: 'Kopi Gayo Arabika Raup Harga Tinggi di Pasar Internasional', en: 'Gayo Arabica Coffee Commands High Prices in International Market' }, date: '2026-08-20', excerpt: { id: 'Ekspor kopi Gayo naik 25% tahun ini.', en: 'Gayo coffee exports up 25% this year.' } },
      { title: { id: 'Petani Gayo Terapkan Pertanian Organik', en: 'Gayo Farmers Adopt Organic Farming' }, date: '2026-08-12', excerpt: { id: 'Program sertifikasi organik untuk meningkatkan kualitas dan harga jual.', en: 'Organic certification program to improve quality and selling price.' } },
    ],
  },
  {
    id: 'aceh-selatan',
    name: 'Aceh Selatan',
    nameEn: 'South Aceh',
    type: 'agriculture',
    lat: 3.2,
    lng: 97.3,
    village: 'Tapaktuan',
    district: 'Aceh Selatan',
    description: {
      id: 'Lahan subur untuk perkebunan kakao dan kelapa. Kakao Aceh dikenal dengan rasa khas yang dihargai pembuat cokelat premium.',
      en: 'Fertile land for cocoa and coconut plantations. Aceh cocoa is known for its distinctive flavor prized by premium chocolate makers.',
    },
    products: [
      { id: 'Kakao Aceh', en: 'Aceh Cacao' },
      { id: 'Kelapa', en: 'Coconut' },
      { id: 'Cokelat Craft', en: 'Craft Chocolate' },
    ],
    season: {
      id: 'Musim Panen (Oktober–Desember): Kakao & Kelapa',
      en: 'Harvest Season (October–December): Cacao & Coconut',
    },
    news: [
      { title: { id: 'Kakao Aceh Masuki Pasar Eropa', en: 'Aceh Cacao Enters European Market' }, date: '2026-08-18', excerpt: { id: 'Ekspor kakao Aceh ke Belanda dan Belgia meningkat.', en: 'Aceh cacao exports to Netherlands and Belgium increasing.' } },
      { title: { id: 'Petani Tapaktuan Adopsi Teknologi Pengering Cokelat', en: 'Tapaktuan Farmers Adopt Chocolate Drying Technology' }, date: '2026-08-05', excerpt: { id: 'Teknologi baru meningkatkan kualitas dan stabilitas harga.', en: 'New technology improves quality and price stability.' } },
    ],
  },
  {
    id: 'aceh-besar',
    name: 'Kota Banda Aceh',
    nameEn: 'Banda Aceh City',
    type: 'fishing',
    lat: 5.5,
    lng: 95.3,
    village: 'Ulee Lheue',
    district: 'Banda Aceh',
    description: {
      id: 'Pelabuhan utama perikanan Aceh. Ikan segar langsung dari laut sampai ke dapur dalam hitungan jam.',
      en: "Aceh's main fishing port. Fresh fish from sea to kitchen within hours.",
    },
    products: [
      { id: 'Ikan Segar', en: 'Fresh Fish' },
      { id: 'Gurita', en: 'Octopus' },
      { id: 'Cumi-Cumi', en: 'Squid' },
      { id: 'Kerang', en: 'Shellfish' },
    ],
    season: {
      id: 'Sepanjang tahun: Ikan Segar & Seafood',
      en: 'Year-round: Fresh Fish & Seafood',
    },
    news: [
      { title: { id: 'Pelabuhan Ulee Lheue Modifikasi untuk Peningkatan Kapasitas', en: 'Ulee Lheue Port Upgraded for Capacity Increase' }, date: '2026-08-22', excerpt: { id: 'Pemerintah kota investasi Rp5M untuk pelabuhan modern.', en: 'City government invests Rp5M for modern port.' } },
      { title: { id: 'UMKM Seafood Banda Aceh Ekspor ke Malaysia', en: 'Banda Aceh Seafood SMEs Export to Malaysia' }, date: '2026-08-08', excerpt: { id: 'Produk olahan seafood mulai masuk pasar ASEAN.', en: 'Processed seafood products entering ASEAN market.' } },
    ],
  },
  {
    id: 'aceh-timur',
    name: 'Aceh Timur',
    nameEn: 'East Aceh',
    type: 'fishing',
    lat: 4.8,
    lng: 97.9,
    village: 'Idi Rayeuk',
    district: 'Aceh Timur',
    description: {
      id: 'Tambak udang vannamei modern dengan standar export. Produk bebas antibiotik dan berkualitas tinggi.',
      en: 'Modern vannamei shrimp ponds with export standards. Antibiotic-free, high-quality products.',
    },
    products: [
      { id: 'Udang Vannamei', en: 'Vannamei Shrimp' },
      { id: 'Ikan Lele', en: 'Catfish' },
      { id: 'Patin', en: 'Pangasius' },
    ],
    season: {
      id: 'Musim Timur (April–Agustus): Udang Vannamei',
      en: 'East Season (April–August): Vannamei Shrimp',
    },
    news: [
      { title: { id: 'Tambak Udang Vannamei di Aceh Timur Capai Produksi Record', en: 'Vannamei Shrimp Ponds in East Aceh Hit Record Production' }, date: '2026-08-21', excerpt: { id: 'Output produksi naik 40% tahun ini.', en: 'Production output up 40% this year.' } },
      { title: { id: 'Sertifikasi Halal untuk Produk Perikanan Aceh Timur', en: 'Halal Certification for East Aceh Fishery Products' }, date: '2026-08-14', excerpt: { id: 'Produk perikanan mendapatkan sertifikasi halal MUI.', en: 'Fishery products receive MUI halal certification.' } },
    ],
  },
  {
    id: 'aceh-barat',
    name: 'Aceh Barat',
    nameEn: 'West Aceh',
    type: 'agriculture',
    lat: 4.4,
    lng: 96.2,
    village: 'Meulaboh',
    district: 'Aceh Barat',
    description: {
      id: 'Wilayah pesisir dengan pertanian campuran. Kemiri dan lada hitam Aceh terkenal di pasar domestik dan internasional.',
      en: 'Coastal region with mixed agriculture. Aceh candlenut and black pepper are famous in domestic and international markets.',
    },
    products: [
      { id: 'Lada Hitam Aceh', en: 'Aceh Black Pepper' },
      { id: 'Kemiri', en: 'Candlenut' },
      { id: 'Cabe Rawit', en: "Bird's Eye Chili" },
    ],
    season: {
      id: 'Musim Panen (Agustus–Oktober): Lada Hitam & Kemiri',
      en: 'Harvest Season (August–October): Black Pepper & Candlenut',
    },
    news: [
      { title: { id: 'Lada Hitam Aceh Mendapat Harga Tertinggi di Pasar Dunia', en: 'Aceh Black Pepper Gets Highest Price in World Market' }, date: '2026-08-19', excerpt: { id: 'Ekspor lada Aceh ke Eropa dan Amerika meningkat.', en: 'Aceh pepper exports to Europe and America increasing.' } },
      { title: { id: 'Petani Aceh Barat Gelar Festival Kemiri', en: 'West Aceh Farmers Hold Candlenut Festival' }, date: '2026-08-11', excerpt: { id: 'Festival untuk promosikan kemiri Aceh sebagai produk unggulan.', en: 'Festival to promote Aceh candlenut as a flagship product.' } },
    ],
  },
  {
    id: 'pulau-weh',
    name: 'Pulau Weh',
    nameEn: 'Weh Island',
    type: 'fishing',
    lat: 5.9,
    lng: 95.3,
    village: 'Iboih',
    district: 'Sabang',
    description: {
      id: 'Pulau ujung barat Indonesia. Air laut jernih dan kehidupan laut yang kaya — rumah bagi terumbu karang terbaik.',
      en: 'The westernmost island of Indonesia. Crystal clear waters and rich marine life — home to the best coral reefs.',
    },
    products: [
      { id: 'Ikan Pari', en: 'Stingray' },
      { id: 'Lobster', en: 'Lobster' },
      { id: 'Kerang Abalone', en: 'Abalone' },
    ],
    season: {
      id: 'Sepanjang tahun: Lobster & Seafood Premium',
      en: 'Year-round: Lobster & Premium Seafood',
    },
    news: [
      { title: { id: 'Lobster Sabang Ekspor ke Singapura dan Jepang', en: 'Sabang Lobster Exports to Singapore and Japan' }, date: '2026-08-23', excerpt: { id: 'Harga lobster naik 20% di pasar internasional.', en: 'Lobster prices up 20% in international market.' } },
      { title: { id: 'Wisata Ekowisata Pulau Weh Dorong Ekonomi Lokal', en: 'Weh Island Ecotourism Boosts Local Economy' }, date: '2026-08-09', excerpt: { id: 'Program ekowisata berikan lapangan kerja bagi nelayan lokal.', en: 'Ecotourism program provides jobs for local fishermen.' } },
    ],
  },
  {
    id: 'gayo',
    name: 'Gayo Highlands',
    nameEn: 'Gayo Highlands',
    type: 'agriculture',
    lat: 4.2,
    lng: 97.3,
    village: 'Blangkejeren',
    district: 'Gayo Lues',
    description: {
      id: 'Pegunungan di ketinggian 1.200–1.600 mdpl. Iklim sejuk dan tanah vulkanik menciptakan kopi Gayo dengan karakter unik.',
      en: 'Mountains at 1,200–1,600 masl. Cool climate and volcanic soil create uniquely characterful Gayo coffee.',
    },
    products: [
      { id: 'Kopi Gayo Grade 1', en: 'Gayo Grade 1 Coffee' },
      { id: 'Cengkeh', en: 'Cloves' },
      { id: 'Teh Highland', en: 'Highland Tea' },
    ],
    season: {
      id: 'Musim Panen (Juni–Agustus): Kopi Gayo Grade 1',
      en: 'Harvest Season (June–August): Gayo Grade 1 Coffee',
    },
    news: [
      { title: { id: 'Kopi Gayo Raih Penghargaan Specialty Coffee International', en: 'Gayo Coffee Wins Specialty Coffee International Award' }, date: '2026-08-24', excerpt: { id: 'Kopi Gayo masuk daftar 10 kopi terbaik dunia.', en: 'Gayo coffee enters list of top 10 coffees in the world.' } },
      { title: { id: 'Kebun Kopi Gayo Dikembangkan dengan Metode Shade-Grown', en: 'Gayo Coffee Farms Developed with Shade-Grown Method' }, date: '2026-08-13', excerpt: { id: 'Metode baru meningkatkan kualitas rasa dan keberlanjutan.', en: 'New method improves flavor quality and sustainability.' } },
    ],
  },
]

export function getRegionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id)
}

export function getRegionsByType(type: 'fishing' | 'agriculture'): Region[] {
  return regions.filter((r) => r.type === type)
}
