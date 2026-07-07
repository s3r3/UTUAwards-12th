import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  let admin = await prisma.user.findUnique({ where: { email: "admin@acelora.id" } })
  let user = await prisma.user.findUnique({ where: { email: "user@acelora.id" } })

  if (!admin) {
    const pw = await bcrypt.hash("admin123", 12)
    admin = await prisma.user.create({ data: { name: "Admin Acelora", email: "admin@acelora.id", password: pw, role: "ADMIN" } })
  }
  if (!user) {
    const pw = await bcrypt.hash("user123", 12)
    user = await prisma.user.create({ data: { name: "User Acelora", email: "user@acelora.id", password: pw, role: "USER" } })
  }
  console.log("Admin:", admin.id)
  console.log("User:", user.id)

  // Clear using direct PostgreSQL
  const { Pool } = await import("pg")
  const pool = new Pool({ connectionString: process.env.DIRECT_URL })
  const c = await pool.connect()
  try {
    await c.query("DELETE FROM order_items")
    await c.query("DELETE FROM orders")
    await c.query("DELETE FROM addresses")
    await c.query("DELETE FROM products")
  } finally { c.release() }

  const products = [
    ["Kopi Arabika Gayo Specialty", "COFFEE", "Kopi Arabika single-origin dari Gayo.", "Aceh Tengah", 85000, 50, 250, "/images/kopi_arabica.png"],
    ["Minyak Nilam Aceh Grade A", "PATCHOULI", "Minyak nilam murni dari Aceh Selatan.", "Aceh Selatan", 250000, 20, 100, "/images/PatchouliOil.png"],
    ["Udang Vannamei Segar Aceh", "SEAFOOD", "Udang Vannamei segar dari Aceh Timur.", "Aceh Timur", 45000, 100, 500, "/images/VannameiShrimp.png"],
    ["Lada Hitam Aceh Premium", "SPICES", "Lada hitam premium dari Aceh Jaya.", "Aceh Jaya", 35000, 75, 200, "/images/ladahitamAceh.png"],
    ["Kopi Gayo Robusta Green Bean", "COFFEE", "Kopi Robusta full-body dari Gayo Lues.", "Gayo Lues", 55000, 60, 500, "/images/cofferobusta.png"],
    ["Dodol Aceh Premium", "PROCESSED", "Dodol tradisional Aceh.", "Banda Aceh", 25000, 40, 350, "/images/ikantongkolasap.png"],
    ["Kayu Manis Aceh", "SPICES", "Kayu manis asli Aceh grade ekspor.", "Aceh Barat", 28000, 80, 200, "/images/Cinnamon.png"],
    ["Kepiting Ranjungan Segar", "SEAFOOD", "Kepiting ranjungan segar ukuran jumbo.", "Aceh Barat Daya", 65000, 30, 1000, "/images/kepitingranjungan.png"],
  ]

  const c2 = await pool.connect()
  try {
    for (const p of products) {
      const id = "seed-" + p[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
      await c2.query(
        `INSERT INTO products (id, name, category, description, origin, price, stock, weight, image, images, "ownerId", status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [id, ...p, [p[7]], user.id, "APPROVED"]
      )
      console.log("Created:", p[0])
    }
    const cuid = () => "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    await c2.query(`INSERT INTO addresses (id, "userId", label, name, phone, street, city, province, "postalCode", "isDefault") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [cuid(), user.id, "Rumah", "User Acelora", "081234567890", "Jl. Teuku Nyak Arief No. 1", "Banda Aceh", "Aceh", "23111", true])
    await c2.query(`INSERT INTO addresses (id, "userId", label, name, phone, street, city, province, "postalCode", "isDefault") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [cuid(), admin.id, "Kantor", "Admin Acelora", "081234567891", "Jl. Sultan Iskandar Muda No. 45", "Banda Aceh", "Aceh", "23241", true])
    console.log("Addresses created")
  } finally { c2.release() }

  console.log("Seed completed!")
  await pool.end()
}

main().catch((e) => { console.error(e.message); process.exit(1) }).finally(() => prisma.$disconnect())
