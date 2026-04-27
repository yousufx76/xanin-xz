import mainImg from '../assets/mainimage.png'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Circle, ArrowRight, Zap, MessageSquare, RefreshCw, Star, Film, Paintbrush, Code2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useVisitorCount } from '../hooks/useVisitorCount'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'
import WorkCard from '../components/WorkCard'

function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={`absolute ${className}`}
    >
      <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} style={{ width, height }} className="relative">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`} />
      </motion.div>
    </motion.div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] } }),
}

const services = [
  {
    icon: <Film size={22} />,
    title: 'Video Editing',
    desc: 'Cinematic edits with mood, color and story. From short-form to long-form content.',
    details: 'I specialize in creating cinematic video edits that combine color grading, sound design, and storytelling. Whether it\'s a YouTube video, a short-form reel, or a brand film — every frame is intentional.',
    tags: ['Color Grading', 'Short-form', 'Long-form', 'Reels', 'CapCut', 'Premiere Pro'],
  },
  {
    icon: <Paintbrush size={22} />,
    title: 'Graphic Design',
    desc: 'Posters, brand identity, editorial layouts. Visual communication with purpose.',
    details: 'From logo design to full brand identity, editorial posters to social media graphics — I create visuals that communicate clearly and look stunning. Every design has a concept behind it.',
    tags: ['Logo Design', 'Brand Identity', 'Posters', 'Canva', 'Photoshop', 'Illustrator'],
  },
  {
    icon: <Code2 size={22} />,
    title: 'Web Development',
    desc: 'Clean, fast and modern React websites with smooth animations and real functionality.',
    details: 'I build modern, responsive websites using React, Tailwind CSS and Framer Motion. From portfolio sites to full-stack web apps with Firebase backend — clean code, smooth experience.',
    tags: ['React', 'Tailwind CSS', 'Firebase', 'Framer Motion', 'Vite', 'Vercel'],
  },
]

const trustPoints = [
  {
    icon: <Zap size={16} />,
    title: 'Fast Delivery',
    desc: 'I respect deadlines. Always.',
    details: 'Time is money — and I take that seriously for both of us.',
    qa: [
      { q: 'How long does a typical project take?', a: 'Depends on the scope. A logo takes 1–3 days. A full website takes 1–2 weeks. I always give a clear timeline before starting.' },
      { q: 'Do you offer rush delivery?', a: 'Yes, for urgent projects I can prioritize your work. Just let me know your deadline upfront and we\'ll figure it out.' },
      { q: 'What if the project takes longer than expected?', a: 'I\'ll notify you immediately if anything changes — no surprises. Transparency is part of how I work.' },
      { q: 'Do you work on weekends?', a: 'Yes. I work when the work needs to get done. Deadlines don\'t care about weekends and neither do I.' },
    ]
  },
  {
    icon: <MessageSquare size={16} />,
    title: 'Clear Communication',
    desc: 'No ghost. No confusion. Just clarity.',
    details: 'You\'ll always know what\'s happening with your project.',
    qa: [
      { q: 'How do you keep clients updated?', a: 'I send regular progress updates and check in at key milestones. You\'re never left wondering what\'s going on.' },
      { q: 'What platforms do you communicate on?', a: 'WhatsApp, email, or wherever you\'re most comfortable. I adapt to your preferred channel.' },
      { q: 'What if I have a question outside working hours?', a: 'Send it anyway. I check messages regularly and will respond as soon as I can — usually within a few hours.' },
      { q: 'Do you provide a brief or proposal before starting?', a: 'Always. Before any work begins, we align on scope, timeline and expectations so there are zero misunderstandings.' },
    ]
  },
  {
    icon: <RefreshCw size={16} />,
    title: 'Revision Friendly',
    desc: 'Until you love it, we keep going.',
    details: 'Your satisfaction is the finish line — not the first draft.',
    qa: [
      { q: 'How many revisions do you offer?', a: 'I offer multiple revision rounds. I don\'t count revisions — I count satisfaction. If it\'s not right, we fix it.' },
      { q: 'What counts as a revision vs a new request?', a: 'Adjustments to the agreed scope are revisions. Completely new directions may require a separate discussion — but I\'ll always be upfront about it.' },
      { q: 'What if I change my mind about the direction?', a: 'It happens. We talk it through, realign, and move forward. Creative work is a process, not a transaction.' },
      { q: 'Do you charge extra for revisions?', a: 'Not for reasonable revisions within the original scope. I want you to be happy with the final result — that\'s what matters.' },
    ]
  },
  {
    icon: <Star size={16} />,
    title: 'Quality Focused',
    desc: 'Every pixel, every frame — intentional.',
    details: 'I don\'t ship work I\'m not proud of. Period.',
    qa: [
      { q: 'How do you define quality in your work?', a: 'Quality means the work solves the problem beautifully. It looks good, works well, and feels right for the brand or project.' },
      { q: 'Do you follow industry standards?', a: 'Yes. Clean code, proper file formats, print-ready designs — everything is delivered professionally and organized.' },
      { q: 'What if I\'m not satisfied with the quality?', a: 'Then we\'re not done yet. I don\'t consider a project complete until you\'re genuinely happy with what you received.' },
      { q: 'Can I see examples of your previous work?', a: 'Absolutely — that\'s what this portfolio is for. Browse the Works section to see real projects across all disciplines.' },
    ]
  },
]

function ServiceModal({ service, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0d0d0d] border border-white/[0.08] rounded-3xl p-8 max-w-lg w-full relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
          <X size={14} />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff] mb-6">
          {service.icon}
        </div>
        <h2 className="text-white text-2xl font-bold mb-3">{service.title}</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-6">{service.details}</p>
        <div className="flex flex-wrap gap-2">
          {service.tags.map(tag => (
            <span key={tag} className="text-[10px] px-3 py-1 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#6c63ff] uppercase tracking-widest">{tag}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function TrustModal({ point, onClose }) {
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0d0d0d] border border-white/[0.08] rounded-3xl p-8 max-w-lg w-full relative max-h-[80vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
          <X size={14} />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff] mb-6">
          {point.icon}
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">{point.title}</h2>
        <p className="text-white/40 text-sm mb-8">{point.details}</p>

        <div className="flex flex-col gap-3">
          {point.qa.map((item, i) => (
            <div key={i} className="border border-white/[0.06] rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-white/70 text-sm font-medium pr-4">{item.q}</span>
                {openIndex === i ? <ChevronUp size={14} className="text-[#6c63ff] shrink-0" /> : <ChevronDown size={14} className="text-white/30 shrink-0" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="text-white/40 text-sm px-4 pb-4 leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  useVisitorCount()
  const [featuredWorks, setFeaturedWorks] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTrust, setSelectedTrust] = useState(null)
  const [stats, setStats] = useState([
    { value: '50+', label: 'Projects Completed' },
    { value: '20+', label: 'Happy Clients' },
    { value: '3+', label: 'Years Experience' },
  ])

  useEffect(() => {
    const fetchFeatured = async () => {
      const snap = await getDocs(collection(db, 'projects'))
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const featured = all.filter(p => p.featured)
      setFeaturedWorks(featured.slice(0, 3))

      const homeStatsDoc = await getDoc(doc(db, 'stats', 'homeStats'))
      if (homeStatsDoc.exists()) {
        const d = homeStatsDoc.data()
        setStats([
          { value: d.projects, label: 'Projects Completed' },
          { value: d.clients, label: 'Happy Clients' },
          { value: d.experience, label: 'Years Experience' },
        ])
      }
    }
    fetchFeatured()
  }, [])

  return (
    <main className="min-h-screen bg-[#030303]">

      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/[0.05] via-transparent to-rose-500/[0.03] blur-3xl" />
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape delay={0.3} width={500} height={120} rotate={12} gradient="from-[#6c63ff]/[0.15]" className="left-[-5%] top-[20%]" />
          <ElegantShape delay={0.5} width={400} height={100} rotate={-15} gradient="from-violet-500/[0.12]" className="right-[-5%] top-[65%]" />
          <ElegantShape delay={0.4} width={250} height={70} rotate={-8} gradient="from-[#6c63ff]/[0.10]" className="left-[10%] bottom-[10%]" />
          <ElegantShape delay={0.6} width={180} height={50} rotate={20} gradient="from-violet-400/[0.12]" className="right-[20%] top-[12%]" />
          <ElegantShape delay={0.7} width={130} height={35} rotate={-25} gradient="from-indigo-400/[0.10]" className="left-[25%] top-[8%]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] w-fit">
                <Circle className="h-2 w-2 fill-[#6c63ff]" />
                <span className="text-sm text-white/60 tracking-wide">Creative Professional · Dhaka, BD</span>
              </motion.div>

              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">Hi, I'm</span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c63ff] via-white/90 to-violet-300">Yousuf Hasan</span>
                </h1>
              </motion.div>

              <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="text-base md:text-lg text-white/40 leading-relaxed font-light tracking-wide max-w-md">
                Video editor, digital artist, graphic designer & web developer. I create visuals that tell stories and move people.
              </motion.p>

              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4 mt-2">
                <Link to="/works" className="flex items-center gap-2 px-6 py-3 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all duration-300">
                  See My Works <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="px-6 py-3 border border-white/10 text-white/50 rounded-full text-sm hover:border-[#6c63ff]/50 hover:text-white transition-all duration-300">
                  Contact Me
                </Link>
              </motion.div>

              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                className="flex items-center gap-8 pt-6 border-t border-white/[0.06] mt-2">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/30">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
              className="flex justify-center md:justify-end">
              <div className="relative w-72 md:w-[400px]">
                <div className="absolute inset-0 rounded-2xl bg-[#6c63ff]/20 blur-3xl scale-110" />
                <img src={mainImg} alt="Yousuf Hasan"
                  className="relative z-10 w-full object-cover rounded-2xl border border-white/[0.08] grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#6c63ff]/60 rounded-tl-lg z-20" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#6c63ff]/60 rounded-br-lg z-20" />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none" />
      </section>

      {/* Skills Strip */}
      <section className="border-t border-white/[0.06] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {['Video Editing', 'Graphic Design', 'Web Development'].map((skill) => (
            <span key={skill} className="text-xs text-white/20 tracking-widest uppercase">{skill}</span>
          ))}
        </div>
      </section>

      {/* What I Do */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
              <span className="text-xs tracking-widest text-[#6c63ff] uppercase">What I Do</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Crafting experiences across<br />multiple disciplines.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {services.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedService(item)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-[#6c63ff]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff] mb-4 group-hover:bg-[#6c63ff]/20 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                <p className="text-[#6c63ff] text-xs mt-4 uppercase tracking-widest group-hover:gap-2 flex items-center gap-1 transition-all">
                  Learn more <ArrowRight size={10} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Builder */}
      <section className="py-16 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
              <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Why Work With Me</span>
              <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustPoints.map((point, i) => (
              <motion.div key={point.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedTrust(point)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-[#6c63ff]/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center text-[#6c63ff] mx-auto mb-4 group-hover:bg-[#6c63ff]/20 transition-all">
                  {point.icon}
                </div>
                <h3 className="text-white text-sm font-semibold mb-2">{point.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{point.desc}</p>
                <p className="text-[#6c63ff] text-[10px] mt-3 uppercase tracking-widest">Tap to learn more</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works */}
      {featuredWorks.length > 0 && (
        <section className="py-24 px-6 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-14">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
                  <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Featured Work</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Selected Projects.</h2>
              </div>
              <Link to="/works" className="flex items-center gap-2 text-sm text-white/30 hover:text-[#6c63ff] transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorks.map((work, i) => (
                <motion.div key={work.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <WorkCard work={work} onClick={() => {}} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-[#6c63ff]/20 bg-[#6c63ff]/5 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 via-transparent to-violet-500/5 pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Got a project in mind?</h2>
            <p className="text-white/30 mb-8 max-w-md mx-auto text-sm leading-relaxed relative z-10">
              Whether it's a brand identity, a website, or a cinematic edit — let's build something worth remembering.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all duration-300 relative z-10">
              Let's Talk <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedTrust && <TrustModal point={selectedTrust} onClose={() => setSelectedTrust(null)} />}
      </AnimatePresence>

    </main>
  )
}