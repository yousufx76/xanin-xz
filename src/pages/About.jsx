import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, ExternalLink } from 'lucide-react'
import mainImg from '../assets/mainimage.png'

const skills = [
  { name: 'Graphic Design', level: 92 },
  { name: 'Web Development', level: 80 },
  { name: 'Video Editing', level: 75 },
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
}

export default function About() {
  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#6c63ff]"></span>
            <span className="text-xs tracking-widest text-[#6c63ff] uppercase">About Me</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Who I Am</h1>
        </motion.div>

        {/* Top section — image + bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

          {/* Image Component */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile View */}
            <div className="flex items-center gap-6 md:hidden mb-6">
              <div className="relative w-24 h-24 shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-[#6c63ff]/20 blur-xl" />
                <img
                  src={mainImg}
                  alt="Yousuf Hasan"
                  className="relative z-10 w-full h-full object-cover rounded-2xl border border-white/[0.08]"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Yousuf Hasan</h2>
                <p className="text-[#6c63ff] text-xs tracking-widest uppercase mt-1">XANIN XZ</p>
                <p className="text-white/40 text-xs mt-2 italic">Obsessed with quality.</p>
              </div>
            </div>

            {/* Desktop View */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 rounded-3xl bg-[#6c63ff]/10 blur-2xl" />
              <img
                src={mainImg}
                alt="Yousuf Hasan"
                className="relative z-10 w-full rounded-3xl border border-white/[0.08] object-cover shadow-2xl"
              />
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#6c63ff]/60 rounded-tl-lg z-20" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#6c63ff]/60 rounded-br-lg z-20" />
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 justify-center"
          >
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-white">
                Yousuf Hasan
                <span className="text-[#6c63ff]"> — XANIN XZ</span>
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-white/50 leading-relaxed text-sm">
              <p className="italic text-white/40">"Obsessed with quality, driven by self-learning."</p>
              <p>
                I'm a creative professional based in Savar, Dhaka, specializing in high-end video editing, 
                visual art, and modern web development.
              </p>
              <p>
                I build digital experiences for dreamers and freelancers. My goal is to combine technical 
                precision with artistic flair, bringing a chill yet dedicated energy to every project.
              </p>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-white/40">
                <MapPin size={15} className="text-[#6c63ff] shrink-0" />
                Savar, Dhaka, Bangladesh
              </div>
              
              <a 
                href="mailto:xaninstudio@gmail.com?subject=Project%20Inquiry"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-[#6c63ff] transition-colors w-fit"
              >
                <Mail size={15} className="text-[#6c63ff] shrink-0" />
                xaninstudio@gmail.com
              </a>
            </div>

            {/* Socials - FIXED missing <a> tag */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socials.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-[#6c63ff] hover:border-[#6c63ff]/30 transition-all duration-300 uppercase tracking-widest border border-white/[0.06] px-3 py-1.5 rounded-full"
                >
                  {social.name} <ExternalLink size={9} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills + Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Skills */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Professional Skills</h2>
            <div className="flex flex-col gap-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">{skill.name}</span>
                    <span className="text-sm text-white/30">{skill.level}%</span>
                  </div>
                  <div className="w-full h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#6c63ff] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: 'circOut' }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tools - FIXED missing <a> tag */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Technical Stack</h2>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <a 
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-white/50 hover:border-[#6c63ff]/50 hover:text-white hover:bg-[#6c63ff]/5 transition-all duration-300"
                >
                  {tool.name}
                  <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6c63ff]" />
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  )
}