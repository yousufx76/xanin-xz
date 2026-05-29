import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const PING_URL = 'https://xanin-xz.vercel.app/logo.png'

async function measureSpeed() {
  try {
    const startTime = performance.now()
    await fetch(PING_URL + '?t=' + Date.now(), { cache: 'no-store' })
    const duration = performance.now() - startTime
    // duration in ms — lower = faster
    // <300ms = fast, 300-800ms = medium, >800ms = slow
    if (duration < 300) return 'fast'
    if (duration < 800) return 'medium'
    return 'slow'
  } catch {
    return 'medium'
  }
}

function getProgressConfig(speed) {
  // Returns how fast the progress bar fills (ms per tick)
  if (speed === 'fast') return { tickMs: 18, maxAutoStop: 95 }
  if (speed === 'medium') return { tickMs: 35, maxAutoStop: 90 }
  return { tickMs: 65, maxAutoStop: 85 }
}

const SPEED_LABELS = {
  fast: { label: 'Fast Connection', color: '#22c55e' },
  medium: { label: 'Good Connection', color: '#6366f1' },
  slow: { label: 'Slow Connection', color: '#f59e0b' },
}

export default function Loader({ onComplete }) {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [speed, setSpeed] = useState(null)
  const [textsComplete, setTextsComplete] = useState(false)
  const [barComplete, setBarComplete] = useState(false)
  const progressRef = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    // measure speed first
    measureSpeed().then(detectedSpeed => {
      setSpeed(detectedSpeed)
      const { tickMs, maxAutoStop } = getProgressConfig(detectedSpeed)

      // Start progress bar
      intervalRef.current = setInterval(() => {
        progressRef.current += 1
        setProgress(progressRef.current)

        // Auto-stop at maxAutoStop — wait for texts to finish
        if (progressRef.current >= maxAutoStop) {
          clearInterval(intervalRef.current)
        }

        if (progressRef.current >= 100) {
          clearInterval(intervalRef.current)
          setBarComplete(true)
        }
      }, tickMs)
    })

    // Text phases
    const p1 = setTimeout(() => setPhase(1), 600)
    const p2 = setTimeout(() => setPhase(2), 1400)
    const p3 = setTimeout(() => setPhase(3), 2200)
    const textsDone = setTimeout(() => setTextsComplete(true), 3200)

    return () => {
      clearTimeout(p1)
      clearTimeout(p2)
      clearTimeout(p3)
      clearTimeout(textsDone)
      clearInterval(intervalRef.current)
    }
  }, [])

  // Once texts are done, push bar to 100 fast
  useEffect(() => {
    if (!textsComplete) return
    if (progressRef.current >= 100) { setBarComplete(true); return }

    // Fill remaining gap quickly
    intervalRef.current = setInterval(() => {
      progressRef.current += 1
      setProgress(progressRef.current)
      if (progressRef.current >= 100) {
        clearInterval(intervalRef.current)
        setBarComplete(true)
      }
    }, 12)

    return () => clearInterval(intervalRef.current)
  }, [textsComplete])

  // Both done — exit
  useEffect(() => {
    if (!barComplete) return
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => onComplete(), 900)
    }, 300)
    return () => clearTimeout(timer)
  }, [barComplete])

  const speedInfo = speed ? SPEED_LABELS[speed] : null

  const statusText = progress < 25
    ? 'Loading assets'
    : progress < 50
    ? 'Preparing canvas'
    : progress < 75
    ? 'Almost ready'
    : progress < 100
    ? 'Finalizing'
    : 'Welcome'

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

          {/* Speed indicator — top right */}
          <AnimatePresence>
            {speedInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-6 right-14 flex items-center gap-2"
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: speedInfo.color }}
                />
                <span className="text-[9px] uppercase tracking-[0.3em] font-mono"
                  style={{ color: speedInfo.color + '99' }}>
                  {speedInfo.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

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

            {/* Brand name */}
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
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="w-4 md:w-8" />
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

            {/* Progress section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-4 w-48 md:w-72"
            >

              {/* Big progress number */}
              <div className="flex items-end gap-1">
                <motion.span
                  key={progress}
                  className="text-2xl md:text-3xl font-light tracking-[0.3em]"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    background: `linear-gradient(135deg, #6c63ff, #a78bfa)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {String(progress).padStart(3, '0')}
                </motion.span>
                <span className="text-white/20 text-sm mb-0.5 tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>%</span>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(to right, #6c63ff, #a78bfa)',
                    transition: 'width 0.1s linear',
                  }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-y-0 w-20 rounded-full"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)' }}
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </div>

              {/* Status text */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusText}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] text-white/15 tracking-widest uppercase font-mono"
                >
                  {statusText}
                </motion.span>
              </AnimatePresence>

            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}