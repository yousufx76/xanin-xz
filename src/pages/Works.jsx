import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all active:scale-95 ${
        liked
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all bg-black/20"
        >
          <X size={18} />
        </button>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/[0.06] relative"
        >
          {work.video ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(work.video)}`}
              title={work.title}
              className="w-full max-w-lg aspect-video rounded-2xl border border-white/[0.08]"
              allowFullScreen
            />
          ) : work.thumbnail ? (
            <>
              <img
                src={work.thumbnail}
                alt={work.title}
                className="w-full max-w-lg rounded-2xl border border-white/[0.08] object-cover shadow-2xl"
              />
              {work.fullImage && (
                <button
                  onClick={() => setShowFullImage(true)}
                  className="absolute bottom-10 right-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/50 hover:text-white hover:border-[#6c63ff]/50 transition-all text-xs tracking-widest uppercase"
                >
                  <Maximize2 size={12} />
                  Full Design
                  <ChevronRight size={12} />
                </button>
              )}
            </>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 md:px-12 gap-6 overflow-y-auto py-8"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30 w-fit">
              {work.category}
            </span>
            <span className="text-xs text-white/20">{work.year}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {work.title}
          </h1>

          <p className="text-white/40 leading-relaxed text-sm max-w-md">
            {work.description}
          </p>

          <div className="flex flex-col gap-4 py-4 border-t border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Calendar size={14} className="text-[#6c63ff]" />
              <span className="text-xs text-white/30 uppercase tracking-widest">Year</span>
              <span className="text-sm text-white ml-auto">{work.year}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-[#6c63ff]" />
              <span className="text-xs text-white/30 uppercase tracking-widest">Time</span>
              <span className="text-sm text-white ml-auto">{work.timeSpent}</span>
            </div>
            <div className="flex items-start gap-3">
              <Wrench size={14} className="text-[#6c63ff] mt-1" />
              <span className="text-xs text-white/30 uppercase tracking-widest">Tools</span>
              <div className="ml-auto flex flex-wrap gap-2 justify-end">
                {work.tools && work.tools.map((tool) => (
                  <span key={tool} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.05] text-white/30">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <LikeButton work={work} />
            {work.link && (
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all active:scale-95"
              >
                Visit Live <ExternalLink size={14} />
              </a>
            )}
            {work.video && (
              <a
                href={work.video}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-white/[0.08] text-white/40 rounded-full text-sm font-medium hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95"
              >
                Watch Video <ExternalLink size={14} />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showFullImage && work.fullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/98 flex items-center justify-center p-6"
          >
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={work.fullImage}
              alt={work.title}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Works() {
  const [active, setActive] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All Projects')
  const [selected, setSelected] = useState(null)
  const [works, setWorks] = useState([])

  useEffect(() => {
    const fetchWorks = async () => {
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
        }))
        .sort((a, b) => {
          const dateA = a.completedAt || a.createdAt || ""
          const dateB = b.completedAt || b.createdAt || ""
          return dateB.localeCompare(dateA)
        })
      setWorks(data)
    }
    fetchWorks()
  }, [])

  const filtered = works
    .filter(w => {
      if (typeFilter === 'Client Work') return w.isClientWork
      if (typeFilter === 'Showcase') return w.portfolioOnly
      return true
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
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                typeFilter === type
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
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 ${
                active === cat
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                  : 'border-white/[0.08] text-white/30 hover:border-[#6c63ff] hover:text-[#6c63ff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
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
                {work.isClientWork && (
                  <div className="absolute top-3 left-3 z-10 font-mono-lab text-[9px] tracking-widest px-2 py-1 rounded-full"
                    style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
                    ✓ CLIENT WORK
                  </div>
                )}
                {work.portfolioOnly && (
                  <div className="absolute top-3 left-3 z-10 font-mono-lab text-[9px] tracking-widest px-2 py-1 rounded-full"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>
                    ◈ SHOWCASE
                  </div>
                )}
                <WorkCard work={work} onClick={setSelected} />
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