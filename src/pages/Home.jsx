import mainImg from '../assets/mainimage.png'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Circle, ArrowRight } from 'lucide-react'

function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`} />
      </motion.div>
    </motion.div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303]">

      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/[0.05] via-transparent to-rose-500/[0.03] blur-3xl" />

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape delay={0.3} width={500} height={120} rotate={12}
            gradient="from-[#6c63ff]/[0.15]"
            className="left-[-5%] top-[20%]" />
          <ElegantShape delay={0.5} width={400} height={100} rotate={-15}
            gradient="from-violet-500/[0.12]"
            className="right-[-5%] top-[65%]" />
          <ElegantShape delay={0.4} width={250} height={70} rotate={-8}
            gradient="from-[#6c63ff]/[0.10]"
            className="left-[10%] bottom-[10%]" />
          <ElegantShape delay={0.6} width={180} height={50} rotate={20}
            gradient="from-violet-400/[0.12]"
            className="right-[20%] top-[12%]" />
          <ElegantShape delay={0.7} width={130} height={35} rotate={-25}
            gradient="from-indigo-400/[0.10]"
            className="left-[25%] top-[8%]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left - Text */}
            <div className="flex flex-col gap-6">

              {/* Badge */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] w-fit"
              >
                <Circle className="h-2 w-2 fill-[#6c63ff]" />
                <span className="text-sm text-white/60 tracking-wide">
                  Creative Professional · Dhaka, BD
                </span>
              </motion.div>

              {/* Heading */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                    Hi, I'm
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c63ff] via-white/90 to-violet-300">
                    Yousuf Hasan
                  </span>
                </h1>
              </motion.div>

              {/* Sub */}
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-base md:text-lg text-white/40 leading-relaxed font-light tracking-wide max-w-md"
              >
                Video editor, digital artist, graphic designer & web developer.
                I create visuals that tell stories and move people.
              </motion.p>

              {/* Buttons */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 mt-2"
              >
                <Link
                  to="/works"
                  className="flex items-center gap-2 px-6 py-3 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all duration-300"
                >
                  See My Works <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border border-white/10 text-white/50 rounded-full text-sm hover:border-[#6c63ff]/50 hover:text-white transition-all duration-300"
                >
                  Contact Me
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-8 pt-6 border-t border-white/[0.06] mt-2"
              >
                {[
                  { value: '3+', label: 'Years Creating' },
                  { value: '50+', label: 'Projects Done' },
                  { value: '4', label: 'Disciplines' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/30">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

            </div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
              className="flex justify-center md:justify-end"
            >
              <div className="relative w-72 md:w-[400px]">
                <div className="absolute inset-0 rounded-2xl bg-[#6c63ff]/20 blur-3xl scale-110" />
                <img
                  src={mainImg}
                  alt="Yousuf Hasan"
                  className="relative z-10 w-full object-cover rounded-2xl border border-white/[0.08] grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#6c63ff]/60 rounded-tl-lg z-20" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#6c63ff]/60 rounded-br-lg z-20" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none" />

      </section>

      {/* Skills Strip */}
      <section className="border-t border-white/[0.06] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {['Video Editing', 'Digital Art', 'Graphic Design', 'Web Development', 'Motion Graphics'].map((skill) => (
            <span key={skill} className="text-xs text-white/20 tracking-widest uppercase">
              {skill}
            </span>
          ))}
        </div>
      </section>

    </main>
  )
}