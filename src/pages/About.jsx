import { motion } from 'framer-motion'
import { Mail, MapPin, ExternalLink, Download, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import mainImg from '../assets/mainimage.png'

const skills = [
  { name: 'Graphic Design', level: 'Intermediate', years: '6+ yrs' },
  { name: 'Video Editing', level: 'Advanced', years: '6+ yrs' },
  { name: 'Web Development', level: 'Intermediate', years: '2+ yrs' },
  { name: 'AI Art Direction', level: 'Advanced', years: '1+ yr' },
]

const tools = [
  { name: 'Canva', url: 'https://www.canva.com' },
  { name: 'Illustrator', url: 'https://www.adobe.com/products/illustrator.html' },
  { name: 'Photoshop', url: 'https://www.adobe.com/products/photoshop.html' },
  { name: 'Adobe Premiere', url: 'https://www.adobe.com/products/premiere.html' },
  { name: 'CapCut', url: 'https://www.capcut.com' },
  { name: 'Figma', url: 'https://www.figma.com' },
  { name: 'React', url: 'https://react.dev' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'Framer Motion', url: 'https://www.framer.com/motion/' },
  { name: 'VS Code', url: 'https://code.visualstudio.com' },
  { name: 'Leonardo AI', url: 'https://leonardo.ai' },
  { name: 'Kling AI', url: 'https://klingai.com' },
]

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/yousufhasanxz' },
  { name: 'YouTube', href: 'https://youtube.com/@xaninxz' },
  { name: 'GitHub', href: 'https://github.com/yousufx76' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/xanin-kaizo-graphics-designer/' },
  { name: 'Fiverr', href: 'https://www.fiverr.com/s/gDbq31v' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583585307485' },
]

const timeline = [
  {
    year: '2019',
    title: 'The spark that wouldn\'t quit',
    desc: 'Got obsessed with content creation at 14. Spent years teaching myself video editing and thumbnail design — failed repeatedly, but never stopped showing up.'
  },
  {
    year: '2022',
    title: 'Design becomes the obsession',
    desc: 'Shifted focus to graphic design. No course, no mentor — just curiosity, YouTube, and a lot of late nights figuring things out alone.'
  },
  {
    year: '2023',
    title: 'Creativity meets code',
    desc: 'Realized design could be a real career. Started exploring coding out of curiosity — something about building things from nothing felt right.'
  },
  {
    year: '2024',
    title: 'Invested in the craft',
    desc: 'Built a proper setup and upgraded tools. AI coding felt overwhelming at first — stepped back, returned to design, and focused on getting really good at it.'
  },
  {
    year: '2025',
    title: 'Everything clicked',
    desc: 'Adopted AI as a tool, not a threat. Built first React projects. Joined UY LAB\'s web dev course on a 75% scholarship. Design and code finally started speaking the same language.'
  },
  {
    year: '2026',
    title: 'XANIN XZ goes live',
    desc: 'Launched the brand. Started taking on real client work across graphic design, video editing and web development. The vision became something tangible.'
  },
  {
    year: 'Now',
    title: 'Building something that lasts',
    desc: 'Focused on quality over quantity. Building a creative identity that speaks before I do — one project at a time.'
  },
]

const levelColors = {
  'Expert': 'text-[#6c63ff] bg-[#6c63ff]/10 border-[#6c63ff]/20',
  'Advanced': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  'Intermediate': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } })
}

export default function About() {
  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-28">

          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 0.86, 0.39, 0.96] }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-[#6c63ff]/15 blur-3xl scale-105" />
            <img
              src={mainImg}
              alt="Yousuf Hasan"
              className="relative z-10 w-full rounded-3xl border border-white/[0.08] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#6c63ff]/60 rounded-tl-lg z-20" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#6c63ff]/60 rounded-br-lg z-20" />

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -right-4 z-30 bg-[#0d0d0d] border border-white/[0.08] rounded-2xl px-4 py-3 hidden md:flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/60 uppercase tracking-widest">Available for work</span>
            </motion.div>
          </motion.div>

          {/* Right — Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
                <span className="text-xs tracking-widest text-[#6c63ff] uppercase">About Me</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
                Yousuf Hasan
              </h1>
              <p className="text-[#6c63ff] text-sm tracking-widest uppercase mb-6">
                Creative Director — XANIN XZ
              </p>
            </div>

            <div className="flex flex-col gap-4 text-white/40 leading-relaxed text-sm">
              <p className="text-white/60 italic text-base">"Obsessed with quality, driven by self-learning."</p>
              <p>
                I'm a self-taught creative professional based in Savar, Dhaka. I specialize in high-end video editing, brand identity design, and modern web development.
              </p>
              <p>
                I build digital experiences for dreamers and doers. My goal is to combine technical precision with artistic flair — bringing a chill yet dedicated energy to every project I touch.
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-white/40">
                <MapPin size={14} className="text-[#6c63ff] shrink-0" />
                Savar, Dhaka, Bangladesh
              </div>
              <a href="mailto:xaninkaizoxz@gmail.com"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-[#6c63ff] transition-colors w-fit">
                <Mail size={14} className="text-[#6c63ff] shrink-0" />
                xaninkaizoxz@gmail.com
              </a>
            </div>

            {/* CV Button */}
            <div className="flex items-center gap-3 pt-2">
              <Link to="/cv"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all duration-300">
                <FileText size={14} /> View My CV
              </Link>
            </div>

            {/* Socials */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socials.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-[#6c63ff] hover:border-[#6c63ff]/30 transition-all duration-300 uppercase tracking-widest border border-white/[0.06] px-3 py-1.5 rounded-full">
                  {social.name} <ExternalLink size={9} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-28"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">The Journey</span>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/[0.06]" />

            <div className="flex flex-col gap-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-8 pl-12 relative"
                >
                  {/* Dot */}
                  <div className="absolute left-[13px] top-1.5 w-2 h-2 rounded-full bg-[#6c63ff] border-2 border-[#030303]" />

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#6c63ff] text-xs font-bold tracking-widest">{item.year}</span>
                      <span className="text-white font-semibold text-sm">{item.title}</span>
                    </div>
                    <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-28"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Skills</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between hover:border-[#6c63ff]/20 transition-all"
              >
                <span className="text-white font-medium text-sm">{skill.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white/20 text-xs">{skill.years}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border ${levelColors[skill.level]}`}>
                    {skill.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-28"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">Technical Stack</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tools.map((tool, i) => (
              <motion.a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-white/50 hover:border-[#6c63ff]/50 hover:text-white hover:bg-[#6c63ff]/5 transition-all duration-300"
              >
                {tool.name}
                <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6c63ff]" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-[#6c63ff]/20 bg-[#6c63ff]/5 p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 via-transparent to-violet-500/5 pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10">
            Want to work together?
          </h2>
          <p className="text-white/30 mb-6 text-sm relative z-10 max-w-md mx-auto">
            I'm always open to new projects, collaborations and creative challenges.
          </p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6c63ff] text-white rounded-full text-sm font-medium hover:bg-[#5a52e0] transition-all duration-300 relative z-10">
            Get In Touch
          </Link>
        </motion.div>

      </div>
    </main>
  )
}