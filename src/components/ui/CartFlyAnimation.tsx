'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlyItem {
  id: number
  src: string
  from: { x: number; y: number }
}

export default function CartFlyAnimation() {
  const [items, setItems] = useState<FlyItem[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    const handle = (e: Event) => {
      const custom = e as CustomEvent<{ src: string; from: { x: number; y: number } }>
      const cart = document.querySelector('[data-cart-icon]')
      if (!cart) return
      const fly: FlyItem = {
        id: ++idRef.current,
        src: custom.detail.src,
        from: custom.detail.from,
      }
      setItems((p) => [...p, fly])
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== fly.id)), 900)
    }
    window.addEventListener('cart-fly', handle as EventListener)
    return () => window.removeEventListener('cart-fly', handle as EventListener)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {items.map((it) => {
          const cart = document.querySelector('[data-cart-icon]') as HTMLElement | null
          const to = cart
            ? { x: cart.getBoundingClientRect().left + cart.offsetWidth / 2, y: cart.getBoundingClientRect().top + cart.offsetHeight / 2 }
            : it.from
          return (
            <motion.img
              key={it.id}
              src={it.src}
              alt=""
              initial={{ left: it.from.x, top: it.from.y, scale: 1, opacity: 1 }}
              animate={{ left: to.x, top: to.y, scale: 0.15, opacity: 0.5 }}
              transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed h-10 w-10 rounded-lg border border-white/40 object-cover shadow-xl"
              style={{ transform: 'translate(-50%, -50%)' }}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}
