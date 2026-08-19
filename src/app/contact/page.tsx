import ContactSection from '@/components/contact/ContactSection'

export const metadata = {
  title: 'Contact Us | Acelora',
  description: 'We are here to help with your harvest, catch, or order.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <ContactSection />
    </main>
  )
}
