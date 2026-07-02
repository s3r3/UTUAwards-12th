'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
}

// ─── Rule-based responses ──────────────────────────────────────────────
// ponytail: replace with real AI API (OpenAI/Gemini) when API key available
const responses: [RegExp, string][] = [
  [/halo|hi|hai|helo|hey|siang|pagi|malam/i, 'Halo! 👋 Selamat datang di Metuah Hub. Ada yang bisa saya bantu?'],
  [/buat apa|tentang|apa itu|fungsi|kegunaan/i, 'Metuah Hub adalah platform digital ekosistem agro-maritim Aceh 🚀 \n\nKami menghubungkan UMKM, petani, nelayan, dan eksportir Aceh ke pasar global. Mulai dari sertifikasi produk, mentoring, hingga koneksi ke buyer internasional.'],
  [/daftar|register|produk|mendaftar/i, 'Tentu! Anda bisa mendaftarkan produk agro-maritim Aceh Anda di sini 🌿\n\nCaranya:\n1. Buat akun (gratis)\n2. Masuk ke dashboard\n3. Klik "Tambah Produk"\n4. Isi data produk\n\nTim kami akan review & bantu sertifikasi!'],
  [/kaya|untung|revenue|pendapatan|bisnis|model/i, 'Metuah Hub punya model bisnis yang menguntungkan untuk semua pihak 💰\n\n• Komisi 3% per transaksi\n• Premium listing untuk produk unggulan\n• Konsultasi B2B\n• Kemitraan pemerintah\n\nUMKM dapat akses pasar global tanpa biaya besar!'],
  [/siapa|tim|creator|pembuat/i, 'Metuah Hub dibuat oleh tim profesional yang berpengalaman di bidang agro-maritim dan teknologi 👨‍💻\n\nDipimpin oleh Ahmad Fauzan (CEO) bersama para ahli di bidang operasi, kemitraan internasional, dan teknologi.'],
  [/mentor|course|pelatihan|sertifikasi/i, 'Kami punya 4 program mentoring unggulan 📚\n\n✅ Sertifikasi Halal\n✅ HACCP (standar pangan internasional)\n✅ Export Packaging\n✅ Supply Chain Training\n\nSetiap program didampingi mentor ahli!'],
  [/mitra|partner|global|luar negeri|ekspor/i, 'Produk UMKM Aceh sudah tembus pasar global! 🌍\n\nMitra kami tersebar di:\n• Asia (Malaysia, Jepang, Singapura)\n• Eropa (Belanda, Prancis, Inggris)\n• Timur Tengah (UAE)\n• Amerika (USA)\n\nLebih dari 25 negara tujuan ekspor!'],
  [/kontak|telepon|email|alamat|hubungi/i, 'Hubungi kami 📞\n\nEmail: info@metuahhub.id\nTelp: +62 651 123456\nAlamat: Banda Aceh, Indonesia\n\nAtau kirim pesan lewat halaman Contact!'],
  [/harga|biaya|bayar|cost|gratis/i, 'Pendaftaran akun GRATIS! 🎉\n\nBiaya dikenakan saat:\n• Program mentoring (mulai Rp1.5jt)\n• Premium listing produk\n• Konsultasi B2B\n\nUntuk info lengkap, hubungi tim kami!'],
  [/makasih|terima kasih|thank|thanks/i, 'Sama-sama! 😊 Senang bisa membantu. \n\nAda lagi yang ingin ditanyakan seputar Metuah Hub?'],
]

function getBotResponse(input: string): string {
  for (const [pattern, response] of responses) {
    if (pattern.test(input)) return response
  }
  return 'Maaf, saya belum paham pertanyaan Anda 🤔\n\nCoba tanyakan:\n• "Apa itu Metuah Hub?"\n• "Cara daftar produk"\n• "Info mentoring"\n• "Mitra internasional"\n• "Kontak kami"'
}

const suggestions = [
  'Apa itu Metuah Hub?',
  'Cara daftar produk',
  'Info mentoring',
  'Mitra internasional',
]

export default function ChatBot() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: 'Halo! 👋 Saya asisten Metuah Hub. Ada yang bisa saya bantu?', sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now(), text: text.trim(), sender: 'user' }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay based on response length
    const reply = getBotResponse(text.trim())
    const delay = Math.min(reply.length * 8, 1500)

    setTimeout(() => {
      setIsTyping(false)
      const botMsg: Message = { id: Date.now() + 1, text: reply, sender: 'bot' }
      setMessages((prev) => [...prev, botMsg])
    }, delay)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-primary text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        aria-label="Chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[70vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-primary px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{t.chatbot.assistant}</p>
                <p className="text-[11px] text-white/70">Online • Siap membantu</p>
              </div>
              <Sparkles size={16} className="text-white/60" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === 'bot' ? 'bg-primary-500/20 text-primary-600' : 'bg-ocean-500/20 text-ocean-600'}`}>
                      {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-primary-500 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} className="text-primary-600" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(input) }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl gradient-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-1.5">
                Asisten virtual Metuah Hub
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
