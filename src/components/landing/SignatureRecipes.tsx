'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const RECIPES = [
  {
    title: 'Seafood & Fresh Greens Salad',
    time: '20 min',
    level: 'Easy',
    desc: 'Wild-caught shrimp over crisp Acehnese greens, tossed in a zesty calamansi dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80',
  },
  {
    title: 'Herb-Roasted Catch of the Day',
    time: '45 min',
    level: 'Medium',
    desc: 'Line-caught fish roasted with local lemongrass, turmeric, and garden herbs for a fragrant finish.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000&q=80',
  },
]

export default function SignatureRecipes() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-ocean-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-ocean-700">
            From Our Kitchen
          </span>
          <h2 className="font-serif-display mt-4 text-3xl md:text-5xl font-semibold text-gray-900">
            Signature Recipes
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-gray-600">
            Simple, beautiful dishes that let our land &amp; sea ingredients shine.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {RECIPES.map((r, i) => (
            <motion.article
              key={r.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ scale: 1.02, y: -6 }}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800">
                    ⏱ {r.time}
                  </span>
                  <span className="rounded-full bg-primary-600/90 px-3 py-1 text-xs font-medium text-white">
                    {r.level}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif-display text-xl font-semibold text-gray-900">{r.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{r.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}