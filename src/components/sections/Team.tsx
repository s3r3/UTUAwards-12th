'use client'

import { Linkedin, Twitter, Mail } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'

const teamMembers = [
  {
    name: 'Ahmad Fauzan',
    role: 'CEO & Founder',
    bio: 'Pengusaha muda dengan 10 tahun pengalaman di bidang agro-maritim',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Siti Nurhaliza',
    role: 'CTO',
    bio: 'Expert dalam teknologi dan sistem informasi pertanian',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Budi Santoso',
    role: 'Head of Operations',
    bio: 'Spesialis supply chain dan logistik agro-maritim',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Dewi Kartika',
    role: 'Head of Partnership',
    bio: 'Berpengalaman dalam hubungan internasional dan ekspor-impor',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    social: { linkedin: '#', twitter: '#' },
  },
]

export default function Team() {
  const t = useTranslations()
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tim Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Didukung oleh tim profesional yang berpengalaman di bidang agro-maritim dan teknologi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
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
