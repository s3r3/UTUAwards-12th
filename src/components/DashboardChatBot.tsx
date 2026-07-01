'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, TrendingUp, Lightbulb, Target, ChevronRight } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
  type?: 'tip' | 'insight' | 'action'
}

// ─── Business advice responses ─────────────────────────────────────────
// ponytail: replace with real AI API (OpenAI/Gemini) when API key available
const bizResponses: [RegExp, string, string?][] = [
  [/produk|product|jual|komoditas/i, 'Untuk meningkatkan penjualan produk Anda:\n\n📌 Tambah foto produk berkualitas tinggi\n📌 Lengkapi deskripsi & legalitas\n📌 Ikuti program mentoring sertifikasi\n📌 Aktifkan premium listing untuk exposure lebih\n\nProduk dengan sertifikasi Halal + HACCP punya peluang ekspor 3x lebih besar!', 'tip'],
  [/mentor|sertifikasi|pelatihan|course/i, 'Program mentoring yang cocok untuk skala bisnis Anda:\n\n✅ Level Dasar: Sertifikasi Halal (2-3 bulan)\n✅ Level Menengah: Export Packaging (1-2 bulan)\n✅ Level Lanjutan: HACCP (3-4 bulan)\n✅ Optimasi: Supply Chain Training (1 bulan)\n\nMulai dari yang paling relevan dengan produk Anda!', 'insight'],
  [/ekspor|export|luar negeri|global|lokal/i, 'Strategi ekspor untuk UMKM Aceh 🚀\n\n1️⃣ Urus sertifikasi (Halal, HACCP, BPOM)\n2️⃣ Standarisasi kemasan ekspor\n3️⃣ Daftar di katalog Metuah Hub\n4️⃣ Ikut pameran dagang internasional\n\nTim kami siap mendampingi Anda di setiap langkah!', 'tip'],
  [/harga|modal|biaya|cost|untung|revenue/i, 'Tips optimasi keuangan bisnis 💰\n\n📊 Hitung HPP (Harga Pokok Produksi) dengan benar\n📊 Tentukan margin keuntungan 20-30%\n📊 Manfaatkan program mentoring untuk efisiensi\n📊 Gunakan fitur premium listing untuk eksposur\n\nBEP rata-rata UMKM di platform kami: Bulan ke-6!', 'insight'],
  [/pesaing|kompetitor|saingan/i, 'Cara memenangkan persaingan pasar:\n\n🔥 Unique selling point: Ceritakan keunikan produk Aceh Anda\n🔥 Sertifikasi: Keunggulan kompetitif utama\n🔥 Branding: Kemasan premium + storytelling\n🔥 Jaringan: Manfaatkan mitra internasional Metuah Hub\n\nProduk dengan cerita lokal yang autentik punya nilai jual 40% lebih tinggi!', 'tip'],
  [/ekspansi|kembang|scale|besar|capex/i, 'Strategi pengembangan bisnis 📈\n\n📌 Tahap 1: Optimasi produk & sertifikasi (3-6 bulan)\n📌 Tahap 2: Perluas jaringan mitra (6-12 bulan)\n📌 Tahap 3: Ekspor ke 2-3 negara tujuan\n📌 Tahap 4: Scale up produksi & staffing\n\nKami siap mendampingi di setiap tahap melalui program mentoring!', 'tip'],
  [/legal|izin|bpom|halal|pirt/i, 'Informasi legalitas produk:\n\n📋 P-IRT: Untuk produk pangan skala kecil\n📋 BPOM MD: Untuk produk pangan skala menengah/besar\n📋 Sertifikat Halal MUI: Wajib untuk produk makanan\n📋 HACCP: Standar internasional keamanan pangan\n\nRekomendasi: Urut dari P-IRT → Halal → BPOM → HACCP', 'insight'],
  [/promosi|marketing|iklan|branding/i, 'Strategi promosi untuk UMKM 🎯\n\n📱 Manfaatkan media sosial (IG, TikTok)\n📱 Ceritakan proses produksi (storytelling)\n📱 Gunakan kemasan fotogenik\n📱 Aktif di marketplace Mitra Metuah Hub\n\nTips: Produk dengan cerita asal-usul Aceh punya engagement 3x lebih tinggi!', 'tip'],
  [/hasil|omset|pendapatan|laba|profit/i, 'Proyeksi bisnis setelah bergabung di Metuah Hub:\n\n📊 Rata-rata peningkatan penjualan: 150% (6 bulan)\n📊 Jangkauan pasar: dari lokal → 25+ negara\n📊 Efisiensi biaya logistik: hingga 30%\n📊 Nilai tambah sertifikasi: 40% harga premium\n\nMulai perjalanan Anda sekarang! 🚀', 'insight'],
  [/terima kasih|makasih|thanks|help/i, 'Sama-sama! Senang bisa membantu bisnis Anda berkembang 🌟\n\nAda lagi yang ingin ditanyakan?\n\n💡 Tips: Coba tanya "strategi ekspor" atau "cara optimasi produk"', 'tip'],
]

function getBizResponse(input: string): { text: string; type?: string } {
  for (const [pattern, response, type] of bizResponses) {
    if (pattern.test(input)) return { text: response, type }
  }
  return {
    text: 'Saya siap membantu bisnis Anda berkembang! 🚀\n\nCoba tanyakan:\n• "Strategi naikkan penjualan"\n• "Cara ekspor ke luar negeri"\n• "Tips optimasi produk"\n• "Info sertifikasi & legalitas"',
    type: 'action'
  }
}

const quickTips = [
  'Strategi naikkan penjualan',
  'Cara ekspor ke luar negeri',
  'Tips optimasi produk',
  'Info sertifikasi',
]

export default function DashboardChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: 'Halo! 👋 Saya asisten bisnis Metuah Hub. Siap bantu Anda mengembangkan usaha agro-maritim!', sender: 'bot', type: 'tip' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { id: Date.now(), text: text.trim(), sender: 'user' }])
    setInput('')
    setIsTyping(true)

    const reply = getBizResponse(text.trim())
    const delay = Math.min(reply.text.length * 6, 1200)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply.text, sender: 'bot', type: reply.type as any }])
    }, delay)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
          open ? 'bg-red-500 text-white' : 'gradient-primary text-white'
        }`}
        aria-label="Bisnis Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Sparkles size={20} />
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
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm flex items-center gap-2">
                    Bisnis Assistant
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">BETA</span>
                  </p>
                  <p className="text-[11px] text-white/70">AI untuk pengembangan bisnis Anda</p>
                </div>
                <Target size={16} className="text-white/50" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                      msg.sender === 'bot'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {msg.sender === 'bot' ? <Lightbulb size={14} /> : <span className="text-xs font-bold">U</span>}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md'
                    }`}>
                      {msg.text}
                      {msg.sender === 'bot' && msg.type && (
                        <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-700">
                          {msg.type === 'tip' && <Lightbulb size={11} className="text-yellow-500" />}
                          {msg.type === 'insight' && <TrendingUp size={11} className="text-blue-500" />}
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{msg.type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[88%]">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-1">
                      <Lightbulb size={14} className="text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickTips.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <ChevronRight size={10} /> {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(input) }} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya soal bisnis..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-1">
                Asisten bisnis AI • Tips & strategi pengembangan usaha
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
