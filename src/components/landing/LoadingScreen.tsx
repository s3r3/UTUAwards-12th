'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShopDesign from './ShopDesign'
import './ShopDesign.css'

interface LoadingScreenProps {
  onComplete?: () => void
  duration?: number
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loadingScreen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => {
            if (!show && onComplete) onComplete()
          }}
        >
          <motion.div
            className="loadingScreen__content"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Shop — wrapper scale-in then ShopDesign enters with stagger */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'backOut' }}
            >
              <ShopDesign />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="loadingScreen__progress"
              variants={itemVariants}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                width: '200px',
                height: '4px',
                background: 'rgba(87, 62, 83, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '2rem',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: '#a4b263',
                  borderRadius: '2px',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
