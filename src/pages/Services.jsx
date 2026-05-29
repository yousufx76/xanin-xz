import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Package, Globe, ShoppingBag, Briefcase, Check, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ── PARTNERSHIP PLANS ──────────────────────────────────────────────
const PARTNERSHIP_PLANS = [
  {
    id: 'starter',
    label: 'STARTER',
    badge: 'SILVER',
    color: { border: 'rgba(148,163,184,0.3)', bg: 'rgba(148,163,184,0.06)', text: '#94a3b8', glow: 'rgba(148,163,184,0.08)' },
    features: [
      '1 specific project covered',
      '1 revision per month per project',
      '48hr bug fix guarantee',
      'Priority WhatsApp support',
      'Code backup monthly',
      'Basic security monitoring',
      'Monthly backup & monitoring',
      'Monthly performance report',
    ],
  },
  {
    id: 'pro',
    label: 'PRO',
    badge: 'GOLD',
    popular: true,
    color: { border: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.06)', text: '#fbbf24', glow: 'rgba(251,191,36,0.1)' },
    features: [
      'All XANIN XZ projects covered',
      '2 revisions per month per project',
      '48hr bug fix guarantee',
      'Priority WhatsApp support',
      'Code backup weekly',
      'Advanced security monitoring',
      'Weekly backup & monitoring',
      'Monthly progress report',
      'SEO health check monthly',
      'Performance optimization quarterly',
      'Emergency support included',
    ],
  },
  {
    id: 'elite',
    label: 'ELITE',
    badge: 'PLATINUM',
    color: { border: 'rgba(168,85,247,0.3)', bg: 'rgba(168,85,247,0.06)', text: '#a855f7', glow: 'rgba(168,85,247,0.1)' },
    features: [
      'All XANIN XZ projects covered',
      '1 revision per month per project',
      '24hr bug fix guarantee',
      'Dedicated support channel',
      'Code + database backup daily',
      'Premium security monitoring',
      'Weekly progress report',
      'SEO health check monthly',
      'Performance optimization monthly',
      'Custom feature addition (1/month)',
      'Analytics report monthly',
      'Priority queue — always first',
    ],
  },
]

// ── WEBSITE PACKAGES ──────────────────────────────────────────────
const PACKAGES = [
  {
    id: 'portfolio',
    icon: Briefcase,
    label: 'Portfolio Website',
    tagline: 'For students, freelancers & job seekers',
    description: 'Stand out online with a stunning personal portfolio that showcases your skills, projects, and story.',
    startingPrice: 3000,
    tiers: [
      {
        id: 'starter', label: 'Starter', price: 3000, delivery: '5–7 Days', revisions: 1,
        features: [
          'Up to 3 Pages',
          'Mobile Responsive Design',
          'Basic Contact Form',
          'Social Media Links Integration',
          'Google Fonts & Custom Color Theme',
          'Smooth Page Transitions (Framer Motion)',
          'Basic SEO Setup (meta tags, title)',
          'Vercel Deployment & Hosting Setup',
          '1 Revision Round',
        ],
      },
      {
        id: 'pro', label: 'Pro', price: 6000, delivery: '7–10 Days', revisions: 2, popular: true,
        features: [
          'Up to 6 Pages',
          'Everything in Starter',
          'Custom Animated Hero Section',
          'Skills & Experience Timeline Section',
          'Portfolio/Works Gallery with Filters',
          'Dark/Light Mode Toggle',
          'EmailJS Contact Form (real email delivery)',
          'Google Analytics Integration',
          'Open Graph Tags (WhatsApp/Facebook preview)',
          'Cloudinary Image Optimization',
          '2 Revision Rounds',
        ],
      },
      {
        id: 'elite', label: 'Elite', price: 10000, delivery: '10–14 Days', revisions: 3,
        features: [
          'Up to 10 Pages',
          'Everything in Pro',
          'Firebase Backend Integration',
          'Admin Panel (add/edit works without coding)',
          'Project Like & View Count Tracking',
          'Visitor Analytics Dashboard',
          'Blog or Certificates Section',
          'Discord Bot Notifications on Contact',
          'Custom Loader Animation',
          'IndexNow & Sitemap for Search Engines',
          'Google & Bing Search Console Setup',
          '3 Revision Rounds',
          '1 Month Free Maintenance',
          'Priority WhatsApp Support',
        ],
      },
    ],
  },
  {
    id: 'business',
    icon: Globe,
    label: 'Business Website',
    tagline: 'For shops, agencies & local businesses',
    description: 'Build a professional online presence that brings in customers and makes your business look credible.',
    startingPrice: 7000,
    tiers: [
      {
        id: 'starter', label: 'Starter', price: 7000, delivery: '7–10 Days', revisions: 1,
        features: [
          'Up to 4 Pages (Home, About, Services, Contact)',
          'Mobile Responsive Design',
          'Business Branding (colors, fonts, logo placement)',
          'Services Section with Cards',
          'Google Maps Embed',
          'Contact Form with EmailJS',
          'Social Media Links',
          'Basic SEO Setup',
          'Vercel Deployment & Hosting Setup',
          'Smooth Animations (Framer Motion)',
          '1 Revision Round',
        ],
      },
      {
        id: 'pro', label: 'Pro', price: 9000, delivery: '10–14 Days', revisions: 2, popular: true,
        features: [
          'Up to 8 Pages',
          'Everything in Starter',
          'Custom Hero with Video/Image Banner',
          'Team Members Section',
          'Testimonials/Reviews Section',
          'Gallery or Portfolio Section',
          'Dark/Light Mode Toggle',
          'Google Analytics Integration',
          'Open Graph & Social Share Tags',
          'WhatsApp Floating Chat Button',
          'Cloudinary Image Optimization',
          '2 Revision Rounds',
        ],
      },
      {
        id: 'elite', label: 'Elite', price: 12000, delivery: '14–18 Days', revisions: 3,
        features: [
          'Up to 15 Pages',
          'Everything in Pro',
          'Firebase Backend (dynamic content management)',
          'Full Admin Panel (edit services/team/gallery)',
          'Client Inquiry Management System',
          'Blog/News Section with Admin Control',
          'Visitor Analytics Dashboard',
          'Discord Notification on New Inquiry',
          'Sitemap & IndexNow SEO Submission',
          'Google & Bing Search Console Setup',
          'Custom Loading Animation',
          '3 Revision Rounds',
          '1 Month Free Maintenance',
          'Priority WhatsApp Support',
        ],
      },
    ],
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    label: 'E-commerce Website',
    tagline: 'For online stores, resellers & entrepreneurs',
    description: 'Launch your online store and start selling. Built to handle real customers, real products, real orders.',
    startingPrice: 10000,
    tiers: [
      {
        id: 'starter', label: 'Starter', price: 10000, delivery: '10–14 Days', revisions: 1,
        features: [
          'Up to 10 Products',
          'Mobile Responsive Design',
          'Product Listing with Images & Prices',
          'Basic Cart System',
          'WhatsApp Order Integration',
          'Contact & Order Form',
          'Social Media Links',
          'Basic SEO Setup',
          'Vercel Deployment',
          'Smooth Animations',
          '1 Revision Round',
        ],
      },
      {
        id: 'pro', label: 'Pro', price: 15000, delivery: '14–18 Days', revisions: 2, popular: true,
        features: [
          'Up to 50 Products',
          'Everything in Starter',
          'Firebase Product Database',
          'Admin Panel (manage products without coding)',
          'Product Categories & Filters',
          'Search Functionality',
          'Cloudinary Image Storage',
          'Customer Review Section',
          'Promo/Coupon Code System',
          'Google Analytics Integration',
          'WhatsApp Floating Button',
          '2 Revision Rounds',
        ],
      },
      {
        id: 'elite', label: 'Elite', price: 20000, delivery: '18–25 Days', revisions: 3,
        features: [
          'Unlimited Products',
          'Everything in Pro',
          'Full Order Management System',
          'Customer Account Creation & Login',
          'Order History & Tracking Page',
          'Email Notifications on Order',
          'Discord Bot for New Order Alerts',
          'Advanced Analytics Dashboard',
          'Inventory Management (stock in/out)',
          'Featured Products & Banner Management',
          'Blog/News Section',
          'Sitemap, IndexNow, Search Console Setup',
          '3 Revision Rounds',
          '1 Month Free Maintenance',
          'Post-delivery 2 Week Bug Fix Guarantee',
          'Priority WhatsApp Support',
        ],
      },
    ],
  },
]

// ── DISCORD WEBHOOK ──────────────────────────────────────────────
const ORDER_WEBHOOK = 'https://discord.com/api/webhooks/1508479052401344592/8oIj22K1s-0whEEIJhpSU7TaNFveXJ7qLDWaG2hGvr1Gj_jXEah-AWQgwAER7c2_pu7p'

// ── GENERATE ORDER CODE ──────────────────────────────────────────
function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'XZ-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ── GENERATE ORDER PDF ────────────────────────────────────────────
async function generateOrderPDF(order) {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842])
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await doc.embedFont(StandardFonts.Helvetica)

  const black = rgb(0.06, 0.06, 0.08)
  const indigo = rgb(0.388, 0.4, 0.945)
  const muted = rgb(0.5, 0.5, 0.55)
  const white = rgb(1, 1, 1)

  // Background
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.05, 0.05, 0.08) })

  // Header bar
  page.drawRectangle({ x: 0, y: 762, width: 595, height: 80, color: indigo })
  page.drawText('XANIN XZ', { x: 40, y: 808, size: 22, font: boldFont, color: white })
  page.drawText('ORDER CONFIRMATION', { x: 40, y: 786, size: 10, font: regularFont, color: rgb(0.8, 0.82, 1) })
  page.drawText(order.code, { x: 595 - 40 - boldFont.widthOfTextAtSize(order.code, 12), y: 800, size: 12, font: boldFont, color: white })

  // Order details
  let y = 700
  const line = (label, value, isBold = false) => {
    page.drawText(label, { x: 40, y, size: 10, font: regularFont, color: muted })
    page.drawText(value, { x: 200, y, size: 10, font: isBold ? boldFont : regularFont, color: white })
    y -= 24
  }

  page.drawText('ORDER DETAILS', { x: 40, y: y + 20, size: 9, font: boldFont, color: indigo })
  y -= 10
  page.drawRectangle({ x: 40, y: y - 2, width: 515, height: 0.5, color: rgb(0.2, 0.2, 0.3) })
  y -= 20

  line('Client Name', order.name)
  line('Contact Number', order.phone)
  line('WhatsApp Number', order.whatsapp)
  line('Package', order.packageLabel)
  line('Tier', order.tierLabel)
  line('Price', `BDT ${order.price.toLocaleString()}`, true)
  line('Delivery Time', order.delivery)
  line('Revisions', `${order.revisions} round(s)`)
  if (order.couponCode) line('Coupon Code', order.couponCode)
  line('Order Date', new Date().toLocaleDateString('en-GB'))
  line('Order Code', order.code, true)

  y -= 10
  page.drawRectangle({ x: 40, y: y - 2, width: 515, height: 0.5, color: rgb(0.2, 0.2, 0.3) })
  y -= 30

  // Included features title
  page.drawText('INCLUDED IN THIS PACKAGE', { x: 40, y, size: 9, font: boldFont, color: indigo })
  y -= 20

  order.features.slice(0, 12).forEach(f => {
    page.drawText(`• ${f}`, { x: 40, y, size: 9, font: regularFont, color: rgb(0.7, 0.7, 0.75) })
    y -= 16
  })

  // Footer
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 60, color: rgb(0.08, 0.08, 0.12) })
  page.drawText('This is an auto-generated order confirmation. Contact Kaizo on WhatsApp to proceed.', { x: 40, y: 38, size: 8, font: regularFont, color: muted })
  page.drawText('xaninxz.com  •  xaninstudio@gmail.com', { x: 40, y: 22, size: 8, font: regularFont, color: rgb(0.35, 0.35, 0.45) })

  const bytes = await doc.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `XANINXZ_Order_${order.code}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Services() {
  const navigate = useNavigate()
  const [activePlan, setActivePlan] = useState(null)
  const [activePackage, setActivePackage] = useState(null) // which website type
  const [activeTier, setActiveTier] = useState(null) // which tier inside popup
  const [purchaseModal, setPurchaseModal] = useState(null) // tier being purchased
  const [premadeWorks, setPremadeWorks] = useState([])
  const [guardClients, setGuardClients] = useState([])

  // order form state
  const [orderName, setOrderName] = useState('')
  const [orderPhone, setOrderPhone] = useState('')
  const [orderWhatsapp, setOrderWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [orderDone, setOrderDone] = useState(null)

  useEffect(() => {
    // Fetch top 6 premade works
    const fetchPremade = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'premade'), orderBy('purchaseCount', 'desc'), limit(6)))
        if (snap.empty) {
          // fallback: any 6
          const all = await getDocs(query(collection(db, 'premade'), limit(6)))
          setPremadeWorks(all.docs.map(d => ({ id: d.id, ...d.data() })))
        } else {
          setPremadeWorks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }
      } catch {
        // silently fail if collection doesn't exist yet
      }
    }

    // Fetch guard clients
    const fetchGuardClients = async () => {
      try {
        const guardsSnap = await getDocs(collection(db, 'guards'))
        const guards = guardsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => g.plan && g.plan !== 'none')
        const clientEmails = guards.map(g => g.clientId)
        if (!clientEmails.length) return
        const clientsSnap = await getDocs(collection(db, 'clients'))
        const clients = clientsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(c => clientEmails.includes(c.id))
        setGuardClients(clients.slice(0, 8))
      } catch { }
    }

    fetchPremade()
    fetchGuardClients()
  }, [])

  // coupon input handler
  const handleCouponChange = (val) => {
    setCouponCode(val)
    if (val.trim().length > 0) {
      setCouponMsg('Kaizo will check your username and confirm your discount.')
    } else {
      setCouponMsg('')
    }
  }

  // submit order
  const handleOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim() || !orderWhatsapp.trim()) return
    setOrdering(true)
    const code = generateOrderCode()
    const pkg = activePackage
    const tier = purchaseModal

    const orderData = {
      code,
      name: orderName,
      phone: orderPhone,
      whatsapp: orderWhatsapp,
      couponCode: couponCode.trim(),
      packageLabel: pkg.label,
      packageId: pkg.id,
      tierLabel: tier.label,
      tierId: tier.id,
      price: tier.price,
      delivery: tier.delivery,
      revisions: tier.revisions,
      features: tier.features,
    }

    // Generate PDF
    await generateOrderPDF(orderData)

    // Save to Firestore
    try {
      const { addDoc, serverTimestamp } = await import('firebase/firestore')
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
    } catch { }

    // Discord notification
    try {
      await fetch(ORDER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🛒 New Package Order!',
            color: 0x6366f1,
            fields: [
              { name: 'Client', value: orderName, inline: true },
              { name: 'Phone', value: orderPhone, inline: true },
              { name: 'WhatsApp', value: orderWhatsapp, inline: true },
              { name: 'Package', value: `${pkg.label} — ${tier.label}`, inline: false },
              { name: 'Price', value: `BDT ${tier.price.toLocaleString()}`, inline: true },
              { name: 'Order Code', value: code, inline: true },
              { name: 'Coupon', value: couponCode.trim() || 'None', inline: true },
              { name: 'Delivery', value: tier.delivery, inline: true },
            ],
            footer: { text: 'XANIN XZ Order System' },
            timestamp: new Date().toISOString(),
          }]
        })
      })
    } catch { }

    setOrdering(false)
    setOrderDone({ code, name: orderName, phone: orderPhone, whatsapp: orderWhatsapp, tier, pkg })
  }

  const whatsappText = orderDone
    ? `Hi! I just ordered the *${orderDone.pkg.label} — ${orderDone.tier.label}* package from XANIN XZ.\n\nOrder Code: *${orderDone.code}*\n\nI'd like to discuss the details. 🙂`
    : ''
  const messengerText = orderDone
    ? `Hi! I just ordered the ${orderDone.pkg.label} — ${orderDone.tier.label} package. Order Code: ${orderDone.code}. Let's discuss the details!`
    : ''

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden" style={{ background: '#080810' }}>

      {/* Background blobs matching homepage */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full opacity-[0.07] blur-[120px]" style={{ width: 600, height: 600, top: -100, left: -200, background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute rounded-full opacity-[0.05] blur-[120px]" style={{ width: 500, height: 500, top: 300, right: -150, background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute rounded-full opacity-[0.04] blur-[100px]" style={{ width: 400, height: 400, bottom: 200, left: '30%', background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-24">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1] mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Services</h1>
          <p className="text-white/40 text-sm max-w-md">
            Professional web design, development, post-delivery protection, and ready-made sites — built for clients who value quality.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════ */}
        {/* ── SECTION 1: PACKAGES ── */}
        {/* ══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-28">
          <div className="flex items-center gap-3 mb-3">
            <Package size={14} className="text-[#6366f1]" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1]">Website Packages</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Pick Your Package</h2>
          <p className="text-white/40 text-sm max-w-lg mb-10">
            Choose the type of website you need. Each package comes in 3 tiers — designed, developed, and delivered by Kaizo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map((pkg, i) => {
              const Icon = pkg.icon
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-300 group"
                  style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1px solid rgba(99,102,241,0.3)'
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Icon size={22} className="text-[#6366f1] mb-4" />
                  <h3 className="text-white font-bold text-lg mb-1">{pkg.label}</h3>
                  <p className="text-white/30 text-xs mb-4">{pkg.tagline}</p>
                  <p className="text-white/50 text-xs mb-6 flex-1 leading-relaxed">{pkg.description}</p>

                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-white">৳{pkg.startingPrice.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => { setActivePackage(pkg); setActiveTier(null) }}
                    className="w-full py-3 rounded-xl text-xs uppercase tracking-widest font-mono text-[#6366f1] transition-all group-hover:bg-[#6366f1] group-hover:text-white"
                    style={{ border: '1px solid rgba(99,102,241,0.3)' }}
                  >
                    See Packages →
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════ */}
        {/* ── SECTION 2: PARTNERSHIP / GUARD ── */}
        {/* ══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-28">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={14} className="text-[#6366f1]" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1]">Post-Delivery Protection</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">XANIN Partnership</h2>
          <p className="text-white/40 text-sm max-w-lg mb-10">
            Your project doesn't end at delivery. XANIN Partnership keeps your website protected — exclusively for XANIN XZ clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {PARTNERSHIP_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="rounded-2xl p-6 relative flex flex-col transition-all duration-300 group"
                style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid ${plan.color.border}`
                  e.currentTarget.style.boxShadow = `0 0 30px ${plan.color.glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: '#fbbf24', color: '#0a0a14' }}>POPULAR</span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.label}</h3>
                  <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: plan.color.text }}>{plan.badge} TIER</span>
                </div>
                <div className="flex-1 space-y-3 mb-6">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <Check size={12} style={{ color: plan.color.text }} className="flex-shrink-0" />
                      <p className="text-white/60 text-sm">{f}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/20">For existing clients only</p>
              </motion.div>
            ))}
          </div>

          {/* Partnership clients */}
          {guardClients.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-4">Partnership Clients</p>
              <div className="flex items-center">
                {guardClients.slice(0, 10).map((client, i) => (
                  <div
                    key={client.id}
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      border: '2px solid #080810',
                      background: client.pfp ? 'transparent' : 'rgba(99,102,241,0.3)',
                      marginLeft: i === 0 ? 0 : '-10px',
                      zIndex: 10 - i,
                      position: 'relative',
                    }}
                    title={client.clientName || client.name || ''}
                  >
                    {client.pfp
                      ? <img src={client.pfp} alt="" className="w-full h-full object-cover" />
                      : (client.clientName || client.name || '?')[0]?.toUpperCase()}
                  </div>
                ))}
                {guardClients.length > 10 && (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{
                      border: '2px solid #080810',
                      background: 'rgba(99,102,241,0.3)',
                      marginLeft: '-10px',
                      position: 'relative',
                      zIndex: 0,
                    }}
                  >
                    +{guardClients.length - 10}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl p-5" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <p className="text-white/30 text-sm">
              XANIN Partnership is exclusively available to clients who have completed a project with XANIN XZ.
              <a href="/contact" className="text-[#6366f1] hover:underline ml-1">Get in touch</a> after your project delivery.
            </p>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════ */}
        {/* ── SECTION 3: PREMADE WEBSITES PREVIEW ── */}
        {/* ══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-[#6366f1]" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1]">Ready-Made Sites</p>
            </div>
            <button
              onClick={() => navigate('/premade')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#6366f1] hover:text-white transition-colors"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Premade Websites</h2>
          <p className="text-white/40 text-sm max-w-lg mb-10">
            Pre-built, ready to launch. Buy a premade site, customize with your info, and go live fast.
          </p>

          {premadeWorks.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/20 text-sm">Premade websites coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {premadeWorks.map((work, i) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => navigate('/premade', { state: { openId: work.id } })}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1px solid rgba(99,102,241,0.3)'
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div className="w-full h-40 overflow-hidden relative">
                    {work.thumbnail
                      ? <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                          <Globe size={32} className="text-[#6366f1] opacity-30" />
                        </div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {work.price && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs font-bold text-white px-2 py-1 rounded-lg" style={{ background: 'rgba(99,102,241,0.8)' }}>
                          ৳{work.price?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold text-sm mb-1">{work.title}</h4>
                    <p className="text-white/30 text-xs line-clamp-2">{work.description}</p>
                    <p className="text-[#6366f1] text-xs mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight size={10} />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/premade')}
            className="w-full py-4 rounded-2xl text-sm uppercase tracking-widest font-mono text-[#6366f1] transition-all hover:bg-[#6366f1] hover:text-white"
            style={{ border: '1px solid rgba(99,102,241,0.2)' }}
          >
            Browse All Premade Websites →
          </button>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── POPUP 1: PACKAGE TIERS (See Packages) ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activePackage && !activeTier && !purchaseModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
            onClick={() => setActivePackage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
              style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1] mb-2">{activePackage.tagline}</p>
                  <h3 className="text-white font-bold text-2xl">{activePackage.label}</h3>
                </div>
                <button onClick={() => setActivePackage(null)} className="text-white/20 hover:text-white transition p-1"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activePackage.tiers.map((tier, i) => (
                  <div
                    key={tier.id}
                    className="rounded-2xl p-5 flex flex-col relative"
                    style={{
                      background: tier.popular ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                      border: tier.popular ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-5">
                        <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: '#6366f1', color: '#fff' }}>POPULAR</span>
                      </div>
                    )}
                    <h4 className="text-white font-bold text-lg mb-1">{tier.label}</h4>
                    <p className="text-2xl font-bold text-[#6366f1] mb-1">৳{tier.price.toLocaleString()}</p>
                    <p className="text-white/30 text-xs mb-4">{tier.delivery} • {tier.revisions} revision{tier.revisions > 1 ? 's' : ''}</p>

                    <div className="flex-1 space-y-2 mb-5">
                      {tier.features.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-2">
                          <Check size={11} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-xs leading-relaxed">{f}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setPurchaseModal(tier)}
                      className="w-full py-3 rounded-xl text-xs uppercase tracking-widest font-mono transition-all text-[#6366f1] hover:bg-[#6366f1] hover:text-white"
                      style={{ border: '1px solid rgba(99,102,241,0.3)' }}
                    >
                      Purchase →
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── POPUP 2: PURCHASE FORM ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {purchaseModal && !orderDone && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center px-4 py-8 overflow-y-auto"
            onClick={() => setPurchaseModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
              style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-lg">{activePackage?.label}</h3>
                  <p className="text-[#6366f1] font-bold text-xl">৳{purchaseModal.price.toLocaleString()} — {purchaseModal.label}</p>
                </div>
                <button onClick={() => setPurchaseModal(null)} className="text-white/20 hover:text-white transition"><X size={18} /></button>
              </div>

              {/* Features list */}
              <div className="rounded-xl p-4 mb-5 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {purchaseModal.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check size={11} className="text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <p className="text-white/50 text-xs">{f}</p>
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={orderName}
                  onChange={e => setOrderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-[#6366f1] transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-[#6366f1] transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={orderWhatsapp}
                  onChange={e => setOrderWhatsapp(e.target.value)}
                  disabled={sameAsPhone}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-[#6366f1] transition-colors disabled:opacity-50"
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
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-[#6366f1] transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                {couponMsg && (
                  <p className="text-[#6366f1] text-xs px-1">{couponMsg}</p>
                )}
              </div>

              <button
                onClick={handleOrder}
                disabled={ordering || !orderName.trim() || !orderPhone.trim() || !orderWhatsapp.trim()}
                className="w-full py-3 rounded-xl text-sm uppercase tracking-widest font-mono text-white transition-all disabled:opacity-40"
                style={{ background: '#6366f1' }}
              >
                {ordering ? 'Processing...' : 'Purchase & Download PDF →'}
              </button>

              <p className="text-white/20 text-xs text-center mt-3">A PDF will auto-download. Then contact Kaizo to proceed.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── POPUP 3: ORDER SUCCESS ── */}
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
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <Check size={24} className="text-[#6366f1]" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Order Placed!</h3>
              <p className="text-white/40 text-sm mb-2">Your PDF has downloaded.</p>
              <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Your Order Code</p>
                <p className="text-[#6366f1] font-mono font-bold text-xl">{orderDone.code}</p>
              </div>

              <p className="text-white/30 text-xs mb-5">Contact Kaizo with your order code to discuss and finalize everything.</p>

              <div className="space-y-3 mb-5">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/8801352192471?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-mono transition-all text-white"
                  style={{ background: '#25d366' }}
                >
                  WhatsApp — Recommended for Fast Reply
                </a>
                {/* Messenger */}
                <a
                  href={`https://m.me/xaninkaizo?text=${encodeURIComponent(messengerText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-mono transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                >
                  Messenger
                </a>
              </div>

              <button
                onClick={() => { 
                  setOrderDone(null); 
                  setPurchaseModal(null); 
                  setActivePackage(null); 
                  setOrderName(''); 
                  setOrderPhone(''); 
                  setOrderWhatsapp(''); 
                  setSameAsPhone(false); 
                  setCouponCode(''); 
                  setCouponMsg('') 
                }}
                className="text-white/20 text-xs hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GUARD PLAN DETAIL POPUP (showcase only) ── */}
      <AnimatePresence>
        {activePlan && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setActivePlan(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#0d0d1a', border: `1px solid ${activePlan.color.border}` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-xl">{activePlan.label}</h3>
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: activePlan.color.text }}>{activePlan.badge} TIER</span>
                </div>
                <button onClick={() => setActivePlan(null)} className="text-white/20 hover:text-white transition p-1"><X size={18} /></button>
              </div>
              <div className="space-y-3 mb-6">
                {activePlan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: `${activePlan.color.text}08`, border: `1px solid ${activePlan.color.text}15` }}>
                    <Check size={13} style={{ color: activePlan.color.text }} className="flex-shrink-0" />
                    <p className="text-white/70 text-sm">{f}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-white/30 text-xs">Available to existing XANIN XZ clients only. Pricing discussed after project delivery.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}