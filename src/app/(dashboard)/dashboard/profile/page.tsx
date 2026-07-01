'use client'

import { User, Mail, Shield, Calendar } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profil</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">U</div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">User Metuah</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">user@metuahhub.id</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm"><User size={16} className="text-gray-400" /><span className="text-gray-600 dark:text-gray-400">Nama: <strong className="text-gray-900 dark:text-white">User Metuah</strong></span></div>
          <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400" /><span className="text-gray-600 dark:text-gray-400">Email: <strong className="text-gray-900 dark:text-white">user@metuahhub.id</strong></span></div>
          <div className="flex items-center gap-3 text-sm"><Shield size={16} className="text-gray-400" /><span className="text-gray-600 dark:text-gray-400">Role: <strong className="text-gray-900 dark:text-white">User</strong></span></div>
          <div className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-gray-400" /><span className="text-gray-600 dark:text-gray-400">Bergabung: <strong className="text-gray-900 dark:text-white">Juni 2026</strong></span></div>
        </div>
      </div>
    </div>
  )
}
