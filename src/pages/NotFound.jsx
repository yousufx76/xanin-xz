    import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6" style={{ background: '#080810' }}>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full opacity-[0.07] blur-[120px]" style={{ width: 600, height: 600, top: -100, left: -200, background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute rounded-full opacity-[0.05] blur-[120px]" style={{ width: 500, height: 500, bottom: -100, right: -150, background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[120px] md:text-[160px] font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, rgba(99,102,241,0.2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            404
          </p>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#6366f1] mb-4">Page Not Found</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            You wandered too far.
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            This page doesn't exist or was moved. Maybe you mistyped the URL — or maybe Kaizo hasn't built it yet.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm text-white/50 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <ArrowLeft size={15} /> Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#6366f1' }}
            >
              <Home size={15} /> Back to Home
            </button>
          </div>
        </motion.div>

        {/* Bottom tag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/10 text-xs mt-16 font-mono uppercase tracking-widest"
        >
          XANIN XZ — error 404
        </motion.p>
      </div>
    </div>
  )
}