'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from '@/store/ui.store'

const testimonial = {
  quote: "THE FRESHEST HARVEST AND CATCH WE'VE EVER EXPERIENCED!",
  author: "— THE CULINARY TIMES"
}

const footerLinks = {
  privacy: "/privacy",
  terms: "/terms",
  instagram: "https://instagram.com/acelora"
}

export default function Footer() {
  const { theme } = useUIStore()
  const isDark = theme === 'dark'
  
  return (
    <footer className={isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-stone-800'}>
      {/* Testimonial Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative border p-8 md:p-16 mx-6 md:mx-12 mt-24 mb-16"
      >
        {/* Animated border lines */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute top-0 left-0 h-px"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        />
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute top-0 right-0 w-px"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute bottom-0 left-0 h-px"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        />
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute top-0 left-0 w-px"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        />

        <div className="text-center">
          <h2
            className="text-3xl md:text-5xl font-serif uppercase tracking-wider mb-6"
            style={{ WebkitTextStroke: isDark ? '1px rgba(255,255,255,0.3)' : '1px rgba(0,0,0,0.3)', color: 'transparent' }}
          >
            {testimonial.quote}
          </h2>
          <p className="text-sm font-mono tracking-wider">
            {testimonial.author}
          </p>
        </div>
      </motion.div>

      {/* Main Footer Grid */}
      <div className="border-t py-12 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_2fr] gap-8">
          {/* Logo Column */}
          <div className="flex items-center justify-center">
            <Image
              src={isDark ? '/footer/footerhitam.png' : '/footer/footerputih.png'}
              alt="Acelora Logo"
              width={150}
              height={50}
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Mission & Contact Column */}
          <div className="divide-y">
            <div className="pb-8">
              <p className="font-mono text-sm leading-relaxed">
                Crafting delicious, responsibly-sourced farm produce and seafood rooted in care, community, and great taste.
              </p>
            </div>
            <div className="pt-8">
              <p className="uppercase text-xs tracking-widest">LET{`'`}S TALK FRESH:</p>
              <p className="text-sm">hello@acelora.com</p>
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold">CONNECT WITH US</h3>
              <a
                href={footerLinks.instagram}
                className="text-xs font-mono tracking-wider hover:underline"
              >
                INSTAGRAM
              </a>
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-3 border-b bg-transparent focus:outline-none focus:ring-0 placeholder"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
              />
              <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t py-6 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-widest uppercase">ACELORA © 2026</p>
          <div className="flex gap-6">
            <a href={footerLinks.privacy} className="text-[10px] tracking-widest uppercase hover:underline">PRIVACY POLICY</a>
            <a href={footerLinks.terms} className="text-[10px] tracking-widest uppercase hover:underline">TERMS OF SERVICE</a>
          </div>
          <p className="text-[10px] tracking-widest uppercase">SITE BY KANASA</p>
        </div>
      </div>
    </footer>
  )
}