import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { motion, AnimatePresence } from 'framer-motion'

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1506650719531565056/yFdnPvz-SsmUBQ7mCO1rkaJ2AZTB2aPLE9t3VqieBaBv2tYk5wNQhmzfrxf9xKKhsdUS'

const SOCIALS = [
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/@xaninxz',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/xaninxz',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.2-4.8-1.7-5-5C2.1 15.6 2 15.3 2 12s0-3.6.1-4.8c.2-3.3 1.7-4.8 5-5 1.2-.1 1.6-.1 4.9-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12s0 3.7.1 4.9C.3 21.3 2.7 23.7 7.1 23.9 8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61589721403702',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.9v2.2h3.3l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z"/>
      </svg>
    ),
  },
]

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function CountdownTimer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt) - new Date()
      if (diff <= 0) { setTimeLeft('Expired'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`)
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [expiresAt])

  return <span>{timeLeft}</span>
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(null) // active event id
  const [followed, setFollowed] = useState({ youtube: false, instagram: false, facebook: false })
  const [usernames, setUsernames] = useState({ youtube: '', instagram: '', facebook: '' })
  const [eventCode, setEventCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [coupon, setCoupon] = useState(null) // { code, eventTitle, discount, claimedAt }
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, 'events'))
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Sort: active first, then expired
        data.sort((a, b) => {
          const aExp = isExpired(a)
          const bExp = isExpired(b)
          if (aExp && !bExp) return 1
          if (!aExp && bExp) return -1
          return 0
        })
        setEvents(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
        document.dispatchEvent(new Event('render-event'))
      }
    }
    fetchEvents()
  }, [])

  const isExpired = (event) => {
    const limitHit = event.limit && event.claimedCount >= event.limit
    const dateExpired = event.expiresAt && new Date(event.expiresAt) < new Date()
    return limitHit || dateExpired
  }

  const allFollowed = SOCIALS.every(s => followed[s.id] && usernames[s.id].trim())

  const handleFollow = (social) => {
    window.open(social.url, '_blank', 'noopener,noreferrer')
    setTimeout(() => {
      setFollowed(prev => ({ ...prev, [social.id]: true }))
    }, 1500)
  }

  const handleClaim = async (event) => {
    setError('')
    if (!allFollowed) { setError('Please follow all 3 socials and enter your usernames first.'); return }
    setSubmitting(true)
    try {
      // Check if limit still valid (use claimedCount from event doc)
      if (event.limit && (event.claimedCount || 0) >= event.limit) {
        setError('Sorry, this offer has reached its limit.'); setSubmitting(false); return
      }
      const code = generateCode()
      const claimedAt = new Date().toISOString()
      await addDoc(collection(db, 'coupons'), {
        eventId: event.id,
        eventTitle: event.title,
        code,
        usernames,
        eventCode: eventCode.trim() || null,
        claimedAt,
        redeemed: false,
      })

      // Discord notification
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🎟️ New Coupon Claimed',
            color: 0x6366f1,
            fields: [
              { name: 'Event', value: event.title, inline: true },
              { name: 'Code', value: `\`${code}\``, inline: true },
              { name: 'YouTube', value: usernames.youtube || '—', inline: true },
              { name: 'Instagram', value: usernames.instagram || '—', inline: true },
              { name: 'Facebook', value: usernames.facebook || '—', inline: true },
              { name: 'Event Code Used', value: eventCode || 'None', inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      })

      setCoupon({ code, eventTitle: event.title, discount: event.discount, claimedAt, templateUrl: event.templateUrl || null })
      generateCouponDownload({ code, eventTitle: event.title, discount: event.discount, claimedAt, templateUrl: event.templateUrl || null })
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const generateCouponDownload = ({ code, eventTitle, discount, claimedAt }) => {
    // Canvas-based coupon generation
    const canvas = document.createElement('canvas')
    canvas.width = 900
    canvas.height = 420
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, 900, 420)

    // Border glow
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, 880, 400)

    // Inner accent line
    ctx.strokeStyle = 'rgba(99,102,241,0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(18, 18, 864, 384)

    // XANIN XZ branding
    ctx.fillStyle = '#6366f1'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('XANIN XZ', 50, 65)

    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '12px sans-serif'
    ctx.fillText('OFFICIAL OFFER COUPON', 50, 88)

    // Divider
    ctx.strokeStyle = 'rgba(99,102,241,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, 105)
    ctx.lineTo(850, 105)
    ctx.stroke()

    // Event title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(eventTitle, 50, 155)

    // Discount
    ctx.fillStyle = '#6366f1'
    ctx.font = 'bold 52px sans-serif'
    ctx.fillText(discount, 50, 240)

    // Code label
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '13px sans-serif'
    ctx.fillText('YOUR CLAIM CODE', 50, 295)

    // Code box
    ctx.fillStyle = 'rgba(99,102,241,0.15)'
    ctx.beginPath()
    ctx.roundRect(50, 308, 220, 56, 8)
    ctx.fill()
    ctx.strokeStyle = 'rgba(99,102,241,0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(50, 308, 220, 56, 8)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px monospace'
    ctx.fillText(code, 80, 344)

    // Claimed date
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '11px sans-serif'
    ctx.fillText(`Claimed: ${new Date(claimedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, 50, 385)

    // Verification note
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('We will verify your following before the offer applies.', 850, 385)

    // Right side decoration
    ctx.fillStyle = 'rgba(99,102,241,0.08)'
    ctx.beginPath()
    ctx.arc(780, 210, 140, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(99,102,241,0.06)'
    ctx.beginPath()
    ctx.arc(780, 210, 100, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(99,102,241,0.5)'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('xaninxz.com', 780, 215)

    // Auto download
    const link = document.createElement('a')
    link.download = `XANIN-XZ-coupon-${code}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const resetClaim = () => {
    setClaiming(null)
    setFollowed({ youtube: false, instagram: false, facebook: false })
    setUsernames({ youtube: '', instagram: '', facebook: '' })
    setEventCode('')
    setCoupon(null)
    setError('')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1] mb-3">Limited Time</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events & Offers</h1>
          <p className="text-white/40 text-sm max-w-md">Follow along and claim exclusive discounts. Limited slots available.</p>
        </motion.div>

        {/* No events */}
        {events.length === 0 && (
          <div className="text-center py-24 text-white/20 text-sm tracking-widest uppercase">No events yet</div>
        )}

        {/* Event Cards */}
        <div className="flex flex-col gap-6">
          {events.map((event, i) => {
            const expired = isExpired(event)
            const isActive = claiming === event.id

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  expired
                    ? 'border-white/5 bg-white/[0.02]'
                    : 'border-[#6366f1]/20 bg-[rgba(10,10,20,0.8)]'
                }`}
              >
                {/* Card Header */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {expired ? (
                          <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-white/10 text-white/30">Expired</span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-[#6366f1]/40 text-[#6366f1] bg-[#6366f1]/10">Active</span>
                        )}
                        {event.limit && (
                          <span className="text-[9px] text-white/30 uppercase tracking-widest">
                            {event.claimedCount || 0}/{event.limit} claimed
                          </span>
                        )}
                      </div>
                      <h2 className={`text-xl md:text-2xl font-bold mb-1 ${expired ? 'text-white/30' : 'text-white'}`}>
                        {event.title}
                      </h2>
                      {event.description && (
                        <p className={`text-sm ${expired ? 'text-white/20' : 'text-white/50'}`}>{event.description}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className={`text-3xl font-bold ${expired ? 'text-white/20' : 'text-[#6366f1]'}`}>
                        {event.discount}
                      </div>
                      {event.expiresAt && !expired && (
                        <div className="text-[10px] text-white/30 mt-1">
                          <CountdownTimer expiresAt={event.expiresAt} />
                        </div>
                      )}
                      {expired && event.expiresAt && (
                        <div className="text-[10px] text-white/20 mt-1">
                          Ended {new Date(event.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>

                  {!expired && !isActive && (
                    <button
                      onClick={() => { setClaiming(event.id); setCoupon(null); setError('') }}
                      className="mt-2 px-6 py-2.5 rounded-full bg-[rgba(99,102,241,0.85)] hover:bg-[#6366f1] text-white text-xs uppercase tracking-[0.3em] transition-all duration-300"
                    >
                      Claim Offer
                    </button>
                  )}
                </div>

                {/* Claim Panel */}
                <AnimatePresence>
                  {isActive && !coupon && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[#6366f1]/10 px-6 md:p-8 py-6 bg-[rgba(99,102,241,0.04)]"
                    >
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-6">
                        Follow all 3 and enter your usernames to claim
                      </p>

                      <div className="flex flex-col gap-4 mb-6">
                        {SOCIALS.map(social => (
                          <div key={social.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <button
                              onClick={() => handleFollow(social)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all duration-300 w-fit ${
                                followed[social.id]
                                  ? 'border-green-500/40 text-green-400 bg-green-500/10'
                                  : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                              }`}
                            >
                              <span style={{ color: followed[social.id] ? undefined : social.color }}>
                                {social.icon}
                              </span>
                              {followed[social.id] ? `✓ ${social.label}` : `Follow on ${social.label}`}
                            </button>

                            {followed[social.id] && (
                              <motion.input
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                type="text"
                                placeholder={`Your ${social.label} username`}
                                value={usernames[social.id]}
                                onChange={e => setUsernames(prev => ({ ...prev, [social.id]: e.target.value }))}
                                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#6366f1]/50 transition-all w-full sm:w-64"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {error && <p className="text-red-400/80 text-xs mb-4">{error}</p>}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleClaim(event)}
                          disabled={submitting || !allFollowed}
                          className="px-6 py-2.5 rounded-full bg-[rgba(99,102,241,0.85)] hover:bg-[#6366f1] text-white text-xs uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Claiming...' : 'Get My Coupon'}
                        </button>
                        <button
                          onClick={resetClaim}
                          className="px-6 py-2.5 rounded-full border border-white/10 text-white/40 text-xs uppercase tracking-[0.3em] hover:text-white hover:border-white/30 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Coupon Display */}
                  {isActive && coupon && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-[#6366f1]/10 px-6 md:px-8 py-6 bg-[rgba(99,102,241,0.04)]"
                    >
                      <p className="text-green-400 text-xs uppercase tracking-widest mb-4">✓ Coupon claimed successfully</p>

                      <div className="inline-block rounded-2xl border border-[#6366f1]/30 bg-[rgba(99,102,241,0.08)] px-8 py-6 mb-4">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Your claim code</p>
                        <p className="text-3xl font-mono font-bold text-white tracking-[0.3em]">{coupon.code}</p>
                        <p className="text-xs text-white/30 mt-3">{coupon.discount} off — {coupon.eventTitle}</p>
                      </div>

                      <p className="text-white/30 text-xs mb-4">
                        Your coupon has been downloaded automatically. We'll verify your following before the offer applies.
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => generateCouponDownload(coupon)}
                          className="px-6 py-2.5 rounded-full border border-[#6366f1]/40 text-[#6366f1] text-xs uppercase tracking-[0.3em] hover:bg-[#6366f1]/10 transition-all duration-300"
                        >
                          Download Again
                        </button>
                        <button
                          onClick={resetClaim}
                          className="px-6 py-2.5 rounded-full border border-white/10 text-white/40 text-xs uppercase tracking-[0.3em] hover:text-white hover:border-white/30 transition-all duration-300"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}