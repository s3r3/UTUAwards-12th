import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@acelora.id' },
    update: {},
    create: { name: 'Admin Acelora', email: 'admin@acelora.id', password: adminPassword, role: 'ADMIN' },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@acelora.id' },
    update: {},
    create: { name: 'User Acelora', email: 'user@acelora.id', password: userPassword, role: 'USER' },
  })

  const products = [
    { name: 'Kopi Arabica Gayo Premium', category: 'COFFEE' as const, description: 'Kopi arabica single origin dari dataran tinggi Gayo Lues, ditanam pada ketinggian 1.200-1.500 mdpl.', origin: 'Gayo Lues', ownerId: user.id },
    { name: 'Minyak Nilam Aceh', category: 'PATCHOULI' as const, description: 'Minyak nilam murni (Patchouli Oil) diekstrak secara tradisional dari tanaman nilam pilihan Aceh Selatan.', origin: 'Aceh Selatan', ownerId: user.id },
    { name: 'Udang Vannamei Fresh', category: 'SEAFOOD' as const, description: 'Udang vannamei segar dari tambak terintegrasi di pesisir Aceh Timur.', origin: 'Aceh Timur', ownerId: user.id },
    { name: 'Rempah Kustom Aceh', category: 'SPICES' as const, description: 'Campuran rempah autentik Aceh yang telah diracik oleh maestro kuliner lokal.', origin: 'Aceh Besar', ownerId: user.id },
    { name: 'Kopi Robusta Gayo', category: 'COFFEE' as const, description: 'Kopi robusta dari Bener Meriah dengan karakter bold dan earthy.', origin: 'Bener Meriah', ownerId: user.id },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: `seed-${p.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: { id: `seed-${p.name.toLowerCase().replace(/\s+/g, '-')}`, ...p, status: 'APPROVED' },
    })
  }

  const partners = [
    { company: 'PT. Global Trade Asia', country: 'Malaysia', location: 'Kuala Lumpur', category: 'ASIA' as const },
    { company: 'European Foods Ltd', country: 'Belanda', location: 'Amsterdam', category: 'EUROPE' as const },
    { company: 'Middle East Trading Co', country: 'UAE', location: 'Dubai', category: 'MIDDLE_EAST' as const },
    { company: 'American Natural Goods', country: 'USA', location: 'New York', category: 'AMERICA' as const },
  ]

  for (const p of partners) {
    await prisma.partner.upsert({
      where: { id: `seed-partner-${p.company.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: { id: `seed-partner-${p.company.toLowerCase().replace(/\s+/g, '-')}`, ...p },
    })
  }

  console.log('Seed completed')
  console.log(`Admin: admin@acelora.id / admin123`)
  console.log(`User: user@acelora.id / user123`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
