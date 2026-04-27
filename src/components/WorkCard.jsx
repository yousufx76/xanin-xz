import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore'
import { Heart } from 'lucide-react'

export default function WorkCard({ work, onClick }) {
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

  const handleLike = (e) => {
    e.stopPropagation()
    if (liked) return

    const ref = doc(db, 'projects', String(work.id))

    // New Analytics Logic
    const today = new Date().toISOString().split('T')[0]

    // Update individual project likes
    setDoc(ref, { likes: increment(1), title: work.title }, { merge: true })

    // Update daily analytics collection
    setDoc(doc(db, 'analytics', `likes_${today}`), {
      count: increment(1),
      date: today
    }, { merge: true })

    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]')
    localStorage.setItem('likedProjects', JSON.stringify([...likedProjects, work.id]))
    setLiked(true)
  }

  const handleClick = () => {
    const ref = doc(db, 'projects', String(work.id))
    setDoc(ref, { clicks: increment(1), title: work.title }, { merge: true })

    const today = new Date().toISOString().split('T')[0]
    setDoc(doc(db, 'analytics', `clicks_${today}`), { count: increment(1), date: today }, { merge: true })

    onClick(work)
  }

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#6c63ff]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative w-full h-52 overflow-hidden">
        {work.thumbnail ? (
          <img
            src={work.thumbnail}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
            <span className="text-5xl font-bold text-white/10">
              {work.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-3 py-1 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30">
            {work.category}
          </span>
        </div>
        <button
          onClick={handleLike}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${liked
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-black/30 border-white/10 text-white/40 hover:border-rose-500/40 hover:text-rose-400'
            }`}
        >
          <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-medium">{likes}</span>
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-base leading-snug">{work.title}</h3>
          <span className="text-xs text-white/30 shrink-0">{work.year}</span>
        </div>
        <p className="text-sm text-white/40 leading-relaxed line-clamp-2">{work.description}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {work.tools.map((tool) => (
            <span key={tool} className="text-xs px-2 py-1 rounded-md bg-white/[0.05] text-white/30">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}