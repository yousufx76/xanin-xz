import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, setDoc, query, orderBy, increment, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Upload, Plus, X, Heart, MousePointer, Eye, Layers, Code, Video, Palette, Star, TrendingUp, MessageSquare, DollarSign, ChevronRight, Maximize2, Check, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CLOUD_NAME = 'dw0oqo2eu'
const UPLOAD_PRESET = 'xaninxz_uploads'

const categoryIcons = {
  'All': <Layers size={18} />,
  'Graphic Design': <Palette size={18} />,
  'Web Development': <Code size={18} />,
  'Video Editing': <Video size={18} />,
}

function CVUploader() {
  const [uploading, setUploading] = useState(false)
  const [currentCV, setCurrentCV] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchCV = async () => {
      const snap = await getDoc(doc(db, 'stats', 'cv'))
      if (snap.exists()) setCurrentCV(snap.data().url || '')
    }
    fetchCV()
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', 'xaninxz_cv')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST', body: data
      })
      const json = await res.json()
      await setDoc(doc(db, 'stats', 'cv'), { url: json.secure_url })
      setCurrentCV(json.secure_url)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {currentCV && (
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <p className="text-emerald-400 text-xs">CV active</p>
          <a href={currentCV} target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white ml-auto transition-colors">Preview</a>
        </div>
      )}
      <div className="flex gap-3">
        <input
          value={currentCV}
          onChange={e => setCurrentCV(e.target.value)}
          placeholder="Paste Google Drive download link..."
          className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all"
        />
        <button
          onClick={async () => {
            await setDoc(doc(db, 'stats', 'cv'), { url: currentCV })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
          className="px-4 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all"
        >
          {saved ? '✓ Saved!' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function CertificateUploader() {
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', date: '', verifyLink: ''
  })

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleUpload = async () => {
    if (!file || !certForm.title || !certForm.issuer) return
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST', body: data
      })
      const json = await res.json()
      await addDoc(collection(db, 'certificates'), {
        title: certForm.title,
        issuer: certForm.issuer,
        date: certForm.date,
        verifyLink: certForm.verifyLink || '',
        image: json.secure_url,
        createdAt: serverTimestamp()
      })
      setCertForm({ title: '', issuer: '', date: '', verifyLink: '' })
      setFile(null)
      setPreview(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div onClick={() => document.getElementById('certInput').click()}
        className="w-full h-40 rounded-2xl border-2 border-dashed border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-[#6c63ff]/40 transition-all overflow-hidden">
        {preview
          ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
          : <div className="flex flex-col items-center gap-2 text-white/20">
              <Upload size={24} />
              <span className="text-xs uppercase tracking-widest">Upload Certificate Image</span>
            </div>
        }
      </div>
      <input id="certInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
      <input value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })}
        placeholder="Certificate Title"
        className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
      <input value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
        placeholder="Issuer (e.g. Anthropic)"
        className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
      <input value={certForm.date} onChange={e => setCertForm({ ...certForm, date: e.target.value })}
        placeholder="Date (e.g. April 2026)"
        className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
      <input value={certForm.verifyLink} onChange={e => setCertForm({ ...certForm, verifyLink: e.target.value })}
        placeholder="Verify Link (optional)"
        className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
      <button onClick={handleUpload} disabled={uploading}
        className="px-5 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all disabled:opacity-50">
        {uploading ? 'Uploading...' : saved ? '✓ Saved!' : 'Upload Certificate'}
      </button>
    </div>
  )
}

export default function Admin() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth()
  const [stats, setStats] = useState({ visits: 0, projects: [] })
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [form, setForm] = useState({
    title: '', category: 'Graphic Design', description: '',
    tools: '', timeSpent: '', year: '2026', link: '', video: '', editId: ''
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)
  const [homeStats, setHomeStats] = useState({ projects: '50+', clients: '20+', experience: '3+' })
  const [statsSaved, setStatsSaved] = useState(false)
  const [messages, setMessages] = useState([])
  const [graphData, setGraphData] = useState([])
  const [showFullGraph, setShowFullGraph] = useState(false)
  const [income, setIncome] = useState([])
  const [incomeForm, setIncomeForm] = useState({ month: '', amount: '', note: '' })
  const [showIncomeForm, setShowIncomeForm] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    fetchAll()
  }, [isAdmin])

  const fetchAll = async () => {
    // Visits
    const visitsDoc = await getDoc(doc(db, 'stats', 'visits'))
    // Projects
    const projectsSnap = await getDocs(collection(db, 'projects'))
    const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    setStats({ visits: visitsDoc.data()?.count || 0, projects })
    // Home stats
    const homeStatsDoc = await getDoc(doc(db, 'stats', 'homeStats'))
    if (homeStatsDoc.exists()) setHomeStats(homeStatsDoc.data())
    // Messages
    const messagesSnap = await getDocs(collection(db, 'messages'))
    const msgs = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    msgs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    setMessages(msgs)
    // Analytics - last 15 days
    const today = new Date()
    const days = []
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      days.push(dateStr)
    }
    const analyticsSnap = await getDocs(collection(db, 'analytics'))
    const analyticsMap = {}
    analyticsSnap.docs.forEach(d => { analyticsMap[d.id] = d.data() })
    const graph = days.map(date => ({
      date: date.slice(5),
      visits: analyticsMap[`visits_${date}`]?.count || 0,
      likes: analyticsMap[`likes_${date}`]?.count || 0,
      messages: analyticsMap[`messages_${date}`]?.count || 0,
    }))
    setGraphData(graph)
    // Income
    const incomeSnap = await getDocs(collection(db, 'income'))
    const incomeData = incomeSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    incomeData.sort((a, b) => a.id.localeCompare(b.id))
    setIncome(incomeData)
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnail(file)
    setPreview(URL.createObjectURL(file))
  }

  const uploadToCloudinary = async (file) => {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', UPLOAD_PRESET)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: data })
    const json = await res.json()
    return json.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      let thumbnailUrl = ''
      if (thumbnail) thumbnailUrl = await uploadToCloudinary(thumbnail)
      if (form.editId) {
        await updateDoc(doc(db, 'projects', form.editId), {
          title: form.title, category: form.category, description: form.description,
          tools: form.tools.split(',').map(t => t.trim()),
          timeSpent: form.timeSpent, year: form.year,
          link: form.link || '', video: form.video || '',
          ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        })
      } else {
        await addDoc(collection(db, 'projects'), {
          title: form.title, category: form.category, description: form.description,
          tools: form.tools.split(',').map(t => t.trim()),
          timeSpent: form.timeSpent, year: form.year,
          link: form.link || '', video: form.video || '',
          thumbnail: thumbnailUrl, likes: 0, clicks: 0, featured: false,
          createdAt: serverTimestamp()
        })
      }
      setForm({ title: '', category: 'Graphic Design', description: '', tools: '', timeSpent: '', year: '2026', link: '', video: '', editId: '' })
      setThumbnail(null)
      setPreview(null)
      setShowForm(false)
      fetchAll()
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  const markMessage = async (id, status) => {
    await updateDoc(doc(db, 'messages', id), { status })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  const addIncome = async () => {
    if (!incomeForm.month || !incomeForm.amount) return
    await setDoc(doc(db, 'income', incomeForm.month), {
      amount: Number(incomeForm.amount),
      note: incomeForm.note || '',
      month: incomeForm.month
    })
    setIncomeForm({ month: '', amount: '', note: '' })
    setShowIncomeForm(false)
    fetchAll()
  }

  const avgIncome = income.length > 0
    ? Math.round(income.reduce((a, i) => a + (i.amount || 0), 0) / income.length)
    : 0

  const totalLikes = stats.projects.reduce((a, p) => a + (p.likes || 0), 0)
  const totalClicks = stats.projects.reduce((a, p) => a + (p.clicks || 0), 0)
  const pendingMessages = messages.filter(m => m.status === 'pending').length

  const categories = ['All', 'Graphic Design', 'Web Development', 'Video Editing']
  const categoryStats = categories.map(cat => {
    const filtered = cat === 'All' ? stats.projects : stats.projects.filter(p => p.category === cat)
    return {
      name: cat, count: filtered.length,
      likes: filtered.reduce((a, p) => a + (p.likes || 0), 0),
      clicks: filtered.reduce((a, p) => a + (p.clicks || 0), 0),
    }
  })
  const filteredProjects = activeFilter === 'All' ? stats.projects : stats.projects.filter(p => p.category === activeFilter)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0d0d0d] border border-white/[0.08] rounded-xl p-3 text-xs">
          <p className="text-white/40 mb-2">{label}</p>
          {payload.map(p => (
            <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!user) return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center mb-2">
          <Layers size={28} className="text-[#6c63ff]" />
        </div>
        <h1 className="text-white text-2xl font-bold">Admin Access</h1>
        <p className="text-white/30 text-sm">Only authorized personnel allowed.</p>
        <button onClick={loginWithGoogle} className="px-6 py-3 bg-[#6c63ff] text-white rounded-2xl text-sm font-bold hover:bg-[#5a52e0] transition-all">
          Sign in with Google
        </button>
      </motion.div>
    </main>
  )

  if (!isAdmin) return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center">
      <p className="text-red-400 text-sm">Access Denied.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Xena Lab — Restricted</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome back,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c63ff] to-violet-300">Master Kaizo.</span>
              </h1>
              <p className="text-white/30 text-sm">All systems operational. Here's your portfolio intelligence.</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6c63ff] text-white rounded-xl text-sm font-bold hover:bg-[#5a52e0] transition-all">
                {showForm ? <X size={14} /> : <Plus size={14} />}
                {showForm ? 'Cancel' : 'Add Project'}
              </motion.button>
              <button onClick={logout} className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">Logout</button>
            </div>
          </div>
        </motion.div>

        {/* Pending Messages Notification Bar */}
        {pendingMessages > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-red-400 text-sm font-medium">{pendingMessages} pending message{pendingMessages > 1 ? 's' : ''} waiting for review</p>
            </div>
            <ChevronRight size={16} className="text-red-400" />
          </motion.div>
        )}

        {/* Upload Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="bg-white/[0.02] border border-[#6c63ff]/20 rounded-3xl p-8 mb-10 flex flex-col gap-5">
              <h2 className="text-white font-bold text-lg">New Project</h2>
              <div onClick={() => document.getElementById('thumbInput').click()}
                className="w-full h-48 rounded-2xl border-2 border-dashed border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-[#6c63ff]/40 transition-all overflow-hidden">
                {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" /> : (
                  <div className="flex flex-col items-center gap-2 text-white/20">
                    <Upload size={24} />
                    <span className="text-xs uppercase tracking-widest">Upload Thumbnail</span>
                  </div>
                )}
              </div>
              <input id="thumbInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project Title" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-[#6c63ff]/40 transition-all">
                <option value="Graphic Design">Graphic Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Video Editing">Video Editing</option>
              </select>
              <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all resize-none" />
              <input required value={form.tools} onChange={e => setForm({ ...form, tools: e.target.value })} placeholder="Tools (comma separated)" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <input value={form.timeSpent} onChange={e => setForm({ ...form, timeSpent: e.target.value })} placeholder="Time Spent" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
                <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Year" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
              </div>
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="Live Link (optional)" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
              <input value={form.video} onChange={e => setForm({ ...form, video: e.target.value })} placeholder="YouTube Video URL (optional)" className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
              <button type="submit" disabled={uploading} className="w-full py-4 bg-[#6c63ff] text-white rounded-2xl text-sm font-bold hover:bg-[#5a52e0] transition-all disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Save Project'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Visits', value: stats.visits, icon: <Eye size={18} />, color: 'from-[#6c63ff]/20 to-violet-500/5' },
            { label: 'Total Likes', value: totalLikes, icon: <Heart size={18} />, color: 'from-rose-500/20 to-rose-500/5' },
            { label: 'Total Clicks', value: totalClicks, icon: <MousePointer size={18} />, color: 'from-emerald-500/20 to-emerald-500/5' },
            { label: 'Pending Msgs', value: pendingMessages, icon: <MessageSquare size={18} />, color: 'from-yellow-500/20 to-yellow-500/5' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className={`bg-gradient-to-br ${s.color} border border-white/[0.06] rounded-3xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/30 text-xs uppercase tracking-widest">{s.label}</p>
                <span className="text-white/20">{s.icon}</span>
              </div>
              <p className="text-white text-4xl font-bold">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Combined Line Graph */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white font-bold mb-1">Analytics — Last 15 Days</p>
              <p className="text-white/20 text-xs">Visitors, likes and messages over time</p>
            </div>
            <button onClick={() => setShowFullGraph(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] text-white/30 hover:text-white hover:border-[#6c63ff]/40 transition-all text-xs">
              <Maximize2 size={12} /> Expand
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={graphData}>
              <XAxis dataKey="date" stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 10 }} />
              <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#ffffff50' }} />
              <Line type="monotone" dataKey="visits" stroke="#6c63ff" strokeWidth={2} dot={false} name="Visits" />
              <Line type="monotone" dataKey="likes" stroke="#f43f5e" strokeWidth={2} dot={false} name="Likes" />
              <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} dot={false} name="Messages" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Full Graph Modal */}
        <AnimatePresence>
          {showFullGraph && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setShowFullGraph(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0d0d0d] border border-white/[0.08] rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white font-bold text-xl">Detailed Analytics</h2>
                  <button onClick={() => setShowFullGraph(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { key: 'visits', label: 'Visitors', color: '#6c63ff' },
                    { key: 'likes', label: 'Likes', color: '#f43f5e' },
                    { key: 'messages', label: 'Messages', color: '#3b82f6' },
                  ].map(g => (
                    <div key={g.key} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                      <p className="text-white font-semibold mb-4" style={{ color: g.color }}>{g.label}</p>
                      <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={graphData}>
                          <XAxis dataKey="date" stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 10 }} />
                          <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 10 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey={g.key} stroke={g.color} strokeWidth={2} dot={{ fill: g.color, r: 3 }} name={g.label} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-6">
          <p className="text-white font-bold mb-6">Messages & Notifications</p>
          {messages.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No messages yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map(m => (
                <div key={m.id} className={`rounded-2xl p-4 border transition-all ${m.status === 'pending' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/[0.06] bg-white/[0.01]'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {m.status === 'pending' ? <Clock size={12} className="text-yellow-400" /> : <Check size={12} className="text-emerald-400" />}
                        <span className={`text-xs uppercase tracking-widest ${m.status === 'pending' ? 'text-yellow-400' : 'text-emerald-400'}`}>{m.status}</span>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-white/20 text-xs">{m.type === 'form' ? 'Contact Form' : m.type === 'gmail_click' ? 'Gmail Click' : 'WhatsApp Click'}</span>
                      </div>
                      {m.name && <p className="text-white text-sm font-medium">{m.name} <span className="text-white/30 font-normal">— {m.email}</span></p>}
                      {m.message && <p className="text-white/40 text-xs mt-1 leading-relaxed line-clamp-2">{m.message}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {m.status === 'pending' && (
                        <button onClick={() => markMessage(m.id, 'read')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-all">
                          Mark Read
                        </button>
                      )}
                      {m.status === 'read' && (
                        <button onClick={() => markMessage(m.id, 'pending')}
                          className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/30 text-xs hover:text-white transition-all">
                          Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Income */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white font-bold">Income Tracker</p>
            <button onClick={() => setShowIncomeForm(!showIncomeForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#6c63ff] text-xs hover:bg-[#6c63ff]/20 transition-all">
              <Plus size={12} /> Add Income
            </button>
          </div>

          {/* Average Income Card */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-4">
            <p className="text-emerald-400/60 text-xs uppercase tracking-widest mb-2">Monthly Average</p>
            <p className="text-white text-4xl font-bold">৳{avgIncome.toLocaleString()}</p>
            <p className="text-white/20 text-xs mt-1">Based on {income.length} month{income.length !== 1 ? 's' : ''} of data</p>
          </div>

          {/* Add Income Form */}
          <AnimatePresence>
            {showIncomeForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={incomeForm.month} onChange={e => setIncomeForm({ ...incomeForm, month: e.target.value })}
                    placeholder="Month (e.g. 2026-04)"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
                  <input value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                    placeholder="Amount (৳)"
                    type="number"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
                </div>
                <input value={incomeForm.note} onChange={e => setIncomeForm({ ...incomeForm, note: e.target.value })}
                  placeholder="Note (e.g. Nexora Lab project)"
                  className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
                <button onClick={addIncome}
                  className="px-5 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all">
                  Save
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Income List */}
          <div className="flex flex-col gap-2">
            {income.map(i => (
              <div key={i.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <div>
                  <p className="text-white text-sm font-medium">{i.month}</p>
                  {i.note && <p className="text-white/30 text-xs mt-0.5">{i.note}</p>}
                </div>
                <p className="text-emerald-400 font-bold">৳{i.amount?.toLocaleString()}</p>
              </div>
            ))}
            {income.length === 0 && <p className="text-white/20 text-sm text-center py-4">No income recorded yet.</p>}
          </div>
        </motion.div>

        {/* CV / Resume */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-6">
          <p className="text-white font-bold mb-2">CV / Resume</p>
          <p className="text-white/30 text-xs mb-6">Upload your CV as PDF. Anyone who clicks Download on the CV page will get this file.</p>
          <CVUploader />
        </motion.div>

        {/* Certificates */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-6">
          <p className="text-white font-bold mb-2">Certificates</p>
          <p className="text-white/30 text-xs mb-6">Upload certificates to showcase on your About page.</p>
          <CertificateUploader />
        </motion.div>

        {/* Home Stats Editor */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-6">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-6">Homepage Stats</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { key: 'projects', label: 'Projects Completed' },
              { key: 'clients', label: 'Happy Clients' },
              { key: 'experience', label: 'Years Experience' },
            ].map(s => (
              <div key={s.key}>
                <p className="text-white/20 text-xs uppercase tracking-widest mb-2">{s.label}</p>
                <input value={homeStats[s.key]} onChange={e => setHomeStats({ ...homeStats, [s.key]: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#6c63ff]/40 transition-all" />
              </div>
            ))}
          </div>
          <button onClick={async () => {
            await setDoc(doc(db, 'stats', 'homeStats'), homeStats)
            setStatsSaved(true)
            setTimeout(() => setStatsSaved(false), 2000)
          }} className="px-5 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all">
            {statsSaved ? '✓ Saved!' : 'Save Stats'}
          </button>
        </motion.div>

        {/* Category Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {categoryStats.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
              onClick={() => setActiveFilter(cat.name)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${activeFilter === cat.name ? 'bg-[#6c63ff]/20 border-[#6c63ff]/40' : 'bg-white/[0.02] border-white/[0.06] hover:border-[#6c63ff]/30'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${activeFilter === cat.name ? 'text-[#6c63ff]' : 'text-white/20'} transition-colors`}>{categoryIcons[cat.name]}</span>
                <span className="text-xs text-white/20">{cat.count} projects</span>
              </div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${activeFilter === cat.name ? 'text-[#6c63ff]' : 'text-white/40'}`}>
                {cat.name === 'All' ? 'All Work' : cat.name}
              </p>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-xs text-white/30"><Heart size={10} /> {cat.likes}</span>
                <span className="flex items-center gap-1 text-xs text-white/30"><MousePointer size={10} /> {cat.clicks}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-3">
          <p className="text-white/20 text-xs uppercase tracking-widest mb-2">{activeFilter === 'All' ? 'All Projects' : activeFilter} — {filteredProjects.length} total</p>
          <AnimatePresence mode="wait">
            {filteredProjects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between hover:border-white/[0.1] transition-all">
                <div>
                  <p className="text-white font-semibold text-sm">{p.title}</p>
                  <p className="text-white/20 text-xs mt-1">{p.category} · {p.year}</p>
                  <button
                    onClick={() => {
                      setForm({
                        title: p.title, category: p.category, description: p.description,
                        tools: p.tools?.join(', ') || '', timeSpent: p.timeSpent || '',
                        year: p.year, link: p.link || '', video: p.video || '',
                        editId: p.id
                      })
                      setShowForm(true)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="text-[10px] text-[#6c63ff] hover:text-white transition-colors uppercase tracking-widest mt-1"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1 flex items-center gap-1"><Heart size={8} /> Likes</p>
                    <p className="text-white font-bold">{p.likes || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1 flex items-center gap-1"><MousePointer size={8} /> Clicks</p>
                    <p className="text-white font-bold">{p.clicks || 0}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await updateDoc(doc(db, 'projects', p.id), { featured: !p.featured })
                      fetchAll()
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs transition-all ${p.featured ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-yellow-500/30 hover:text-yellow-400'}`}>
                    <Star size={10} fill={p.featured ? 'currentColor' : 'none'} />
                    {p.featured ? 'Featured' : 'Feature'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </main>
  )
}