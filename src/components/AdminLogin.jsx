import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function Admin() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth()
  const [stats, setStats] = useState({ visits: 0, projects: [] })

  useEffect(() => {
    if (!isAdmin) return
    fetchStats()
  }, [isAdmin])

  const fetchStats = async () => {
    const visitsDoc = await getDoc(doc(db, 'stats', 'visits'))
    const projectsSnap = await getDocs(collection(db, 'projects'))
    const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    setStats({ visits: visitsDoc.data()?.count || 0, projects })
  }

  if (!user) return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-6">
        <h1 className="text-white text-2xl font-bold">Admin Access</h1>
        <button
          onClick={loginWithGoogle}
          className="px-6 py-3 bg-[#6c63ff] text-white rounded-2xl text-sm font-bold hover:bg-[#5a52e0] transition-all"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )

  if (!isAdmin) return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center">
      <p className="text-red-400 text-sm">Access Denied.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-white text-3xl font-bold">Admin Panel</h1>
          <button onClick={logout} className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest">Logout</button>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 mb-6">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Total Visits</p>
          <p className="text-white text-5xl font-bold">{stats.visits}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {stats.projects.map(p => (
            <div key={p.id} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 flex items-center justify-between">
              <p className="text-white font-bold">{p.title}</p>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Likes</p>
                  <p className="text-white font-bold">{p.likes || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Clicks</p>
                  <p className="text-white font-bold">{p.clicks || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}