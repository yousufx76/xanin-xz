import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, X, ArrowLeft, Eye, ShoppingBag, Filter } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const ORDER_WEBHOOK = 'https://discord.com/api/webhooks/1508479052401344592/8oIj22K1s-0whEEIJhpSU7TaNFveXJ7qLDWaG2hGvr1Gj_jXEah-AWQgwAER7c2_pu7p'

const CATEGORIES = ['All', 'Portfolio', 'Business', 'E-commerce', 'Other']

function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'XZ-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

async function generateOrderPDF(order) {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842])
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await doc.embedFont(StandardFonts.Helvetica)

  const indigo = rgb(0.388, 0.4, 0.945)
  const white = rgb(1, 1, 1)
  const muted = rgb(0.5, 0.5, 0.55)

  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.05, 0.05, 0.08) })
  page.drawRectangle({ x: 0, y: 762, width: 595, height: 80, color: indigo })
  page.drawText('XANIN XZ', { x: 40, y: 808, size: 22, font: boldFont, color: white })
  page.drawText('PREMADE SITE ORDER', { x: 40, y: 786, size: 10, font: regularFont, color: rgb(0.8, 0.82, 1) })
  page.drawText(order.code, { x: 595 - 40 - boldFont.widthOfTextAtSize(order.code, 12), y: 800, size: 12, font: boldFont, color: white })

  let y = 700
  const line = (label, value, bold = false) => {
    page.drawText(label, { x: 40, y, size: 10, font: regularFont, color: muted })
    page.drawText(String(value), { x: 200, y, size: 10, font: bold ? boldFont : regularFont, color: white })
    y -= 24
  }

  page.drawText('ORDER DETAILS', { x: 40, y: y + 20, size: 9, font: boldFont, color: indigo })
  y -= 10
  page.drawRectangle({ x: 40, y: y - 2, width: 515, height: 0.5, color: rgb(0.2, 0.2, 0.3) })
  y -= 20

  line('Client Name', order.name)
  line('Phone Number', order.phone)
  line('WhatsApp Number', order.whatsapp)
  line('Site Title', order.siteTitle)
  line('Category', order.category)
  line('Price', `BDT ${order.price.toLocaleString()}`, true)
  if (order.couponCode) line('Event Code', order.couponCode)
  line('Order Date', new Date().toLocaleDateString('en-GB'))
  line('Order Code', order.code, true)

  y -= 10
  page.drawRectangle({ x: 40, y: y - 2, width: 515, height: 0.5, color: rgb(0.2, 0.2, 0.3) })
  y -= 30

  if (order.features?.length) {
    page.drawText('INCLUDED IN THIS SITE', { x: 40, y, size: 9, font: boldFont, color: indigo })
    y -= 20
    order.features.slice(0, 14).forEach(f => {
      page.drawText(`• ${f}`, { x: 40, y, size: 9, font: regularFont, color: rgb(0.7, 0.7, 0.75) })
      y -= 16
    })
  }

  page.drawRectangle({ x: 0, y: 0, width: 595, height: 60, color: rgb(0.08, 0.08, 0.12) })
  page.drawText('This is an auto-generated order confirmation. Contact Kaizo on WhatsApp to proceed.', { x: 40, y: 38, size: 8, font: regularFont, color: muted })
  page.drawText('xaninxz.com  •  xaninstudio@gmail.com', { x: 40, y: 22, size: 8, font: regularFont, color: rgb(0.35, 0.35, 0.45) })

  const bytes = await doc.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `XANINXZ_Premade_${order.code}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Premade() {
  const navigate = useNavigate()
  const location = useLocation()

  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [activeWork, setActiveWork] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  // purchase states
  const [purchasing, setPurchasing] = useState(false)
  const [orderName, setOrderName] = useState('')
  const [orderPhone, setOrderPhone] = useState('')
  const [orderWhatsapp, setOrderWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [orderDone, setOrderDone] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'premade'), orderBy('createdAt', 'desc')))
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setWorks(data)

        // if navigated from Services with openId
        if (location.state?.openId) {
          const found = data.find(w => w.id === location.state.openId)
          if (found) openWork(found)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const openWork = async (work) => {
    setActiveWork(work)
    setActiveImage(0)
    // increment click count
    try {
      await updateDoc(doc(db, 'premade', work.id), { clickCount: increment(1) })
    } catch { }
  }

  const closeWork = () => {
    setActiveWork(null)
    setActiveImage(0)
    setPurchasing(false)
    setOrderName('')
    setOrderPhone('')
    setOrderWhatsapp('')
    setSameAsPhone(false)
    setCouponCode('')
    setCouponMsg('')
    setOrderDone(null)
  }

  const handleCouponChange = (val) => {
    setCouponCode(val)
    setCouponMsg(val.trim() ? 'Kaizo will check your username and confirm your discount.' : '')
  }

  const handleOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim() || !orderWhatsapp.trim() || !activeWork) return
    setOrdering(true)
    const code = generateOrderCode()

    const orderData = {
      code,
      name: orderName,
      phone: orderPhone,
      whatsapp: orderWhatsapp,
      couponCode: couponCode.trim(),
      siteTitle: activeWork.title,
      siteId: activeWork.id,
      category: activeWork.category || 'General',
      price: activeWork.price,
      features: activeWork.features || [],
      type: 'premade',
    }

    await generateOrderPDF(orderData)

    try {
      const { addDoc, serverTimestamp } = await import('firebase/firestore')
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      // increment purchase count
      await updateDoc(doc(db, 'premade', activeWork.id), { purchaseCount: increment(1) })
    } catch { }

    try {
      await fetch(ORDER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🌐 New Premade Site Order!',
            color: 0x6366f1,
            fields: [
              { name: 'Client', value: orderName, inline: true },
              { name: 'Phone', value: orderPhone, inline: true },
              { name: 'WhatsApp', value: orderWhatsapp, inline: true },
              { name: 'Site', value: activeWork.title, inline: false },
              { name: 'Price', value: `BDT ${activeWork.price?.toLocaleString()}`, inline: true },
              { name: 'Order Code', value: code, inline: true },
              { name: 'Event Code', value: couponCode.trim() || 'None', inline: true },
            ],
            footer: { text: 'XANIN XZ Premade Order System' },
            timestamp: new Date().toISOString(),
          }]
        })
      })
    } catch { }

    setOrdering(false)
    setOrderDone({ code, name: orderName, phone: orderPhone, whatsapp: orderWhatsapp })
  }

  const filtered = filter === 'All' ? works : works.filter(w => w.category === filter)

  const whatsappText = orderDone && activeWork
    ? `Hi! I just ordered the premade website *${activeWork.title}* from XANIN XZ.\n\nOrder Code: *${orderDone.code}*\n\nI'd like to discuss the details and get started. 🙂`
    : ''
  const messengerText = orderDone && activeWork
    ? `Hi! I ordered the premade site "${activeWork.title}". Order Code: ${orderDone.code}. Let's get started!`
    : ''

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden" style={{ background: '#080810' }}>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full opacity-[0.07] blur-[120px]" style={{ width: 600, height: 600, top: -100, left: -200, background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute rounded-full opacity-[0.05] blur-[120px]" style={{ width: 500, height: 500, top: 300, right: -150, background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-10 text-sm"
        >
          <ArrowLeft size={16} /> Back to Services
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1] mb-3">Ready to Launch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Premade Websites</h1>
          <p className="text-white/40 text-sm max-w-md">
            Pre-built, polished, and ready to go live. Pick a site, customize your info, launch fast.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap mb-10">
          <Filter size={12} className="text-white/20" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-widest font-mono transition-all"
              style={{
                background: filter === cat ? '#6366f1' : 'rgba(255,255,255,0.04)',
                border: filter === cat ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                color: filter === cat ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Globe size={32} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/20 text-sm">No premade sites in this category yet.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {filtered.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => openWork(work)}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(99,102,241,0.3)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Thumbnail */}
                <div className="w-full h-44 overflow-hidden relative">
                  {work.thumbnail
                    ? <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.08)' }}>
                        <Globe size={36} className="text-[#6366f1] opacity-20" />
                      </div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Category badge */}
                  {work.category && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-full font-mono"
                        style={{ background: 'rgba(99,102,241,0.8)', color: '#fff' }}>
                        {work.category}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  {work.price && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-sm font-bold text-white">৳{work.price.toLocaleString()}</span>
                    </div>
                  )}

                  {/* View icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.8)' }}>
                      <Eye size={16} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="text-white font-semibold text-sm mb-1">{work.title}</h4>
                  <p className="text-white/30 text-xs line-clamp-2 leading-relaxed">{work.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      {work.clickCount > 0 && (
                        <span className="text-white/20 text-[10px]">{work.clickCount} views</span>
                      )}
                      {work.purchaseCount > 0 && (
                        <span className="text-[#6366f1] text-[10px]">{work.purchaseCount} sold</span>
                      )}
                    </div>
                    <span className="text-[#6366f1] text-xs">View →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── WORK DETAIL POPUP ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeWork && !purchasing && !orderDone && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
            onClick={closeWork}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              {/* Image viewer */}
              <div className="relative w-full h-64 overflow-hidden" style={{ background: 'rgba(99,102,241,0.05)' }}>
                {activeWork.images?.length > 0
                  ? <img src={activeWork.images[activeImage]} alt="" className="w-full h-full object-cover" />
                  : activeWork.thumbnail
                    ? <img src={activeWork.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Globe size={48} className="text-[#6366f1] opacity-20" /></div>
                }

                {/* Image dots */}
                {activeWork.images?.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {activeWork.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{ background: idx === activeImage ? '#6366f1' : 'rgba(255,255,255,0.3)' }}
                      />
                    ))}
                  </div>
                )}

                {/* Prev/Next */}
                {activeWork.images?.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage(p => (p - 1 + activeWork.images.length) % activeWork.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>‹</button>
                    <button onClick={() => setActiveImage(p => (p + 1) % activeWork.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>›</button>
                  </>
                )}

                <button onClick={closeWork} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {activeWork.category && (
                      <span className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-full font-mono mr-2"
                        style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                        {activeWork.category}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-xl mt-2">{activeWork.title}</h3>
                    <p className="text-white/40 text-sm mt-1 leading-relaxed">{activeWork.description}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-2xl font-bold text-[#6366f1]">৳{activeWork.price?.toLocaleString()}</p>
                    <p className="text-white/20 text-xs">one-time</p>
                  </div>
                </div>

                {/* Features */}
                {activeWork.features?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-3">What's Included</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activeWork.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check size={11} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-xs">{f}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech stack */}
                {activeWork.stack?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-3">Built With</p>
                    <div className="flex flex-wrap gap-2">
                      {activeWork.stack.map((s, i) => (
                        <span key={i} className="text-[10px] px-3 py-1 rounded-full font-mono"
                          style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6">
                  {activeWork.clickCount > 0 && <p className="text-white/20 text-xs">{activeWork.clickCount} views</p>}
                  {activeWork.purchaseCount > 0 && <p className="text-[#6366f1] text-xs">{activeWork.purchaseCount} purchased</p>}
                </div>

                {/* Live Preview Button */}
                {activeWork.liveUrl && (
                  <a
                    href={activeWork.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm uppercase tracking-widest font-mono mb-3 transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    <Globe size={14} /> Visit Live Site →
                  </a>
                )}

                <button
                  onClick={() => setPurchasing(true)}
                  className="w-full py-3 rounded-xl text-sm uppercase tracking-widest font-mono text-white transition-all"
                  style={{ background: '#6366f1' }}
                >
                  Purchase This Site →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── PURCHASE FORM POPUP ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {purchasing && !orderDone && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center px-4"
            onClick={() => setPurchasing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-lg">{activeWork?.title}</h3>
                  <p className="text-[#6366f1] font-bold text-xl">৳{activeWork?.price?.toLocaleString()}</p>
                </div>
                <button onClick={() => setPurchasing(false)} className="text-white/20 hover:text-white transition"><X size={18} /></button>
              </div>

              <div className="space-y-3 mb-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={orderName}
                  onChange={e => setOrderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={orderPhone}
                  onChange={e => {
                    setOrderPhone(e.target.value)
                    if (sameAsPhone) setOrderWhatsapp(e.target.value)
                  }}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={orderWhatsapp}
                  onChange={e => setOrderWhatsapp(e.target.value)}
                  disabled={sameAsPhone}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none disabled:opacity-50"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <label className="flex items-center gap-2 cursor-pointer px-1">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={e => {
                      setSameAsPhone(e.target.checked)
                      if (e.target.checked) setOrderWhatsapp(orderPhone)
                    }}
                    className="w-3.5 h-3.5 accent-[#6366f1] cursor-pointer"
                  />
                  <span className="text-white/40 text-xs">Same as phone number</span>
                </label>
                <input
                  type="text"
                  placeholder="Event Code (optional)"
                  value={couponCode}
                  onChange={e => handleCouponChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                {couponMsg && <p className="text-[#6366f1] text-xs px-1">{couponMsg}</p>}
              </div>

              <button
                onClick={handleOrder}
                disabled={ordering || !orderName.trim() || !orderPhone.trim() || !orderWhatsapp.trim()}
                className="w-full py-3 rounded-xl text-sm uppercase tracking-widest font-mono text-white transition-all disabled:opacity-40"
                style={{ background: '#6366f1' }}
              >
                {ordering ? 'Processing...' : 'Purchase & Download PDF →'}
              </button>

              <p className="text-white/20 text-xs text-center mt-3">PDF auto-downloads. Then contact Kaizo to proceed.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── ORDER SUCCESS POPUP ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {orderDone && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[70] flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-2xl p-6 text-center"
              style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <Check size={24} className="text-[#6366f1]" />
              </div>

              <h3 className="text-white font-bold text-xl mb-2">Order Placed!</h3>
              <p className="text-white/40 text-sm mb-2">Your PDF has downloaded.</p>

              <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Your Order Code</p>
                <p className="text-[#6366f1] font-mono font-bold text-xl">{orderDone.code}</p>
              </div>

              <p className="text-white/30 text-xs mb-5">Contact Kaizo with your order code to finalize everything.</p>

              <div className="space-y-3 mb-5">
                <a
                  href={`https://wa.me/8801352192471?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-mono text-white"
                  style={{ background: '#25d366' }}
                >
                  WhatsApp — Recommended for Fast Reply
                </a>
                <a
                  href={`https://m.me/xaninkaizo?text=${encodeURIComponent(messengerText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-mono"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                >
                  Messenger
                </a>
              </div>

              <button
                onClick={closeWork}
                className="text-white/20 text-xs hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}