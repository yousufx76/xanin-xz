import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Mail, MapPin, ExternalLink, Send, CheckCircle, MessageCircle, Phone } from 'lucide-react'
import { db } from '../firebase'
import { collection, addDoc, doc, setDoc, increment, serverTimestamp } from 'firebase/firestore'


// Constants
const SERVICE_ID = 'service_zqtuxmh'
const TEMPLATE_ID = 'template_foxumpb'
const PUBLIC_KEY = 'CRAicbVPmu8YgDtYw'

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/yousufhasanxz' },
  { name: 'YouTube', href: 'https://youtube.com/@xaninxz' },
  { name: 'GitHub', href: 'https://github.com/yousufx76' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/xanin-kaizo-graphics-designer/' },
  { name: 'Fiverr', href: 'https://www.fiverr.com/s/gDbq31v' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583585307485' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      }, PUBLIC_KEY)

      // ==========================================
      // START: NEW DISCORD NOTIFICATION LOGIC
      // ==========================================
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        })
      })
      // ==========================================
      // END: NEW DISCORD NOTIFICATION LOGIC
      // ==========================================

      const today = new Date().toISOString().split('T')[0]
      await addDoc(collection(db, 'messages'), {
        name: form.name,
        email: form.email,
        message: form.message,
        type: 'form',
        status: 'pending',
        createdAt: serverTimestamp()
      })
      await setDoc(doc(db, 'analytics', `messages_${today}`), {
        count: increment(1),
        date: today
      }, { merge: true })

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error("Error sending message:", err)
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Get In Touch</span>
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Let's Build
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c63ff] to-violet-300"> Something</span>
          </h1>
          <p className="text-white/30 max-w-md mx-auto leading-relaxed text-sm">
            Have a project? Want to collaborate? Or just want to say hi?
            My inbox is always open.
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/[0.08] hover:border-[#6c63ff]/50 hover:bg-[#6c63ff]/5 transition-all duration-300 group"
            >
              <ExternalLink size={10} className="text-white/20 group-hover:text-[#6c63ff] transition-colors" />
              <span className="text-[10px] md:text-xs text-white/30 group-hover:text-white transition-colors uppercase tracking-widest">
                {social.name}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left - Info */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 flex flex-col gap-6">
              <h2 className="text-white font-bold text-lg">Contact Info</h2>

              <a
                href="mailto:xaninkaizoxz@gmail.com"
                onClick={async () => {
                  const today = new Date().toISOString().split('T')[0]
                  await addDoc(collection(db, 'messages'), {
                    type: 'gmail_click',
                    status: 'pending',
                    createdAt: serverTimestamp()
                  })
                  await setDoc(doc(db, 'analytics', `messages_${today}`), {
                    count: increment(1),
                    date: today
                  }, { merge: true })
                }}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center group-hover:bg-[#6c63ff]/20 transition-all duration-300">
                  <Mail size={18} className="text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                    xaninkaizoxz@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/8801352192471"
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  const today = new Date().toISOString().split('T')[0]
                  await addDoc(collection(db, 'messages'), {
                    type: 'whatsapp_click',
                    status: 'pending',
                    createdAt: serverTimestamp()
                  })
                  await setDoc(doc(db, 'analytics', `messages_${today}`), {
                    count: increment(1),
                    date: today
                  }, { merge: true })
                }}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center group-hover:bg-[#6c63ff]/20 transition-all duration-300">
                  <MessageCircle size={22} className="text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                    +880 1352-192471
                  </p>
                </div>
              </a>
              {/* Phone Link with Analytics */}
              <a
                href="tel:+8801352192471"
                onClick={async () => {
                  const today = new Date().toISOString().split('T')[0]
                  await addDoc(collection(db, 'messages'), {
                    type: 'phone_click',
                    status: 'pending',
                    createdAt: serverTimestamp()
                  })
                  await setDoc(doc(db, 'analytics', `messages_${today}`), {
                    count: increment(1),
                    date: today
                  }, { merge: true })
                }}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center group-hover:bg-[#6c63ff]/20 transition-all duration-300">
                  <Phone size={18} className="text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                    +880 1352-192471
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center">
                  <MapPin size={18} className="text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-sm text-white/70">Savar, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="bg-[#6c63ff]/5 border border-[#6c63ff]/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 uppercase tracking-widest">Available for work</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Currently open for freelance projects — video editing, art, and web design.
              </p>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 flex flex-col gap-5 h-full">

              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-[#6c63ff]/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle size={40} className="text-[#6c63ff]" />
                  </motion.div>
                  <h3 className="text-white font-bold text-xl">Message Sent!</h3>
                  <p className="text-white/40 text-sm text-center max-w-[200px]">
                    Thanks! I'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 text-xs text-[#6c63ff] hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-widest ml-1">Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 outline-none focus:border-[#6c63ff]/40 focus:bg-white/[0.05] transition-all duration-300"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-widest ml-1">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 outline-none focus:border-[#6c63ff]/40 focus:bg-white/[0.05] transition-all duration-300"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-widest ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 outline-none focus:border-[#6c63ff]/40 focus:bg-white/[0.05] transition-all duration-300 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-xs text-center bg-red-400/10 py-2 rounded-xl">
                      Something went wrong. Please try again!
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 bg-[#6c63ff] text-white rounded-2xl text-sm font-bold hover:bg-[#5a52e0] hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending...' : <><Send size={14} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}