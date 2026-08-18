'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function TopLifestyleBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative h-[60vh] w-full overflow-hidden"
    >
      <Image
        src="https://images.unsplash.com/photo-1504755241915-f736314b92c5?w=1920&q=80" // working fallback
        alt="People gathering for a meal"
        fill
        sizes="(max-width: 1024px) 100vw, 100vw"
        className="object-cover"
        priority
      />
    </motion.section>
  )
}
