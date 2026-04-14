import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorkCard from '../components/WorkCard'
import { works } from '../data/works'
import { X, ExternalLink, Clock, Wrench, Calendar } from 'lucide-react'

const categories = ['All', 'Graphic Design', 'Web Development', 'Video Editing']

function getYouTubeId(url) {
  const match = url.match(/(?:shorts\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function WorkDetail({ work, onClose }) {
  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col md:flex-row"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all bg-black/20"
      >
        <X size={18} />
      </button>

      {/* Left - Media */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/[0.06]"
      >
        {work.video ? (
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(work.video)}`}
            title={work.title}
            className="w-full max-w-lg aspect-video rounded-2xl border border-white/[0.08]"
            allowFullScreen
          />
        ) : (
          <img
            src={work.thumbnail}
            alt={work.title}
            className="w-full max-w-lg rounded-2xl border border-white/[0.08] object-cover shadow-2xl"
          />
        )}
      </motion.div>

      {/* Right - Info */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 md:px-12 gap-6 overflow-y-auto py-8"
      >
        <span className="text-xs px-3 py-1 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30 w-fit">
          {work.category}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {work.title}
        </h1>

        <p className="text-[#6b6b7b] leading-relaxed text-sm max-w-md">
          {work.description}
        </p>

        <div className="flex flex-col gap-4 py-4 border-t border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <Calendar size={14} className="text-[#6c63ff]" />
            <span className="text-xs text-[#6b6b7b] uppercase tracking-widest">Year</span>
            <span className="text-sm text-white ml-auto">{work.year}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={14} className="text-[#6c63ff]" />
            <span className="text-xs text-[#6b6b7b] uppercase tracking-widest">Time</span>
            <span className="text-sm text-white ml-auto">{work.timeSpent}</span>
          </div>
          <div className="flex items-start gap-3">
            <Wrench size={14} className="text-[#6c63ff] mt-1" />
            <span className="text-xs text-[#6b6b7b] uppercase tracking-widest">Tools</span>
            <div className="ml-auto flex flex-wrap gap-2 justify-end">
              {work.tools.map((tool) => (
                <span key={tool} className="text-[10px] px-2 py-1 rounded-md bg-[#1e1e2e] text-[#6b6b7b]">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
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
              className="flex items-center gap-2 px-6 py-3 border border-[#1e1e2e] text-[#6b6b7b] rounded-full text-sm font-medium hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95"
            >
              Watch Video <ExternalLink size={14} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Works() {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = active === 'All'
    ? works
    : works.filter((w) => w.category === active)

  // Animation variants for the grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
          <p className="text-[#6b6b7b] max-w-lg">
            A showcase of my favorite projects in web development, brand identity, and motion design.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 ${
                active === cat
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                  : 'border-[#1e1e2e] text-[#6b6b7b] hover:border-[#6c63ff] hover:text-[#6c63ff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#6b6b7b] border border-dashed border-[#1e1e2e] rounded-3xl">
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
              <motion.div key={work.id} variants={item}>
                <WorkCard
                  work={work}
                  onClick={() => setSelected(work)}
                />
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