'use client'

import { motion, Variants } from 'framer-motion'

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const contactInfo = [
  { label: 'Inquiries', value: 'hello@acelora.com' },
  { label: 'Partnerships', value: 'partner@acelora.com' },
  { label: 'Office', value: 'Jl. Raya Aceh, Banda Aceh, Indonesia.' },
]

export default function ContactSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-12">
      {/* Header */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="mx-auto mb-16 md:mb-24">
        <motion.h1
          variants={fadeUp}
          className="text-center font-serif text-5xl font-semibold uppercase tracking-[0.15em] text-slate-950 md:text-7xl"
        >
          Contact Us
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-center text-base text-slate-600 md:text-lg">
          We are here to help with your harvest, catch, or order.
        </motion.p>
        <motion.div variants={fadeUp} className="mx-auto mt-6 h-px w-16 bg-slate-950/15" />
      </motion.div>

      {/* Two-Column Layout */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-slate-950/10">
        {/* Left: Contact Info */}
        <motion.div variants={fadeUp} className="flex flex-col space-y-10 pb-12 pr-0 md:pr-12 md:pb-0">
          {contactInfo.map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <h3 className="font-serif text-2xl font-semibold uppercase tracking-wider text-slate-950 md:text-3xl">
                {label}
              </h3>
              <p className="font-mono text-sm text-slate-600 md:text-base">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Right: Contact Form */}
        <motion.form
          variants={fadeUp}
          className="flex flex-col space-y-8 pt-10 md:pl-12 md:pt-0"
          onSubmit={(e) => {
            e.preventDefault()
            alert('Form submitted')
          }}
        >
          {['Name', 'Email', 'Subject'].map((field) => (
            <div key={field} className="group">
              <label htmlFor={field.toLowerCase()} className="sr-only">
                {field}
              </label>
              {field === 'Subject' ? (
                <select
                  id="subject"
                  name="subject"
                  className="w-full border-b border-slate-950/20 bg-transparent py-3 text-sm text-slate-950 outline-none transition-colors focus:border-slate-950/60"
                  defaultValue=""
                >
                  <option value="" disabled className="text-slate-500">
                    Select subject
                  </option>
                  <option value="inquiry">General Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="order">Order Support</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <input
                  id={field.toLowerCase()}
                  name={field.toLowerCase()}
                  type={field === 'Email' ? 'email' : 'text'}
                  placeholder={field}
                  className="w-full border-b border-slate-950/20 bg-transparent py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-500/60 focus:border-slate-950/60"
                />
              )}
            </div>
          ))}

          <div className="group">
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Message"
              className="w-full resize-none border-b border-slate-950/20 bg-transparent py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-500/60 focus:border-slate-950/60"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-emerald-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-900 rounded-none"
          >
            Send Message
          </button>
        </motion.form>
      </motion.div>
    </section>
  )
}
