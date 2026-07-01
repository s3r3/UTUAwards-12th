'use client'

import { User, Building, Award, Globe, ArrowDown } from 'lucide-react'

const steps = [
  {
    title: 'Producer',
    description: 'Petani, nelayan, dan UMKM mendaftarkan produk',
    icon: User,
    color: 'bg-green-500',
  },
  {
    title: 'Metuah Hub',
    description: 'Verifikasi kualitas dan sertifikasi produk',
    icon: Building,
    color: 'bg-blue-500',
  },
  {
    title: 'Certification',
    description: 'Proses sertifikasi halal, HACCP, dan standar ekspor',
    icon: Award,
    color: 'bg-purple-500',
  },
  {
    title: 'Global Market',
    description: 'Distribusi ke pasar internasional',
    icon: Globe,
    color: 'bg-orange-500',
  },
]

export default function Workflow() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Alur Kerja Ekosistem
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Proses terintegrasi dari produsen lokal hingga pasar global
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-white mx-auto mb-4`}>
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowDown className="text-primary-500 animate-bounce" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
