import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, MessageCircle, Download, Globe, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

// Firebase Imports
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const skills = [
  { name: 'Graphic Design', level: 'Intermediate', percent: 65 },
  { name: 'Video Editing', level: 'Medium', percent: 60 },
  { name: 'Web Development', level: 'Intermediate', percent: 65 },
  { name: 'AI Art Direction', level: 'Advanced', percent: 85 },
]

const tools = [
  'Canva', 'Illustrator', 'Photoshop', 'Adobe Premiere',
  'CapCut', 'Figma', 'React', 'Tailwind CSS',
  'Framer Motion', 'Firebase', 'VS Code', 'Leonardo AI', 'Kling AI'
]

const services = [
  { title: 'Video Editing', desc: 'Cinematic edits, color grading, short-form reels and long-form content with mood and story.' },
  { title: 'Graphic Design', desc: 'Logo design, brand identity, editorial posters and visual communication with purpose.' },
  { title: 'Web Development', desc: 'Modern React websites with smooth animations, Firebase backend and real functionality.' },
]

export default function CV() {
  const cvRef = useRef(null)
  const [cvUrl, setCvUrl] = useState('')

  // Fetch CV URL from Firestore
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const snap = await getDoc(doc(db, 'stats', 'cv'))
        if (snap.exists()) {
          setCvUrl(snap.data().url || '')
        }
      } catch (error) {
        console.error("Error fetching CV URL:", error)
      }
    }
    fetchCV()
  }, [])

  // Revised Download Handler
  const handleDownload = () => {
    if (cvUrl) {
      const a = document.createElement('a')
      a.href = cvUrl
      a.download = 'Yousuf-Hasan-CV.pdf'
      a.target = '_blank'
      a.click()
    } else {
      alert('CV not available yet. Please check back soon!')
    }
  }

  return (
    <main className="min-h-screen bg-[#030303] pt-20 pb-20 px-6">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link to="/about" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-sm">
          <ArrowLeft size={14} /> Back to About
        </Link>
        
        <div className="flex items-center gap-3">
      
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all"
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Screen Version - Dark XANIN Vibe */}
      <div className="max-w-3xl mx-auto mb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 via-transparent to-violet-500/5 pointer-events-none" />
          <div className="flex items-start justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
                <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Curriculum Vitae</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Yousuf Hasan</h1>
              <p className="text-[#6c63ff] text-sm tracking-widest uppercase mb-6">Creative Director — XANIN XZ</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/40 text-sm"><MapPin size={13} className="text-[#6c63ff]" />Savar, Dhaka, Bangladesh</div>
                <a href="mailto:xaninkaizoxz@gmail.com" className="flex items-center gap-2 text-white/40 text-sm hover:text-[#6c63ff] transition-colors"><Mail size={13} className="text-[#6c63ff]" />xaninkaizoxz@gmail.com</a>
                <a href="https://wa.me/8801794078825" className="flex items-center gap-2 text-white/40 text-sm hover:text-[#6c63ff] transition-colors"><MessageCircle size={13} className="text-[#6c63ff]" />+880 1794-078825</a>
                <a href="https://xanin-xz.vercel.app" className="flex items-center gap-2 text-white/40 text-sm hover:text-[#6c63ff] transition-colors"><Globe size={13} className="text-[#6c63ff]" />xanin-xz.vercel.app</a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="p-3 bg-white rounded-2xl">
                <QRCodeSVG value="https://xanin-xz.vercel.app" size={90} bgColor="#ffffff" fgColor="#030303" level="H" />
              </div>
              <p className="text-white/20 text-[9px] uppercase tracking-widest">Scan Portfolio</p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-5"><span className="w-8 h-[2px] bg-[#6c63ff]"></span><span className="text-xs tracking-widest text-[#6c63ff] uppercase">Summary</span></div>
          <p className="text-white/50 leading-relaxed text-sm">Self-taught creative professional based in Savar, Dhaka with 3+ years of experience across graphic design, video editing, and web development. I build digital experiences that combine technical precision with artistic intent — from brand identities and cinematic edits to full-stack React applications. Driven by curiosity, obsessed with quality, and always learning.</p>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6"><span className="w-8 h-[2px] bg-[#6c63ff]"></span><span className="text-xs tracking-widest text-[#6c63ff] uppercase">Skills</span></div>
          <div className="flex flex-col gap-5">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{skill.name}</span>
                  <span className="text-[#6c63ff] text-xs px-3 py-0.5 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20">{skill.level}</span>
                </div>
                <div className="w-full h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-[#6c63ff] to-violet-400 rounded-full"
                    initial={{ width: 0 }} whileInView={{ width: `${skill.percent}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: 'circOut' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Services */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6"><span className="w-8 h-[2px] bg-[#6c63ff]"></span><span className="text-xs tracking-widest text-[#6c63ff] uppercase">Services</span></div>
          <div className="flex flex-col gap-4">
            {services.map((s) => (
              <div key={s.title} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-1 rounded-full bg-[#6c63ff] shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                  <p className="text-white/30 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Link */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center">
          <p className="text-white/20 text-xs">Full portfolio at <a href="https://xanin-xz.vercel.app" className="text-[#6c63ff] hover:text-white transition-colors">xanin-xz.vercel.app</a></p>
        </motion.div>
      </div>

      {/* Hidden PDF Version - Refined Clean Design */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={cvRef} style={{ width: '210mm', height: '297mm', background: '#ffffff', padding: '15mm 20mm', fontFamily: 'Georgia, serif', color: '#111111', overflow: 'hidden', boxSizing: 'border-box', position: 'relative' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid #6c63ff' }}>
            <div>
              <p style={{ color: '#6c63ff', fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Arial, sans-serif' }}>Curriculum Vitae</p>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111', margin: '0 0 3px 0', fontFamily: 'Arial, sans-serif' }}>Yousuf Hasan</h1>
              <p style={{ color: '#6c63ff', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px 0', fontFamily: 'Arial, sans-serif' }}>Creative Director — XANIN XZ</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <p style={{ margin: 0, fontSize: '10px', color: '#555', fontFamily: 'Arial, sans-serif' }}>📍 Savar, Dhaka, Bangladesh</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#555', fontFamily: 'Arial, sans-serif' }}>✉️ xaninkaizoxz@gmail.com</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#555', fontFamily: 'Arial, sans-serif' }}>💬 +880 1794-078825</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#555', fontFamily: 'Arial, sans-serif' }}>🌐 xanin-xz.vercel.app</p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <QRCodeSVG value="https://xanin-xz.vercel.app" size={75} bgColor="#ffffff" fgColor="#111111" level="H" />
              <p style={{ fontSize: '7px', color: '#999', marginTop: '4px', letterSpacing: '1px', fontFamily: 'Arial, sans-serif' }}>SCAN PORTFOLIO</p>
            </div>
          </div>

          {/* Two column layout */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Left column */}
            <div style={{ flex: 1.4 }}>
              {/* Summary */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#6c63ff', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Summary</p>
                <p style={{ fontSize: '10px', lineHeight: '1.8', color: '#444', margin: 0, fontFamily: 'Arial, sans-serif' }}>
                  Self-taught creative professional based in Savar, Dhaka with 3+ years of experience across graphic design, video editing, and web development. I build digital experiences that combine technical precision with artistic intent. Driven by curiosity, obsessed with quality, and always learning.
                </p>
              </div>

              {/* Services */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#6c63ff', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Services</p>
                {services.map((s) => (
                  <div key={s.title} style={{ marginBottom: '8px', paddingLeft: '8px', borderLeft: '2px solid #6c63ff' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: 'bold', color: '#111', fontFamily: 'Arial, sans-serif' }}>{s.title}</p>
                    <p style={{ margin: 0, fontSize: '9px', color: '#666', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ flex: 1 }}>
              {/* Skills */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#6c63ff', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Skills</p>
                {skills.map((skill) => (
                  <div key={skill.name} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#111', fontFamily: 'Arial, sans-serif' }}>{skill.name}</span>
                      <span style={{ fontSize: '9px', color: '#6c63ff', fontFamily: 'Arial, sans-serif' }}>{skill.level}</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', background: '#eee', borderRadius: '99px' }}>
                      <div style={{ width: `${skill.percent}%`, height: '100%', background: '#6c63ff', borderRadius: '99px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tools */}
              <div>
                <p style={{ color: '#6c63ff', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Tools</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {tools.map((tool) => (
                    <span key={tool} style={{ fontSize: '8px', padding: '2px 7px', border: '1px solid #ddd', borderRadius: '4px', color: '#555', fontFamily: 'Arial, sans-serif' }}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PDF Footer */}
          <div style={{ position: 'absolute', bottom: '10mm', left: '20mm', right: '20mm', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '8px' }}>
            <p style={{ fontSize: '9px', color: '#999', margin: 0, fontFamily: 'Arial, sans-serif' }}>Full portfolio available at <span style={{ color: '#6c63ff' }}>xanin-xz.vercel.app</span></p>
          </div>
        </div>
      </div>

    </main>
  )
}