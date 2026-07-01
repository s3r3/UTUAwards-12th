/**
 * Scroll animation utilities uses GSAP ScrollTrigger + Lenis
 */
import { gsap, ScrollTrigger } from '@/lib/gsap'

export interface ScrollRevealConfig {
  target: string | Element | NodeList | Element[]
  fromY?: number
  fromOpacity?: number
  duration?: number
  stagger?: number
  start?: string
  ease?: string
  trigger?: string | Element
  once?: boolean
}

export function scrollReveal(config: ScrollRevealConfig) {
  const { target, fromY = 50, fromOpacity = 0, duration = 0.7, stagger = 0, start = 'top 82%', ease = 'power3.out', trigger, once = false } = config
  const tl = gsap.timeline({ scrollTrigger: { trigger: (trigger || target) as gsap.DOMTarget, start, toggleActions: once ? 'play none none none' : 'play none none reverse' } })
  tl.fromTo(target as gsap.TweenTarget, { opacity: fromOpacity, y: fromY }, { opacity: 1, y: 0, duration, ease, stagger: stagger > 0 ? stagger : undefined })
  return tl
}

export function scrollRevealLeft(target: string | Element, options: Partial<ScrollRevealConfig> = {}) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: target as gsap.DOMTarget, start: options.start ?? 'top 82%', toggleActions: options.once ? 'play none none none' : 'play none none reverse' } })
  tl.fromTo(target as gsap.TweenTarget, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: options.duration ?? 0.7, ease: options.ease ?? 'power3.out' })
  return tl
}

export function scrollRevealRight(target: string | Element, options: Partial<ScrollRevealConfig> = {}) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: target as gsap.DOMTarget, start: options.start ?? 'top 82%', toggleActions: options.once ? 'play none none none' : 'play none none reverse' } })
  tl.fromTo(target as gsap.TweenTarget, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: options.duration ?? 0.7, ease: options.ease ?? 'power3.out' })
  return tl
}

export function animateTextReveal(target: string | Element, stagger = 0.05) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return gsap.timeline()
  const words = (el.textContent ?? '').split(' ')
  el.innerHTML = words.map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}\u00a0</span></span>`).join('')
  const innerSpans = el.querySelectorAll('span > span')
  const tl = gsap.timeline({ scrollTrigger: { trigger: el as gsap.DOMTarget, start: 'top 85%', toggleActions: 'play none none reverse' } })
  tl.fromTo(innerSpans, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.6, ease: 'power3.out', stagger })
  return tl
}

export async function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

export async function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((st) => st.kill())
}
