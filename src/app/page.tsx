import HeroVideo from '@/components/landing/HeroVideo'
import BestSellersSection from '@/components/landing/BestSellersSection'
import AboutPreviewSection from '@/components/landing/AboutPreviewSection'
import BrandBanner from '@/components/landing/BrandBanner'
import ProductShowcase from '@/components/landing/ProductShowcase'
import ParallaxImage from '@/components/landing/ParallaxImage'
import TopLifestyleBanner from '@/components/landing/TopLifestyleBanner'
import CategoryChoiceSection from '@/components/landing/CategoryChoiceSection'
import SourcingRegions from '@/components/landing/SourcingRegions'
import StatsCounter from '@/components/landing/StatsCounter'
import ScrollStory from '@/components/landing/ScrollStory'
import BottomLifestyleBanner from '@/components/landing/BottomLifestyleBanner'
import Footer from '@/components/landing/Footer'
import { getServerTranslations } from '@/lib/i18n'

export default function HomePage() {
  const t = getServerTranslations()
  return (
    <>
      <HeroVideo />
      <BestSellersSection />
      <AboutPreviewSection />
      <BrandBanner />
      <StatsCounter />
      <ParallaxImage
        src="/images/landing1.png"
        alt="Harvest field"
        height="h-72 md:h-[520px]"
      />
      <ProductShowcase />

      <ParallaxImage
        src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80v"
        alt="Ocean table setting"
        height="h-72 md:h-[820px]"
      />
      <CategoryChoiceSection />
      <SourcingRegions />
      <ScrollStory />
      <BottomLifestyleBanner />
      <Footer />
    </>
  )
}