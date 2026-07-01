/**
 * Fade animation variants for Framer Motion
 * Used throughout Metuah Hub for entrance and exit animations
 */

import type { Variants, Transition } from 'framer-motion'

// ─── Base Transitions ────────────────────────────────────────────────────────

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1,
}

export const easeTransition: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1], // cubic-bezier custom ease-out-expo
}

export const fastTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
}

// ─── Fade Variants ───────────────────────────────────────────────────────────

/** Simple fade in/out */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: easeTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
}

/** Fade up — content rises from below */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: fastTransition,
  },
}

/** Fade down — content drops from above */
export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeTransition,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: fastTransition,
  },
}

/** Fade left — content slides in from the right */
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeTransition,
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: fastTransition,
  },
}

/** Fade right — content slides in from the left */
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeTransition,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: fastTransition,
  },
}

/** Fade with scale — content grows in */
export const fadeScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...easeTransition, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: fastTransition,
  },
}

/** Stagger container — parent that staggers children */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

/** Stagger container with longer delay */
export const staggerContainerSlowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

/** Stagger item — child of a stagger container */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeTransition,
  },
}

/** Hero text reveal — dramatic entrance for hero sections */
export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/** Card hover — subtle lift on hover */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 60px rgba(34, 197, 94, 0.15)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/** Button press effect */
export const buttonTapVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a delayed fade-up variant for sequential animations
 */
export function createDelayedFadeUp(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...easeTransition,
        delay,
      },
    },
  }
}

/**
 * Generate stagger container with custom config
 */
export function createStaggerContainer(
  staggerChildren: number = 0.1,
  delayChildren: number = 0.1
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  }
}
