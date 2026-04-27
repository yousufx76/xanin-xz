import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loader({ onComplete }) {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + 1
      })
    }, 28)

    const p1 = setTimeout(() => setPhase(1), 600)
    const p2 = setTimeout(() => setPhase(2), 1400)
    const p3 = setTimeout(() => setPhase(3), 2200)

    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => onComplete(), 900)
    }, 3400)

    return () => {
      clearTimeout(timer)
      clearTimeout(p1)
      clearTimeout(p2)
      clearTimeout(p3)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.23, 0.86, 0.39, 0.96] }}
          className="fixed inset-0 z-[999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
        >

          {/* Ambient background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)' }}
          />

          {/* Scanning line */}
          <motion.div
            initial={{ top: '-2px', opacity: 0 }}
            animate={{ top: ['0%', '100%', '0%'], opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, ease: 'linear', times: [0, 0.5, 1] }}
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, #6c63ff, transparent)' }}
          />

          {/* Corner accents */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className={`absolute w-8 h-8 border-[#6c63ff]/40 ${cls}`}
            />
          ))}

          {/* Top line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
            className="absolute top-14 left-0 right-0 h-[1px] origin-left"
            style={{ background: 'linear-gradient(to right, transparent, rgba(108,99,255,0.2), transparent)' }}
          />

          {/* Bottom line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-14 left-0 right-0 h-[1px] origin-right"
            style={{ background: 'linear-gradient(to right, transparent, rgba(108,99,255,0.2), transparent)' }}
          />

          {/* Main content */}
          <div className="flex flex-col items-center gap-10 relative z-10">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] }}
              className="relative"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: 'rgba(108,99,255,0.3)', transform: 'scale(1.5)' }}
              />
              <img src="/logo.png" alt="XANIN XZ"
                className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10" />
            </motion.div>

            {/* Brand name — letter by letter */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-[2px] md:gap-1">
                {'XANIN'.split('').map((letter, i) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.23, 0.86, 0.39, 0.96] }}
                    className="text-5xl md:text-8xl font-bold tracking-[0.15em] text-white"
                  >
                    {letter}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="w-4 md:w-8"
                />
                {'XZ'.split('').map((letter, i) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: 0.9 + i * 0.1, ease: [0.23, 0.86, 0.39, 0.96] }}
                    className="text-5xl md:text-8xl font-bold tracking-[0.15em] text-[#6c63ff]"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Tagline phases */}
              <div className="h-5 flex items-center">
                <AnimatePresence mode="wait">
                  {phase === 0 && (
                    <motion.span key="p0"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[9px] md:text-[11px] text-white/20 tracking-[0.6em] uppercase">
                      Initializing...
                    </motion.span>
                  )}
                  {phase === 1 && (
                    <motion.span key="p1"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[9px] md:text-[11px] text-white/20 tracking-[0.6em] uppercase">
                      Creative Professional
                    </motion.span>
                  )}
                  {phase === 2 && (
                    <motion.span key="p2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[9px] md:text-[11px] text-[#6c63ff]/60 tracking-[0.6em] uppercase">
                      Savar, Dhaka, BD
                    </motion.span>
                  )}
                  {phase === 3 && (
                    <motion.span key="p3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[9px] md:text-[11px] text-white/20 tracking-[0.6em] uppercase">
                      Loading Experience...
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Progress bar */}
              <div className="relative w-48 md:w-72 h-[1px] bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: 'linear-gradient(to right, #6c63ff, #a78bfa)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.5 }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-y-0 w-20 rounded-full"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)' }}
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </div>

              {/* Progress number + status */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-white/15 font-mono tracking-widest">
                  {String(progress).padStart(3, '0')}%
                </span>
                <div className="w-1 h-1 rounded-full bg-[#6c63ff] animate-pulse" />
                <span className="text-[10px] text-white/15 tracking-widest uppercase font-mono">
                  {progress < 30 ? 'Loading assets' : progress < 60 ? 'Preparing canvas' : progress < 90 ? 'Almost ready' : 'Welcome'}
                </span>
              </div>
            </motion.div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}