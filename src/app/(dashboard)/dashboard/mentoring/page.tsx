'use client'

import { BookOpen, Award, Shield, Package, Truck, CheckCircle2 } from 'lucide-react'

const programs = [
  { name: 'Sertifikasi Halal', product: 'Kopi Gayo Premium', progress: 65, icon: Award, color: 'bg-green-500' },
  { name: 'HACCP', product: 'Udang Vannamei', progress: 30, icon: Shield, color: 'bg-blue-500' },
  { name: 'Export Packaging', product: 'Minyak Nilam', progress: 10, icon: Package, color: 'bg-purple-500' },
]

export default function MentoringPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Program Mentoring</h1>
      <div className="grid gap-6">
        {programs.map((p, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${p.color} text-white`}><p.icon size={24} /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{p.product}</p>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-primary-600">{p.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
