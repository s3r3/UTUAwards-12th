'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sprout, Waves } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const CATEGORIES = [
  {
    slug: 'farm',
    href: '/products?category=FARM',
    title: 'Fresh Farm Produce',
    text: 'Vine-ripened greens, aromatic spices, and single-origin harvests — picked at the peak of season from Aceh\'s highlands.',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80',
    badgeText: 'Organic & Pesticide-Free',
    BadgeIcon: Sprout,
  },
  {
    slug: 'seafood',
    href: '/products?category=SEAFOOD',
    title: 'Premium Seafood',
    text: 'Gleaming catches from the Strait of Malacca to the Indian Ocean — delivered cold-chain fresh, from boat to plate.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200&q=80',
    badgeText: 'Cold-Chain Fresh',
    BadgeIcon: Waves,
  },
]

export default function ProductShowcase() {
  const { scrollYProgress } = useScroll()
  // Mengurangi sedikit intensitas parallax agar terasa lebih halus (dari 40 ke 30)
  const parallax = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section className="bg-stone-50 dark:bg-gray-950 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-teal-900/20 bg-teal-900/5 dark:border-teal-700/30 dark:bg-teal-950/20 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-teal-900 dark:text-teal-300">
            Our Collection
          </span>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl font-bold text-emerald-950 dark:text-emerald-300 tracking-tight">
            Two Worlds, One Table
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-stone-600 dark:text-stone-400 leading-relaxed font-light">
            Explore our two signature categories — lovingly grown on land, or
            freshly gathered from the pristine sea.
          </p>
        </motion.div>

        <div className="grid gap-8 md:gap-12 md:grid-cols-2">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.BadgeIcon;
            
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative"
              >
                <Link href={cat.href} className="block overflow-hidden rounded-3xl border border-black/5 shadow-lg">
                  <div className="relative h-[28rem] md:h-[32rem] overflow-hidden bg-stone-200">
                    <motion.div
                      className="absolute inset-x-0 -top-12 bottom-0"
                      style={{ y: parallax }}
                    >
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </motion.div>
                    
                    {/* Gradient Overlay yang lebih smooth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  </div>

                  {/* Konten Card */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-teal-50 backdrop-blur-md">
                      <Icon size={14} strokeWidth={2} />
                      <span className="tracking-wide">{cat.badgeText}</span>
                    </div>
                    
                    <h3 className="font-serif text-3xl font-semibold text-white tracking-wide">
                      {cat.title}
                    </h3>
                    
                    <p className="mt-3 text-sm text-stone-200 leading-relaxed max-w-sm">
                      {cat.text}
                    </p>
                    
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-teal-300 transition-all group-hover:text-white">
                      <span>Discover</span> 
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}