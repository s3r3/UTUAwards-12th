export type AcehRegency = {
  name: string
  districts: string[]
}

export type AcehLocation = {
  province: string
  regencies: AcehRegency[]
}

export const ACEH_LOCATIONS: AcehLocation[] = [
  {
    province: 'Aceh',
    regencies: [
      {
        name: 'Kota Banda Aceh',
        districts: ['Baiturrahman', 'Banda Raya', 'Jaya Baru', 'Kuta Alam', 'Kuta Raja', 'Lueng Bata', 'Meuraxa', 'Syiah Kuala', 'Ulee Kareng'],
      },
      {
        name: 'Kabupaten Aceh Besar',
        districts: ['Baitussalam', 'Darul Imarah', 'Darul Kamal', 'Darussalam', 'Indrapuri', 'Ingin Jaya', 'Krueng Barona Jaya', 'Kuta Baro', 'Lhoong', 'Lembah Seulawah', 'Leupung', 'Lhoknga', 'Mesjid Raya', 'Montasik', 'Peukan Bada', 'Pulo Aceh', 'Seulimeum', 'Simpang Tiga', 'Suka Makmur'],
      },
      {
        name: 'Kota Sabang',
        districts: ['Sukajaya', 'Sukakarya'],
      },
      {
        name: 'Kabupaten Pidie',
        districts: ['Batee', 'Delima', 'Geumpang', 'Glumpang Tiga', 'Grong Grong', 'Indrajaya', 'Keumala', 'Kembang Tanjong', 'Kota Sigli', 'Mane', 'Mila', 'Muara Tiga', 'Mutiara', 'Mutiara Timur', 'Padang Tiji', 'Peukan Baro', 'Pidie', 'Sakti', 'Simpang Tiga', 'Tangse', 'Tiro', 'Titeue'],
      },
      {
        name: 'Kabupaten Pidie Jaya',
        districts: ['Bandar Dua', 'Bandar Baru', 'Jangka Buya', 'Meureudu', 'Meurah Dua', 'Panteraja', 'Trienggadeng', 'Ulim'],
      },
      {
        name: 'Kabupaten Bireuen',
        districts: ['Gandapura', 'Jangka', 'Jeumpa', 'Jeunieb', 'Juli', 'Kota Juang', 'Kuala', 'Kuta Blang', 'Makmur', 'Pandrah', 'Peudada', 'Peulimbang', 'Peusangan', 'Peusangan Selatan', 'Peusangan Siblah Krueng', 'Samalanga', 'Simpang Mamplam'],
      },
      {
        name: 'Kota Lhokseumawe',
        districts: ['Banda Sakti', 'Blang Mangat', 'Muara Dua', 'Muara Satu'],
      },
      {
        name: 'Kabupaten Aceh Utara',
        districts: ['Baktiya', 'Baktiya Barat', 'Banda Baro', 'Cot Girek', 'Dewantara', 'Geureudong Pase', 'Kuta Makmur', 'Langkahan', 'Lapang', 'Lhoksukon', 'Matangkuli', 'Meurah Mulia', 'Muara Batu', 'Nibong', 'Nisam', 'Nisam Antara', 'Paya Bakong', 'Pirak Timu', 'Samudera', 'Sawang', 'Seunuddon', 'Simpang Keramat', 'Syamtalira Aron', 'Syamtalira Bayu', 'Tanah Jambo Aye', 'Tanah Luas', 'Tanah Pasir'],
      },
      {
        name: 'Kabupaten Aceh Timur',
        districts: ['Banda Alam', 'Birem Bayeun', 'Darul Aman', 'Darul Falah', 'Darul Ihsan', 'Idi Rayeuk', 'Idi Timur', 'Idi Tunong', 'Indra Makmur', 'Julok', 'Madat', 'Nurussalam', 'Pante Bidari', 'Peudawa', 'Peunaron', 'Peureulak', 'Peureulak Barat', 'Peureulak Timur', 'Rantau Selamat', 'Rantau Peureulak', 'Serbajadi', 'Simpang Jernih', 'Simpang Ulim', 'Sungai Raya'],
      },
      {
        name: 'Kota Langsa',
        districts: ['Langsa Barat', 'Langsa Baro', 'Langsa Kota', 'Langsa Lama', 'Langsa Timur'],
      },
      {
        name: 'Kabupaten Aceh Tamiang',
        districts: ['Banda Mulia', 'Bandar Pusaka', 'Bendahara', 'Karang Baru', 'Kejuruan Muda', 'Kota Kualasimpang', 'Manyak Payed', 'Rantau', 'Sekerak', 'Seruway', 'Tamiang Hulu', 'Tenggulun'],
      },
      {
        name: 'Kabupaten Aceh Tengah',
        districts: ['Atu Lintang', 'Bebesen', 'Bies', 'Bintang', 'Celala', 'Jagong Jeget', 'Kebayakan', 'Ketol', 'Kute Panang', 'Laut Tawar', 'Linge', 'Lut Tawar', 'Pegasing', 'Rusip Antara', 'Silih Nara'],
      },
      {
        name: 'Kabupaten Bener Meriah',
        districts: ['Bandar', 'Bukit', 'Gajah Putih', 'Mesidah', 'Permata', 'Pintu Rime Gayo', 'Syiah Utama', 'Timang Gajah', 'Wih Pesam'],
      },
      {
        name: 'Kabupaten Gayo Lues',
        districts: ['Blangkejeren', 'Blang Pegayon', 'Dabun Gelang', 'Kuta Panjang', 'Pantan Cuaca', 'Pining', 'Putri Betung', 'Rikit Gaib', 'Terangun', 'Tripe Jaya'],
      },
      {
        name: 'Kabupaten Aceh Tenggara',
        districts: ['Babussalam', 'Badar', 'Bambel', 'Babul Makmur', 'Babul Rahmah', 'Bukit Tusam', 'Darul Hasanah', 'Deleng Pokhkisen', 'Ketambe', 'Lawe Alas', 'Lawe Bulan', 'Lawe Sigala-Gala', 'Lawe Sumur', 'Leuser', 'Semadam', 'Tanoh Alas'],
      },
      {
        name: 'Kabupaten Aceh Selatan',
        districts: ['Bakongan', 'Bakongan Timur', 'Kluet Selatan', 'Kluet Tengah', 'Kluet Timur', 'Kluet Utara', 'Kota Bahagia', 'Labuhan Haji', 'Labuhan Haji Barat', 'Labuhan Haji Timur', 'Meukek', 'Pasie Raja', 'Sama Dua', 'Sawang', 'Tapak Tuan', 'Trumon', 'Trumon Tengah', 'Trumon Timur'],
      },
      {
        name: 'Kabupaten Aceh Barat Daya',
        districts: ['Babah Rot', 'Blang Pidie', 'Jeumpa', 'Kuala Batee', 'Lembah Sabil', 'Manggeng', 'Setia', 'Susoh', 'Tangan-Tangan'],
      },
      {
        name: 'Kabupaten Nagan Raya',
        districts: ['Beutong', 'Beutong Ateuh Banggalang', 'Darul Makmur', 'Kuala', 'Kuala Pesisir', 'Seunagan', 'Seunagan Timur', 'Suka Makmue', 'Tadu Raya', 'Tripa Makmur'],
      },
      {
        name: 'Kabupaten Aceh Barat',
        districts: ['Arongan Lambalek', 'Bubon', 'Johan Pahlawan', 'Kaway XVI', 'Meureubo', 'Pante Ceureumen', 'Panton Reu', 'Samatiga', 'Sungai Mas', 'Woyla', 'Woyla Barat', 'Woyla Timur'],
      },
      {
        name: 'Kabupaten Aceh Jaya',
        districts: ['Indra Jaya', 'Jaya', 'Krueng Sabee', 'Panga', 'Pasie Raya', 'Sampoiniet', 'Setia Bakti', 'Teunom', 'Darul Hikmah'],
      },
      {
        name: 'Kabupaten Simeulue',
        districts: ['Alafan', 'Salang', 'Simeulue Barat', 'Simeulue Cut', 'Simeulue Tengah', 'Simeulue Timur', 'Teluk Dalam', 'Teupah Barat', 'Teupah Selatan', 'Teupah Tengah'],
      },
      {
        name: 'Kabupaten Aceh Singkil',
        districts: ['Danau Paris', 'Gunung Meriah', 'Kota Baharu', 'Kuala Baru', 'Pulau Banyak', 'Pulau Banyak Barat', 'Simpang Kanan', 'Singkil', 'Singkil Utara', 'Singkohor', 'Suro'],
      },
      {
        name: 'Kota Subulussalam',
        districts: ['Longkib', 'Penanggalan', 'Rundeng', 'Simpang Kiri', 'Sultan Daulat'],
      },
    ],
  },
]
