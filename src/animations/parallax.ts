/**
 * Parallax animation utilities using GSAP + ScrollTrigger
 */
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { MotionValue } from 'framer-motion'
import { useTransform } from 'framer-motion'

export interface ParallaxConfig {
  target: string | Element | Element[]
  speed?: number
  trigger?: string | Element
  scrub?: boolean | number
  start?: string
  end?: string
  yOffset?: number
}

export function createParallaxEffect(config: ParallaxConfig) {
  const { target, speed = -0.5, trigger, scrub = 1, start = 'top bottom', end = 'bottom top', yOffset } = config
  const calculatedY = yOffset ?? speed * 120
  return gsap.fromTo(target, { y: -calculatedY }, { y: calculatedY, ease: 'none', scrollTrigger: { trigger: trigger || (typeof target === 'string' ? target : undefined), start, end, scrub } })
}

export function createFadeParallax(target: string | Element, options: Partial<ParallaxConfig> = {}) {
  return gsap.fromTo(target, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: target, start: options.start ?? 'top 85%', end: options.end ?? 'bottom 20%', scrub: options.scrub ?? false, toggleActions: 'play none none reverse' } })
}

export function createHorizontalParallax(target: string | Element, xOffset = 80, options: Partial<ParallaxConfig> = {}) {
  return gsap.fromTo(target, { x: -xOffset }, { x: xOffset, ease: 'none', scrollTrigger: { trigger: options.trigger || target, start: options.start ?? 'top bottom', end: options.end ?? 'bottom top', scrub: options.scrub ?? 1.5 } })
}

export function createSectionReveal(target: string | Element, options: Partial<ParallaxConfig> = {}) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: target, start: options.start ?? 'top 80%', toggleActions: 'play none none reverse' } })
  tl.fromTo(target, { opacity: 0, scale: 0.95, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  return tl
}

export function createStaggerReveal(container: string | Element, childSelector = '[data-reveal]', staggerAmount = 0.12) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none reverse' } })
  tl.fromTo(`${container} ${childSelector}`, { opacity: 0, y: 50, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: staggerAmount })
  return tl
}

export function useParallaxY(scrollY: MotionValue<number>, inputRange: [number, number], outputRange: [number, number]): MotionValue<number> {
  return useTransform(scrollY, inputRange, outputRange)
}

export function useParallaxOpacity(scrollY: MotionValue<number>, inputRange: [number, number], outputRange: [number, number] = [1, 0]): MotionValue<number> {
  return useTransform(scrollY, inputRange, outputRange)
}

export function killParallaxTweens(tweens: gsap.core.Tween[]) {
  tweens.forEach((tween) => {
    const st = (tween as any).scrollTrigger
    if (st) st.kill()
    tween.kill()
  })
}

export { ScrollTrigger }
