import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12)
  const userPassword = await bcrypt.hash("user123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@acelora.id" },
    update: {},
    create: { name: "Admin Acelora", email: "admin@acelora.id", password: adminPassword, role: "ADMIN" },
  })

  const user = await prisma.user.upsert({
    where: { email: "user@acelora.id" },
    update: {},
    create: { name: "User Acelora", email: "user@acelora.id", password: userPassword, role: "USER" },
  })

  const products = [
    { name: "Kopi Arabika Gayo Specialty", category: "COFFEE" as const, description: "Kopi Arabika single-origin dari ketinggian 1.200-1.600 mdpl di Gayo, Aceh Tengah. Proses natural & washed dengan profil rasa cokelat, karamel, floral.", origin: "Aceh Tengah", price: 85000, stock: 50, weight: 250, image: "/images/kopi_arabica.png" },
    { name: "Minyak Nilam Aceh Grade A", category: "PATCHOULI" as const, description: "Minyak nilam murni distilasi uap dari Aceh Selatan. Kadar PA >= 32%.", origin: "Aceh Selatan", price: 250000, stock: 20, weight: 100, image: "/images/PatchouliOil.png" },
    { name: "Udang Vannamei Segar Aceh", category: "SEAFOOD" as const, description: "Udang Vannamei segar dari tambak pesisir Aceh Timur. Tanpa antibiotik, size 80/100.", origin: "Aceh Timur", price: 45000, stock: 100, weight: 500, image: "/images/VannameiShrimp.png" },
    { name: "Lada Hitam Aceh Premium", category: "SPICES" as const, description: "Lada hitam premium dari Aceh Jaya dengan aroma tajam dan kadar oleoresin tinggi.", origin: "Aceh Jaya", price: 35000, stock: 75, weight: 200, image: "/images/ladahitamAceh.png" },
    { name: "Kopi Gayo Robusta Green Bean", category: "COFFEE" as const, description: "Kopi Robusta full-body dari Gayo Lues. Cocok untuk espresso blend.", origin: "Gayo Lues", price: 55000, stock: 60, weight: 500, image: "/images/cofferobusta.png" },
    { name: "Dodol Aceh Premium", category: "PROCESSED" as const, description: "Dodol tradisional Aceh dari gula aren, santan dan ketan. Varian original.", origin: "Banda Aceh", price: 25000, stock: 40, weight: 350, image: "/images/ikantongkolasap.png" },
    { name: "Kayu Manis Aceh", category: "SPICES" as const, description: "Kayu manis asli Aceh dengan aroma manis khas. Grade ekspor.", origin: "Aceh Barat", price: 28000, stock: 80, weight: 200, image: "/images/Cinnamon.png" },
    { name: "Kepiting Ranjungan Segar", category: "SEAFOOD" as const, description: "Kepiting ranjungan segar dari perairan Aceh. Ukuran jumbo.", origin: "Aceh Barat Daya", price: 65000, stock: 30, weight: 1000, image: "/images/kepitingranjungan.png" },
  ]

  for (const p of products) {
    const id = `seed-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      await prisma.product.create({
        data: { id, ...p, images: [p.image], ownerId: user.id, status: "APPROVED" },
      })
    }
  }

  // Sample addresses
  const addresses = [
    { userId: user.id, label: "Rumah", name: "User Acelora", phone: "081234567890", street: "Jl. Teuku Nyak Arief No. 1", city: "Banda Aceh", province: "Aceh", postalCode: "23111", isDefault: true },
    { userId: admin.id, label: "Kantor", name: "Admin Acelora", phone: "081234567891", street: "Jl. Sultan Iskandar Muda No. 45", city: "Banda Aceh", province: "Aceh", postalCode: "23241", isDefault: true },
  ]

  for (const a of addresses) {
    await prisma.address.create({ data: a })
  }

  console.log("Seed completed")
  console.log("Admin: admin@acelora.id / admin123")
  console.log("User: user@acelora.id / user123")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
