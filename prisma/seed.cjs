const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL })

  // Create users via raw SQL
  const adminPw = await bcrypt.hash("admin123", 12)
  const userPw = await bcrypt.hash("user123", 12)

  // Upsert users
  const now = new Date().toISOString()
  const adminRes = await pool.query(
    `INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$6)
     ON CONFLICT (email) DO UPDATE SET name=$2 RETURNING id`,
    ["admin-" + randomId(), "Admin Acelora", "admin@acelora.id", adminPw, "ADMIN", now]
  )
  const userRes = await pool.query(
    `INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$6)
     ON CONFLICT (email) DO UPDATE SET name=$2 RETURNING id`,
    ["user-" + randomId(), "User Acelora", "user@acelora.id", userPw, "USER", now]
  )
  const adminId = adminRes.rows[0].id
  const userId = userRes.rows[0].id
  console.log("Admin:", adminId, "\nUser:", userId)

  // Clear old data
  await pool.query("DELETE FROM order_items")
  await pool.query("DELETE FROM orders")
  await pool.query("DELETE FROM addresses")
  await pool.query("DELETE FROM products")
  try { await pool.query("DELETE FROM mentorings") } catch(e) {}
  try { await pool.query("DELETE FROM partners") } catch(e) {}
  console.log("Old data cleared")

  // Insert products
  const products = [
    ["Kopi Arabika Gayo Specialty","COFFEE","Kopi Arabika single-origin dari Gayo, Aceh Tengah.","Aceh Tengah",85000,50,250,"/images/kopi_arabica.png"],
    ["Minyak Nilam Aceh Grade A","PATCHOULI","Minyak nilam murni distilasi uap dari Aceh Selatan.","Aceh Selatan",250000,20,100,"/images/PatchouliOil.png"],
    ["Udang Vannamei Segar Aceh","SEAFOOD","Udang Vannamei segar dari tambak Aceh Timur.","Aceh Timur",45000,100,500,"/images/VannameiShrimp.png"],
    ["Lada Hitam Aceh Premium","SPICES","Lada hitam premium dari Aceh Jaya.","Aceh Jaya",35000,75,200,"/images/ladahitamAceh.png"],
    ["Kopi Gayo Robusta Green Bean","COFFEE","Kopi Robusta full-body dari Gayo Lues.","Gayo Lues",55000,60,500,"/images/cofferobusta.png"],
    ["Dodol Aceh Premium","PROCESSED","Dodol tradisional Aceh.","Banda Aceh",25000,40,350,"/images/ikantongkolasap.png"],
    ["Kayu Manis Aceh","SPICES","Kayu manis asli Aceh grade ekspor.","Aceh Barat",28000,80,200,"/images/Cinnamon.png"],
    ["Kepiting Ranjungan Segar","SEAFOOD","Kepiting ranjungan segar ukuran jumbo.","Aceh Barat Daya",65000,30,1000,"/images/kepitingranjungan.png"],
  ]

  const now2 = new Date().toISOString()
  for (const p of products) {
    const id = "seed-" + p[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
    await pool.query(
      `INSERT INTO products (id,name,category,description,origin,price,stock,weight,image,images,"ownerId",status,"createdAt","updatedAt")
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'APPROVED',$12,$12)`,
      [id, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], [p[7]], userId, now2]
    )
  }
  console.log("Products created")

  // Addresses — skip createdAt/updatedAt since db push creates them as generated columns
  const now3 = new Date().toISOString()
  await pool.query(
    `INSERT INTO addresses (id,"userId",label,name,phone,street,city,province,"postalCode","isDefault")
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [randomId(), userId, "Rumah", "User Acelora", "081234567890", "Jl. Teuku Nyak Arief No. 1", "Banda Aceh", "Aceh", "23111", true]
  )
  await pool.query(
    `INSERT INTO addresses (id,"userId",label,name,phone,street,city,province,"postalCode","isDefault")
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [randomId(), adminId, "Kantor", "Admin Acelora", "081234567891", "Jl. Sultan Iskandar Muda No. 45", "Banda Aceh", "Aceh", "23241", true]
  )
  console.log("Addresses created")

  await pool.end()
  console.log("DONE")
}

function randomId() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

main().catch(e => { console.error(e.message || e); process.exit(1) })
