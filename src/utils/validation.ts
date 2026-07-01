import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  category: z.enum(['COFFEE', 'PATCHOULI', 'SEAFOOD', 'SPICES', 'PROCESSED']),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  origin: z.string().min(3, 'Asal daerah minimal 3 karakter'),
  image: z.string().optional(),
  legality: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(1, 'Pilih subjek'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
