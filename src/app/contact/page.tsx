import ContactSection from '@/components/contact/ContactSection'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Contact Us | Acelora',
  description: 'We are here to help with your harvest, catch, or order.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] dark:bg-gray-950">
      <ContactSection />
      <Footer />
    </main>
  )
}
