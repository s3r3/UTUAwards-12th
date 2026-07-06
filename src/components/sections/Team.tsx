'use client'

import { Linkedin, Twitter, Mail } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'

const getTeamMembers = (t: ReturnType<typeof useTranslations>) => [
  {
    name: 'Muhammad Farid',
    role: 'Ketua',
    
    image: '#',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Putra Ramadhan',
    role: 'Anggota',
   
    image: '',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Tri Mulya Dharma, S.Kom., M.T',
    role: 'Pebimbing',
    
    image: '',
    social: { linkedin: '#', twitter: '#' },
  }
]

export default function Team() {
  const t = useTranslations()
  const teamMembers = getTeamMembers(t)
  return (
    <section className="py-20 bg-white dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.team.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.team.desc2}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2"
            >
              {member.image && member.image !== '#' ? (
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="mx-auto w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{member.name[0]}</span>
                </div>
              )}
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">
                {member.role}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {member.bio}
              </p>
              <div className="flex justify-center space-x-3">
                <a
                  href={member.social.linkedin}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={member.social.twitter}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
