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
      className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden"
    >
      <Image
        src="/images/landing5.jpg"
        alt="People relaxing with food"
        fill
        sizes="(max-width: 1024px) 100vw, 100vw"
        className="object-cover"
        priority
      />
    </motion.section>
  )
}
