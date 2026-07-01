import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerUser(name: string, email: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw new Error('Email already registered')

  const hashed = await bcrypt.hash(password, 12)
  return prisma.user.create({
    data: { name, email, password: hashed, role: 'USER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  })
}
