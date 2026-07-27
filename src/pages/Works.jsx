import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import WorkCard from '../components/WorkCard'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  increment,
  onSnapshot
} from 'firebase/firestore'
import {
  X,
  ExternalLink,
  Clock,
  Wrench,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Heart
} from 'lucide-react'

const categories = ['All', 'Graphic Design', 'Web Development', 'Video Editing']
const projectTypes = ['All Projects', 'Client Work', 'Showcase']

function getYouTubeId(url) {
  const match = url.match(/(?:shorts\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function LikeButton({ work }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const ref = doc(db, 'projects', String(work.id))
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setLikes(snap.data().likes || 0)
    })
    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]')
    setLiked(likedProjects.includes(work.id))
    return () => unsub()
  }, [work.id])

  const handleLike = () => {
    if (liked) return
    const ref = doc(db, 'projects', String(work.id))
    setDoc(ref, { likes: increment(1), title: work.title }, { merge: true })

    const today = new Date().toISOString().split('T')[0]
    setDoc(doc(db, 'analytics', `likes_${today}`), { count: increment(1), date: today }, { merge: true })

    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]')
    localStorage.setItem('likedProjects', JSON.stringify([...likedProjects, work.id]))
    setLiked(true)
  }

  return (
    <button onClick={handleLike}
      className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all active:scale-95 ${liked
          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
          : 'border-white/[0.08] text-white/40 hover:border-rose-500/40 hover:text-rose-400'
        }`}>
      <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
      {likes} {liked ? 'Liked!' : 'Like'}
    </button>
  )
}

function WorkDetail({ work, onClose }) {
  const [showFullImage, setShowFullImage] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#0e0e16] border border-white/[0.08] shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all bg-black/30"
          >
            <X size={15} />
          </button>

          {/* Image / Video */}
          <div className="w-full bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-center">
            {work.video ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(work.video)}`}
                title={work.title}
                className="w-full aspect-video"
                allowFullScreen
              />
            ) : work.thumbnail ? (
              <img
                src={work.thumbnail}
                alt={work.title}
                className={`w-full h-auto object-contain ${work.hidden ? 'blur-md' : ''}`}
              />
            ) : null}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col gap-5">

            {/* Category + Year */}
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30">
                {work.category}
              </span>
              <span className="text-xs text-white/20">{work.year}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {work.title}
            </h2>

            {/* Description */}
            <p className="text-white/40 text-sm leading-relaxed">
              {work.description}
            </p>

            {/* Meta */}
            <div className="flex flex-col gap-3 py-4 border-t border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Calendar size={13} className="text-[#6c63ff]" />
                <span className="text-xs text-white/30 uppercase tracking-widest">Year</span>
                <span className="text-xs text-white ml-auto">{work.year}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={13} className="text-[#6c63ff]" />
                <span className="text-xs text-white/30 uppercase tracking-widest">Time Spent</span>
                <span className="text-xs text-white ml-auto">{work.timeSpent}</span>
              </div>
              {work.tools && work.tools.length > 0 && (
                <div className="flex items-start gap-3">
                  <Wrench size={13} className="text-[#6c63ff] mt-0.5" />
                  <span className="text-xs text-white/30 uppercase tracking-widest">Tools</span>
                  <div className="ml-auto flex flex-wrap gap-1.5 justify-end">
                    {work.tools.map((tool) => (
                      <span key={tool} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.05] text-white/40">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <LikeButton work={work} />
              {work.link && (
                work.hidden ? (
                  <span className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white/20 rounded-full text-sm font-medium cursor-not-allowed">
                    Visit Live <ExternalLink size={13} />
                  </span>
                ) : (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all active:scale-95"
                  >
                    Visit Live <ExternalLink size={13} />
                  </a>
                )
              )}
              {work.video && (
                <a
                  href={work.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 rounded-full text-sm font-medium hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95"
                >
                  Watch Video <ExternalLink size={13} />
                </a>
              )}
              {work.fullImage && (
                <button
                  onClick={() => setShowFullImage(true)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 rounded-full text-sm font-medium hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95 ml-auto"
                >
                  <Maximize2 size={13} /> Full Design
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Full image overlay */}
      <AnimatePresence>
        {showFullImage && work.fullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/98 flex items-center justify-center p-6"
            onClick={() => setShowFullImage(false)}
          >
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={work.fullImage}
              alt={work.title}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Works() {
  const location = useLocation()
  const [active, setActive] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All Projects')
  const [selected, setSelected] = useState(null)
  const [works, setWorks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorks = async () => {
      setIsLoading(true)
      const snap = await getDocs(collection(db, 'projects'))
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p =>
          p.portfolioOnly === true ||
          p.status === "Completed" ||
          p.delivered === true
        )
        .map(p => ({
          ...p,
          category: p.category || p.type || "Other",
          timeSpent: p.timeSpent || p.timeline || "",
          year: p.year || (p.createdAt ? new Date(p.createdAt).getFullYear().toString() : ""),
          link: p.link || p.linkUrl || null,
          isClientWork: !p.portfolioOnly && (p.status === "Completed" || p.delivered),
          hidden: p.hidden || false,
        }))
        .sort((a, b) => {
          const toMs = (d) => {
            if (!d) return 0
            if (typeof d === "string") return new Date(d).getTime()
            if (d.seconds) return d.seconds * 1000
            return 0
          }
          return toMs(b.completedAt || b.createdAt) - toMs(a.completedAt || a.createdAt)
        })
      setWorks(data)
      setIsLoading(false)
      document.dispatchEvent(new Event('render-event'))
    }
    fetchWorks()
  }, [])

  // Auto-open work detail when coming from Home page with openWorkId in state
  useEffect(() => {
    if (!isLoading && works.length > 0 && location.state?.openWorkId) {
      const foundWork = works.find(w => w.id === location.state.openWorkId)
      if (foundWork && !foundWork.hidden) {
        setSelected(foundWork)
        // Clear the state from location to prevent re-opening on refresh
        window.history.replaceState({}, document.title)
      }
    }
  }, [isLoading, works, location.state])

  const filtered = works
    .filter(w => {
      if (typeFilter === 'Client Work') return w.isClientWork
      if (typeFilter === 'Showcase') return w.portfolioOnly && !w.hidden
      return !w.hidden
    })
    .filter(w => active === 'All' || w.category === active)

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase font-bold">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Selected Works</h1>
          <p className="text-white/30 max-w-lg">
            A showcase of my favorite projects in web development, brand identity, and motion design.
          </p>
        </motion.div>

        {/* Project type filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          {projectTypes.map(type => (
            <button key={type} onClick={() => setTypeFilter(type)}
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2 ${typeFilter === type
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                  : 'border-white/[0.08] text-white/30 hover:border-[#6c63ff] hover:text-[#6c63ff]'
                }`}>
              {type === 'Client Work' ? '✓' : type === 'Showcase' ? '◈' : '⊞'} {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 ${active === cat
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                  : 'border-white/[0.08] text-white/30 hover:border-[#6c63ff] hover:text-[#6c63ff]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin" />
            <p className="text-white/20 mt-4 text-sm">Loading projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/20 border border-dashed border-white/[0.06] rounded-3xl">
            No projects found in this category.
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((work) => (
              <motion.div key={work.id} variants={item} className="relative">
                {work.hidden ? (
                  <div className="relative cursor-pointer" onClick={() => setSelected(work)}>
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl">
                      <div className="w-10 h-10 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/30 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-[#6c63ff]/70 uppercase tracking-widest font-bold">Client requested privacy</span>
                    </div>
                    <div className="opacity-40 blur-sm pointer-events-none">
                      <WorkCard work={work} onClick={() => { }} />
                    </div>
                  </div>
                ) : (
                  <>
                    {work.isClientWork ? (
                      <div className="absolute top-3 right-3 z-10 font-mono-lab text-[9px] tracking-widest px-2 py-1 rounded-full"
                        style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
                        ✓ CLIENT WORK
                      </div>
                    ) : work.portfolioOnly ? (
                      <div className="absolute top-3 right-3 z-10 font-mono-lab text-[9px] tracking-widest px-2 py-1 rounded-full"
                        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>
                        ◈ SHOWCASE
                      </div>
                    ) : null}
                    <WorkCard work={work} onClick={setSelected} />
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <WorkDetail work={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  )
}