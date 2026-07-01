import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-white">Metuah Hub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Platform digital ekosistem agro-maritim Aceh yang menghubungkan UMKM, 
              petani, nelayan, eksportir, dan mitra internasional.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">About</Link></li>
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">Products</Link></li>
              <li><Link href="/mentoring" className="hover:text-primary-400 transition-colors">Mentoring</Link></li>
              <li><Link href="/partners" className="hover:text-primary-400 transition-colors">Partners</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@metuahhub.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+62 651 123456</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Banda Aceh, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Metuah Hub. All rights reserved.</p>
          <p className="text-sm mt-2">The 12th UTU Awards 2026</p>
        </div>
      </div>
    </footer>
  )
}
