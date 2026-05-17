import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const STAR_COLOR = "#6c63ff"

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [happyClients, setHappyClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("reviews")
  const [ratingFilter, setRatingFilter] = useState(0)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const [reviewsSnap, clientsSnap] = await Promise.all([
        getDocs(collection(db, 'reviews')),
        getDocs(collection(db, 'clients')),
      ])
      const reviewsData = reviewsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.hidden !== true)
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      setReviews(reviewsData)

      const clientsData = clientsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.happyClient === true)
      setHappyClients(clientsData)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—"

  const satisfactionRate = reviews.length > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)
    : 0

  const filteredReviews = ratingFilter === 0
    ? reviews
    : reviews.filter(r => r.rating === ratingFilter)

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-white/30 text-sm tracking-widest font-mono">// LOADING...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link to="/"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-sm mb-10">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#6c63ff]" />
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase font-bold">Reviews</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What clients say~
          </h1>
          <p className="text-white/30 max-w-lg text-sm leading-relaxed">
            Real feedback from real projects delivered through XANIN LAB.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Reviews", value: reviews.length },
            { label: "Average Rating", value: `${avgRating}★` },
            { label: "Satisfaction", value: `${satisfactionRate}%` },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-white mb-1" style={{ color: STAR_COLOR }}>{s.value}</p>
              <p className="text-white/30 text-xs tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {[
            { key: "reviews", label: `Reviews (${reviews.length})` },
            { key: "happy", label: `Happy Clients (${happyClients.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                  : 'border-white/[0.08] text-white/30 hover:border-[#6c63ff] hover:text-[#6c63ff]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews tab */}
        <AnimatePresence mode="wait">
          {activeTab === "reviews" && (
            <motion.div key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>

              {/* Star filter */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-white/30 text-xs tracking-widest uppercase">Filter:</span>
                <button onClick={() => setRatingFilter(0)}
                  className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                    ratingFilter === 0
                      ? 'border-[#6c63ff] text-[#6c63ff] bg-[#6c63ff]/10'
                      : 'border-white/[0.08] text-white/30'
                  }`}>
                  All
                </button>
                {[5,4,3,2,1].map(star => (
                  <button key={star} onClick={() => setRatingFilter(star)}
                    className={`text-xs px-4 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                      ratingFilter === star
                        ? 'border-[#6c63ff] text-[#6c63ff] bg-[#6c63ff]/10'
                        : 'border-white/[0.08] text-white/30'
                    }`}>
                    {star}★
                    <span className="text-white/20 text-[10px]">
                      ({reviews.filter(r => r.rating === star).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Star breakdown bar */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-5xl font-bold text-white">{avgRating}</p>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= Math.round(parseFloat(avgRating)) ? STAR_COLOR : "#1f2937", fontSize: "18px" }}>★</span>
                      ))}
                    </div>
                    <p className="text-white/30 text-xs">{reviews.length} reviews · {satisfactionRate}% satisfaction</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length
                    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-white/30 text-xs w-4">{star}★</span>
                        <div className="flex-1 rounded-full h-1.5 bg-white/[0.06]">
                          <div className="h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: STAR_COLOR }} />
                        </div>
                        <span className="text-white/20 text-xs w-6">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Review cards */}
              {filteredReviews.length === 0 ? (
                <div className="text-center py-20 text-white/20 border border-dashed border-white/[0.06] rounded-3xl">
                  No reviews for this rating.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredReviews.map((review, i) => (
                    <motion.div key={review.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-[#6c63ff]/30 transition-all duration-300 relative">

                      {review.pinned && (
                        <div className="absolute top-4 right-4 text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#6c63ff" }}>
                          📌 FEATURED
                        </div>
                      )}
                      {review.isLegacy && (
                        <div className="absolute top-4 right-4 text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", color: "#eab308" }}>
                          ⭐ LEGACY
                        </div>
                      )}

                      <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: s <= review.rating ? STAR_COLOR : "#1f2937", fontSize: "14px" }}>★</span>
                        ))}
                      </div>

                      <p className="text-white/50 text-sm leading-relaxed mb-5 italic">
                        "{review.review}"
                      </p>

                      {review.feedbackTags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {review.feedbackTags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full text-white/30"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "rgba(99,102,241,0.3)" }}>
                          {review.clientPfp
                            ? <img src={review.clientPfp} alt="" className="w-full h-full object-cover" />
                            : review.clientName?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{review.clientName}</p>
                          <p className="text-white/20 text-xs truncate">{review.projectTitle}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[#6c63ff] text-[10px] font-mono tracking-widest">VERIFIED ✓</span>
                          {review.createdAt && (
                            <span className="text-white/20 text-[10px]">
                              {new Date(review.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Happy Clients tab */}
          {activeTab === "happy" && (
            <motion.div key="happy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>
              {happyClients.length === 0 ? (
                <div className="text-center py-20 text-white/20 border border-dashed border-white/[0.06] rounded-3xl">
                  No happy clients marked yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {happyClients.map((client, i) => (
                    <motion.div key={client.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-[#6c63ff]/30 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-lg font-bold"
                          style={{ background: "rgba(99,102,241,0.3)", border: "2px solid rgba(99,102,241,0.2)" }}>
                          {client.pfp
                            ? <img src={client.pfp} alt="" className="w-full h-full object-cover" />
                            : (client.clientName || client.name || client.id)?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">
                            {client.clientName || client.name || "Client"}
                          </p>
                          {client.company && (
                            <p className="text-white/30 text-xs truncate">{client.company}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded-full"
                          style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                          ✦ HAPPY CLIENT
                        </span>
                        {client.joinedAt && (
                          <span className="text-white/20 text-[10px]">
                            {new Date(client.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}