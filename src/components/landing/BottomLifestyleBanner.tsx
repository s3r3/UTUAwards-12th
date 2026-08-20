'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function BottomLifestyleBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative h-[70vh] w-full overflow-hidden"
    >
      <Image
        src="https://images.unsplash.com/photo-1514537097618-4e93b4c09043?w=1920&q=80"
        alt="People relaxing with food"
        fill
        sizes="(max-width: 1024px) 100vw, 100vw"
        className="object-cover"
        priority
      />
    </motion.section>
  )
}