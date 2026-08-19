'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sprout, Waves } from 'lucide-react'

const CARD_DATA = [
  {
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', // Farm vegetables
    alt: 'Fresh vegetables and spices',
    title: 'FRESH FROM THE FARM',
  },
  {
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80', // Placeholder: fresh fish/seafood
    alt: 'Fresh fish and seafood',
    title: 'WILD CAUGHT SEAFOOD',
  },
]

const CENTER_TEXT = {
  title: 'Land or Sea',
  description: 'Not sure which is best for you? Explore both our fertile harvests and pristine catches.',
}

export default function CategoryChoiceSection() {
  return (
    <section className="bg-stone-50 dark:bg-gray-950 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
          {/* Card 1 (Farm) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-6 border border-black/10 dark:border-white/15">
              <Image src={CARD_DATA[0].image} alt={CARD_DATA[0].alt} fill unoptimized className="object-cover" />
            </div>
            <h3 className="font-serif text-xl font-bold text-emerald-950 dark:text-emerald-400 tracking-wider">
              {CARD_DATA[0].title}
            </h3>
          </motion.div>

          {/* Center Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 dark:text-emerald-300 tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-script), cursive' }}
            >
              {CENTER_TEXT.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base leading-relaxed text-stone-600 dark:text-stone-400 font-light max-w-md"
            >
              {CENTER_TEXT.description}
            </motion.p>
          </motion.div>

          {/* Card 2 (Seafood) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-6 border border-black/10 dark:border-white/15">
              <Image src={CARD_DATA[1].image} alt={CARD_DATA[1].alt} fill unoptimized className="object-cover" />
            </div>
            <h3 className="font-serif text-xl font-bold text-ocean-950 dark:text-ocean-400 tracking-wider">
              {CARD_DATA[1].title}
            </h3>
            <p className="mt-3 text-sm text-ocean-700 dark:text-ocean-400 leading-relaxed">
              {CARD_DATA[1].alt}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
