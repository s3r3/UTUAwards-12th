import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import DashboardPreview from '@/components/sections/DashboardPreview'
import ProductCatalog from '@/components/sections/ProductCatalog'
import Mentoring from '@/components/sections/Mentoring'
import InternationalPartner from '@/components/sections/InternationalPartner'
import Workflow from '@/components/sections/Workflow'
import Financial from '@/components/sections/Financial'
import Team from '@/components/sections/Team'
import MarketPrices from '@/components/sections/MarketPrices'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <MarketPrices />
      <ProductCatalog />
      <Mentoring />
      <InternationalPartner />
      <Workflow />
      <Financial />
      <Team />
      <Footer />
    </main>
  )
}
