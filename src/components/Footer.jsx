import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'

const socialLinks = [
  { name: 'WhatsApp', href: 'https://wa.me/8801794078825' },
  { name: 'Instagram', href: 'https://www.instagram.com/yousufhasanxz' },
  { name: 'YouTube', href: 'https://youtube.com/@xaninxz' },
  { name: 'GitHub', href: 'https://github.com/yousufx76' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/xanin-kaizo-graphics-designer/' },
  { name: 'Fiverr', href: 'https://www.fiverr.com/s/gDbq31v' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583585307485' },
]

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Works', path: '/works' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.06] bg-[#030303] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-widest text-white">
              XANIN <span className="text-[#6c63ff]">XZ</span>
            </h2>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Creative professional. Video editor, graphic designer and web developer based in Dhaka, Bangladesh.
            </p>
          </div>

          {/* Navigate */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-2">
              Navigate
            </h3>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={scrollToTop}
                className="text-sm text-white/30 hover:text-[#6c63ff] transition-colors w-fit"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-2">
              Get In Touch
            </h3>

            {/* FIXED: Added missing <a> tag */}
            <a 
              href="mailto:xaninstudio@gmail.com?subject=Project%20Inquiry%20%E2%80%94%20XANIN%20XZ"
              className="flex items-center gap-2 text-sm text-white/30 hover:text-[#6c63ff] transition-colors w-fit"
            >
              <Mail size={14} />
              xaninstudio@gmail.com
            </a>

            <div className="flex items-center gap-2 text-sm text-white/30">
              <MapPin size={14} />
              Savar, Dhaka, Bangladesh
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              {socialLinks.map((social) => (
                /* FIXED: Added missing <a> tag */
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-white/30 hover:text-[#6c63ff] transition-all duration-300 uppercase tracking-widest font-medium border border-white/[0.06] px-2 py-1 rounded-md hover:border-[#6c63ff]/30"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            {new Date().getFullYear()} XANIN XZ. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Designed and built by <span className="text-[#6c63ff]">Yousuf Hasan</span>
          </p>
        </div>

      </div>
    </footer>
  )
}