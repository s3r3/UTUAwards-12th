'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTranslations } from '@/lib/i18n'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      router.push('/login')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Image
              src="/logo/logoacelorahitam.png"
              alt="Acelora"
              width={180}
              height={50}
              className="hidden dark:block h-10 w-auto"
              priority
            />
            <Image
              src="/logo/logoaceloraputih.png"
              alt="Acelora"
              width={180}
              height={50}
              className="block dark:hidden h-10 w-auto"
              priority
            />
          </Link>
          <h2 className="font-serif text-3xl font-bold text-emerald-950 dark:text-emerald-300">
            {t.auth.registerDesc}
          </h2>
          <p className="mt-2  text-sm text-gray-600 dark:text-gray-400">
            {t.auth.haveAccount}{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              {t.auth.login}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="name"
                type="text"
                placeholder={t.auth.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="email"
                type="email"
                placeholder={t.auth.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t.auth.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.auth.password}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full " size="lg" isLoading={isLoading}>
            {t.auth.register}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-700"></div></div>
            <span className="block text-center text-xs text-gray-500 dark:text-gray-400">atau daftar dengan</span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/api/auth/signin/google')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FcGoogle className="h-5 w-5" /> Google
          </button>

          <button
            type="button"
            onClick={() => router.push('/api/auth/signin/facebook')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaFacebook className="h-5 w-5" /> Facebook
          </button>

          <button
            type="button"
            onClick={() => router.push('/api/auth/signin/twitter')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaXTwitter className="h-5 w-5" /> X
          </button>
        </form>
      </div>
    </div>
  )
}
