import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, setDoc, serverTimestamp, increment, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Upload, Plus, X, Heart, MousePointer, Eye, Layers, Code, Video, Palette, Star, MessageSquare, ChevronRight, Maximize2, Check, Clock } from 'lucide-react'
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

// ─── CV Uploader ──────────────────────────────────────────────────────────────
function CVUploader() {
  const [currentCV, setCurrentCV] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'stats', 'cv')).then(snap => {
      if (snap.exists()) setCurrentCV(snap.data().url || '')
    }).catch(() => {})
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/30 text-xs">Paste Google Drive download link or upload image.</p>
      {currentCV && (
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <p className="text-emerald-400 text-xs">CV active</p>
          <a href={currentCV} target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white ml-auto transition-colors">Preview</a>
        </div>
      )}
      <div className="flex gap-3">
        <input value={currentCV} onChange={e => setCurrentCV(e.target.value)}
          placeholder="Paste Google Drive download link..."
          className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
        <button onClick={async () => {
          await setDoc(doc(db, 'stats', 'cv'), { url: currentCV })
          setSaved(true); setTimeout(() => setSaved(false), 2000)
        }} className="px-4 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all">
          {saved ? '✓ Saved!' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ─── Certificate Uploader ─────────────────────────────────────────────────────
function CertificateUploader() {
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [certForm, setCertForm] = useState({ title: '', issuer: '', date: '', verifyLink: '' })

  const handleUpload = async () => {
    if (!file || !certForm.title || !certForm.issuer) return
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: data })
      const json = await res.json()
      await addDoc(collection(db, 'certificates'), {
        ...certForm, image: json.secure_url, createdAt: serverTimestamp()
      })
      setCertForm({ title: '', issuer: '', date: '', verifyLink: '' })
      setFile(null); setPreview(null)
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div onClick={() => document.getElementById('certInput').click()}
        className="w-full h-32 rounded-2xl border-2 border-dashed border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-[#6c63ff]/40 transition-all overflow-hidden">
        {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
          : <div className="flex flex-col items-center gap-2 text-white/20"><Upload size={20} /><span className="text-xs uppercase tracking-widest">Upload Certificate</span></div>}
      </div>
      <input id="certInput" type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files[0]; if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)) }} />
      {['title', 'issuer', 'date', 'verifyLink'].map(field => (
        <input key={field} value={certForm[field]} onChange={e => setCertForm({ ...certForm, [field]: e.target.value })}
          placeholder={field === 'verifyLink' ? 'Verify Link (optional)' : field.charAt(0).toUpperCase() + field.slice(1)}
          className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all" />
      ))}
      <button onClick={handleUpload} disabled={uploading}
        className="px-5 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all disabled:opacity-50">
        {uploading ? 'Uploading...' : saved ? '✓ Saved!' : 'Upload Certificate'}
      </button>
    </div>
  )
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inp = "bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#6c63ff]/40 transition-all"

// ─── Main Admin ───────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState({ visits: 0, projects: [] })
  const [messages, setMessages] = useState([])
  const [graphData, setGraphData] = useState([])
  const [income, setIncome] = useState([])
  const [homeStats, setHomeStats] = useState({ projects: '50+', clients: '20+' })
  const [statsSaved, setStatsSaved] = useState(false)
  const [incomeForm, setIncomeForm] = useState({ month: '', amount: '', note: '' })
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)
  const [showFullGraph, setShowFullGraph] = useState(false)
  const [form, setForm] = useState({
    title: '', category: 'Graphic Design', description: '',
    tools: '', timeSpent: '', year: new Date().getFullYear().toString(),
    link: '', video: '', editId: ''
  })

  useEffect(() => { if (isAdmin) fetchAll() }, [isAdmin])

  async function fetchAll() {
    try {
      const [visitsDoc, projectsSnap, homeStatsDoc, messagesSnap, analyticsSnap, incomeSnap] = await Promise.all([
        getDoc(doc(db, 'stats', 'visits')).catch(() => null),
        getDocs(collection(db, 'projects')),
        getDoc(doc(db, 'stats', 'homeStats')).catch(() => null),
        getDocs(collection(db, 'messages')).catch(() => ({ docs: [] })),
        getDocs(collection(db, 'analytics')).catch(() => ({ docs: [] })),
        getDocs(collection(db, 'income')).catch(() => ({ docs: [] })),
      ])

      const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      setStats({ visits: visitsDoc?.data()?.count || 0, projects })

      if (homeStatsDoc?.exists()) setHomeStats(homeStatsDoc.data())

      const msgs = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      msgs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setMessages(msgs)

      const today = new Date()
      const days = Array.from({ length: 15 }, (_, i) => {
        const d = new Date(today); d.setDate(d.getDate() - (14 - i))
        return d.toISOString().split('T')[0]
      })
      const analyticsMap = {}
      analyticsSnap.docs.forEach(d => { analyticsMap[d.id] = d.data() })
      setGraphData(days.map(date => ({
        date: date.slice(5),
        visits: analyticsMap[`visits_${date}`]?.count || 0,
        likes: analyticsMap[`likes_${date}`]?.count || 0,
        messages: analyticsMap[`messages_${date}`]?.count || 0,
      })))

      const incomeData = incomeSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      incomeData.sort((a, b) => a.id.localeCompare(b.id))
      setIncome(incomeData)
    } catch (err) { console.error(err) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)
    try {
      let thumbnailUrl = ''
      if (thumbnail) {
        const data = new FormData()
        data.append('file', thumbnail)
        data.append('upload_preset', UPLOAD_PRESET)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: data })
        const json = await res.json()
        thumbnailUrl = json.secure_url
      }
      if (form.editId) {
        await updateDoc(doc(db, 'projects', form.editId), {
          title: form.title, category: form.category, description: form.description,
          tools: form.tools.split(',').map(t => t.trim()),
          timeSpent: form.timeSpent, year: form.year,
          link: form.link || '', video: form.video || '',
          portfolioOnly: true, status: "Completed",
          ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        })
      } else {
        await addDoc(collection(db, 'projects'), {
          title: form.title, category: form.category, description: form.description,
          tools: form.tools.split(',').map(t => t.trim()),
          timeSpent: form.timeSpent, year: form.year,
          link: form.link || '', video: form.video || '',
          thumbnail: thumbnailUrl, likes: 0, clicks: 0, featured: false,
          createdAt: serverTimestamp(),
          // ─── Portfolio connection fields ───────────────────────────────
          portfolioOnly: true,
          status: "Completed",
          approved: true,
        })
      }
      setForm({ title: '', category: 'Graphic Design', description: '', tools: '', timeSpent: '', year: new Date().getFullYear().toString(), link: '', video: '', editId: '' })
      setThumbnail(null); setPreview(null); setShowForm(false)
      fetchAll()
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  const totalLikes = stats.projects.reduce((a, p) => a + (p.likes || 0), 0)
  const totalClicks = stats.projects.reduce((a, p) => a + (p.clicks || 0), 0)
  const pendingMessages = messages.filter(m => m.status === 'pending').length
  const avgIncome = income.length > 0 ? Math.round(income.reduce((a, i) => a + (i.amount || 0), 0) / income.length) : 0
  const categories = ['All', 'Graphic Design', 'Web Development', 'Video Editing']
  const filteredProjects = activeFilter === 'All' ? stats.projects : stats.projects.filter(p => p.category === activeFilter)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#0d0d0d] border border-white/[0.08] rounded-xl p-3 text-xs">
        <p className="text-white/40 mb-2">{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    )
  }

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'messages', label: `Messages${pendingMessages > 0 ? ` (${pendingMessages})` : ''}` },
    { key: 'projects', label: 'Projects' },
    { key: 'content', label: 'Content' },
  ]

  if (!user) return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center">
          <Layers size={28} className="text-[#6c63ff]" />
        </div>
        <h1 className="text-white text-2xl font-bold">Admin Access</h1>
        <p className="text-white/30 text-sm">Only authorized personnel allowed.</p>
        <button onClick={loginWithGoogle}
          className="px-6 py-3 bg-[#6c63ff] text-white rounded-2xl text-sm font-bold hover:bg-[#5a52e0] transition-all">
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

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-[#6c63ff]" />
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Xena Lab — Restricted</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome back,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c63ff] to-violet-300">
                  Master Kaizo.
                </span>
              </h1>
              <p className="text-white/30 text-sm">All systems operational. Here's your portfolio intelligence.</p>
            </div>
            <button onClick={logout}
              className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest mt-2">
              Logout
            </button>
          </div>
        </motion.div>

        {/* Pending alert */}
        {pendingMessages > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 cursor-pointer"
            onClick={() => setTab('messages')}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-red-400 text-sm">{pendingMessages} pending message{pendingMessages > 1 ? 's' : ''} — click to view</p>
            <ChevronRight size={14} className="text-red-400 ml-auto" />
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-white/[0.06] pb-4">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-full border transition-all duration-300 ${
                tab === t.key
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                  : 'border-white/[0.08] text-white/30 hover:border-[#6c63ff] hover:text-[#6c63ff]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Visits', value: stats.visits, icon: <Eye size={18} />, color: 'from-[#6c63ff]/20 to-violet-500/5' },
                { label: 'Total Likes', value: totalLikes, icon: <Heart size={18} />, color: 'from-rose-500/20 to-rose-500/5' },
                { label: 'Total Clicks', value: totalClicks, icon: <MousePointer size={18} />, color: 'from-emerald-500/20 to-emerald-500/5' },
                { label: 'Pending Msgs', value: pendingMessages, icon: <MessageSquare size={18} />, color: 'from-yellow-500/20 to-yellow-500/5' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-gradient-to-br ${s.color} border border-white/[0.06] rounded-3xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/30 text-xs uppercase tracking-widest">{s.label}</p>
                    <span className="text-white/20">{s.icon}</span>
                  </div>
                  <p className="text-white text-4xl font-bold">{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Graph */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6">
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
            </div>

            {/* Income summary */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
              <p className="text-emerald-400/60 text-xs uppercase tracking-widest mb-2">Monthly Average Income</p>
              <p className="text-white text-4xl font-bold">৳{avgIncome.toLocaleString()}</p>
              <p className="text-white/20 text-xs mt-1">Based on {income.length} month{income.length !== 1 ? 's' : ''} of data</p>
            </div>
          </motion.div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-white/20 border border-dashed border-white/[0.06] rounded-3xl">
                No messages yet.
              </div>
            ) : messages.map(m => (
              <div key={m.id}
                className={`rounded-2xl p-4 border transition-all ${m.status === 'pending' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/[0.06] bg-white/[0.01]'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {m.status === 'pending' ? <Clock size={12} className="text-yellow-400" /> : <Check size={12} className="text-emerald-400" />}
                      <span className={`text-xs uppercase tracking-widest ${m.status === 'pending' ? 'text-yellow-400' : 'text-emerald-400'}`}>{m.status}</span>
                      <span className="text-white/20 text-xs">· {m.type === 'form' ? 'Contact Form' : m.type}</span>
                    </div>
                    {m.name && <p className="text-white text-sm font-medium">{m.name} <span className="text-white/30 font-normal">— {m.email}</span></p>}
                    {m.message && <p className="text-white/40 text-xs mt-1 leading-relaxed line-clamp-2">{m.message}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {m.status === 'pending' && (
                      <button onClick={async () => {
                        await updateDoc(doc(db, 'messages', m.id), { status: 'read' })
                        setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, status: 'read' } : msg))
                      }} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-all">
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            {/* Add button */}
            <button onClick={() => setShowForm(p => !p)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6c63ff] text-white rounded-xl text-sm font-bold hover:bg-[#5a52e0] transition-all w-fit">
              {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Project</>}
            </button>

            {/* Add/Edit form */}
            {showForm && (
              <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white/[0.02] border border-[#6c63ff]/20 rounded-3xl p-8 flex flex-col gap-5">
                <h2 className="text-white font-bold text-lg">{form.editId ? 'Edit Project' : 'New Project'}</h2>
                <div onClick={() => document.getElementById('thumbInput').click()}
                  className="w-full h-40 rounded-2xl border-2 border-dashed border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-[#6c63ff]/40 transition-all overflow-hidden">
                  {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
                    : <div className="flex flex-col items-center gap-2 text-white/20"><Upload size={24} /><span className="text-xs uppercase tracking-widest">Upload Thumbnail</span></div>}
                </div>
                <input id="thumbInput" type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (!f) return; setThumbnail(f); setPreview(URL.createObjectURL(f)) }} />
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project Title" className={inp} />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp}>
                  <option>Graphic Design</option>
                  <option>Web Development</option>
                  <option>Video Editing</option>
                </select>
                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className={`${inp} resize-none`} />
                <input required value={form.tools} onChange={e => setForm({ ...form, tools: e.target.value })} placeholder="Tools (comma separated)" className={inp} />
                <div className="grid grid-cols-2 gap-4">
                  <input value={form.timeSpent} onChange={e => setForm({ ...form, timeSpent: e.target.value })} placeholder="Time Spent" className={inp} />
                  <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Year" className={inp} />
                </div>
                <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="Live Link (optional)" className={inp} />
                <input value={form.video} onChange={e => setForm({ ...form, video: e.target.value })} placeholder="YouTube URL (optional)" className={inp} />
                <button type="submit" disabled={uploading}
                  className="w-full py-4 bg-[#6c63ff] text-white rounded-2xl text-sm font-bold hover:bg-[#5a52e0] transition-all disabled:opacity-50">
                  {uploading ? 'Uploading...' : form.editId ? 'Save Changes' : 'Save Project'}
                </button>
              </motion.form>
            )}

            {/* Category filter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className={`rounded-2xl p-4 border transition-all text-left ${activeFilter === cat ? 'bg-[#6c63ff]/20 border-[#6c63ff]/40' : 'bg-white/[0.02] border-white/[0.06] hover:border-[#6c63ff]/30'}`}>
                  <span className={`${activeFilter === cat ? 'text-[#6c63ff]' : 'text-white/20'}`}>{categoryIcons[cat]}</span>
                  <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${activeFilter === cat ? 'text-[#6c63ff]' : 'text-white/40'}`}>
                    {cat === 'All' ? 'All Work' : cat}
                  </p>
                  <p className="text-white/20 text-xs mt-1">
                    {(cat === 'All' ? stats.projects : stats.projects.filter(p => p.category === cat)).length} projects
                  </p>
                </button>
              ))}
            </div>

            {/* Project list */}
            <div className="flex flex-col gap-3">
              <p className="text-white/20 text-xs uppercase tracking-widest">{activeFilter} — {filteredProjects.length} total</p>
              {filteredProjects.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between hover:border-white/[0.1] transition-all">
                  <div>
                    <p className="text-white font-semibold text-sm">{p.title}</p>
                    <p className="text-white/20 text-xs mt-0.5">{p.category} · {p.year}</p>
                    <button onClick={() => {
                      setForm({
                        title: p.title, category: p.category || 'Graphic Design',
                        description: p.description || '', tools: p.tools?.join(', ') || '',
                        timeSpent: p.timeSpent || '', year: p.year || '',
                        link: p.link || '', video: p.video || '', editId: p.id
                      })
                      setShowForm(true)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }} className="text-[10px] text-[#6c63ff] hover:text-white transition-colors uppercase tracking-widest mt-1">
                      Edit
                    </button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="text-center">
                      <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1 flex items-center gap-1"><Heart size={8} /> Likes</p>
                      <p className="text-white font-bold">{p.likes || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1 flex items-center gap-1"><MousePointer size={8} /> Clicks</p>
                      <p className="text-white font-bold">{p.clicks || 0}</p>
                    </div>
                    <button onClick={async () => {
                      await updateDoc(doc(db, 'projects', p.id), { featured: !p.featured })
                      fetchAll()
                    }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs transition-all ${
                      p.featured ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-yellow-500/30 hover:text-yellow-400'
                    }`}>
                      <Star size={10} fill={p.featured ? 'currentColor' : 'none'} />
                      {p.featured ? 'Featured' : 'Feature'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CONTENT TAB ── */}
        {tab === 'content' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">

            {/* Homepage Stats */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6">
              <p className="text-white font-bold mb-1">Homepage Stats</p>
              <p className="text-white/30 text-xs mb-5">These add to the real counts from lab Firebase automatically.</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'projects', label: 'Base Projects Count' },
                  { key: 'clients', label: 'Base Happy Clients Count' },
                ].map(s => (
                  <div key={s.key}>
                    <p className="text-white/20 text-xs uppercase tracking-widest mb-2">{s.label}</p>
                    <input value={homeStats[s.key] || ''} onChange={e => setHomeStats({ ...homeStats, [s.key]: e.target.value })}
                      className={inp} />
                  </div>
                ))}
              </div>
              <button onClick={async () => {
                await setDoc(doc(db, 'stats', 'homeStats'), homeStats)
                setStatsSaved(true); setTimeout(() => setStatsSaved(false), 2000)
              }} className="px-5 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all">
                {statsSaved ? '✓ Saved!' : 'Save Stats'}
              </button>
            </div>

            {/* Income Tracker */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-white font-bold">Income Tracker</p>
                <button onClick={() => setShowIncomeForm(p => !p)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#6c63ff] text-xs hover:bg-[#6c63ff]/20 transition-all">
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-4">
                <p className="text-emerald-400/60 text-xs uppercase tracking-widest mb-1">Monthly Average</p>
                <p className="text-white text-3xl font-bold">৳{avgIncome.toLocaleString()}</p>
              </div>
              {showIncomeForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={incomeForm.month} onChange={e => setIncomeForm({ ...incomeForm, month: e.target.value })}
                      placeholder="Month (e.g. 2026-04)" className={inp} />
                    <input value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                      placeholder="Amount (৳)" type="number" className={inp} />
                  </div>
                  <input value={incomeForm.note} onChange={e => setIncomeForm({ ...incomeForm, note: e.target.value })}
                    placeholder="Note" className={inp} />
                  <button onClick={async () => {
                    if (!incomeForm.month || !incomeForm.amount) return
                    await setDoc(doc(db, 'income', incomeForm.month), {
                      amount: Number(incomeForm.amount), note: incomeForm.note || '', month: incomeForm.month
                    })
                    setIncomeForm({ month: '', amount: '', note: '' })
                    setShowIncomeForm(false); fetchAll()
                  }} className="px-5 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-bold hover:bg-[#5a52e0] transition-all">
                    Save
                  </button>
                </motion.div>
              )}
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
            </div>

            {/* CV */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6">
              <p className="text-white font-bold mb-5">CV / Resume</p>
              <CVUploader />
            </div>

            {/* Certificates */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6">
              <p className="text-white font-bold mb-5">Certificates</p>
              <CertificateUploader />
            </div>
          </motion.div>
        )}

        {/* Full graph modal */}
        {showFullGraph && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowFullGraph(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d0d] border border-white/[0.08] rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white font-bold text-xl">Detailed Analytics</h2>
                <button onClick={() => setShowFullGraph(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
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

      </div>
    </main>
  )
}