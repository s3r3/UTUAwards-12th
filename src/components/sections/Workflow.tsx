'use client'

import { User, Building, Award, Globe, ArrowDown } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const getSteps = (t: ReturnType<typeof useTranslations>) => [
  {
    title: t.workflow.step1title,
    description: t.workflow.step1desc,
    icon: User,
    color: 'bg-green-500',
  },
  {
    title: t.workflow.step2title,
    description: t.workflow.step2desc,
    icon: Building,
    color: 'bg-blue-500',
  },
  {
    title: t.workflow.step3title,
    description: t.workflow.step3desc,
    icon: Award,
    color: 'bg-purple-500',
  },
  {
    title: t.workflow.step4title,
    description: t.workflow.step4desc,
    icon: Globe,
    color: 'bg-orange-500',
  },
]

export default function Workflow() {
  const t = useTranslations()
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.workflow.title} {t.workflow.titleHighlight}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.workflow.desc}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getSteps(t).map((step, index) => (
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
                {index < getSteps(t).length - 1 && (
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
