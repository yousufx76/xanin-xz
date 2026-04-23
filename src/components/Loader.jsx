import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const letters = ['X', 'A', 'N', 'I', 'N', ' ', 'X', 'Z']

export default function Loader({ onComplete }) {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 25)

    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => onComplete(), 800)
    }, 3200)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
        >

          {/* Background glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#6c63ff]/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Top line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute top-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6c63ff]/30 to-transparent origin-left"
          />

          {/* Bottom line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
            className="absolute bottom-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6c63ff]/30 to-transparent origin-right"
          />

          {/* Main content */}
          <div className="flex flex-col items-center gap-8 relative z-10">

            {/* Logo + Letters in one row */}
            <div className="flex items-center gap-4 md:gap-6">

              {/* Logo */}
              <motion.img
                src="/logo.png"
                alt="XANIN XZ"
                initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] }}
                className="w-20 h-20 md:w-36 md:h-36 object-contain"
              />

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-[1px] h-10 md:h-16 bg-white/10"
              />

              {/* Letters */}
              <div className="flex items-center gap-1 md:gap-2">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.1,
                      ease: [0.23, 0.86, 0.39, 0.96]
                    }}
                    className={`text-4xl md:text-7xl font-bold tracking-widest ${
                      (i === 6 || i === 7) ? 'text-[#6c63ff]' :
                      letter === ' ' ? 'w-4' :
                      'text-white'
                    }`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-[10px] md:text-xs text-white/30 tracking-[0.5em] uppercase"
            >
              Creative Professional
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-48 md:w-64 h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6c63ff] to-violet-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                />
              </div>
              <span className="text-[10px] text-white/20 font-mono tracking-widest">
                {progress}%
              </span>
            </motion.div>

          </div>

          {/* Corner accents */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[#6c63ff]/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[#6c63ff]/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[#6c63ff]/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[#6c63ff]/30"
          />

        </motion.div>
      )}
    </AnimatePresence>
  )
}