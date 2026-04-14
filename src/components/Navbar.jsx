import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoImg from '../assets/Xanin-XZ.png'

const navItems = [
  { name: 'Works', path: '/works' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <>
      <style>{`
        @keyframes aura-pulse {
          0% { text-shadow: 0 0 10px rgba(108, 99, 255, 0.4); }
          50% { text-shadow: 0 0 25px rgba(108, 99, 255, 0.9), 0 0 10px rgba(108, 99, 255, 0.4); }
          100% { text-shadow: 0 0 10px rgba(108, 99, 255, 0.4); }
        }
        .aura-text { animation: aura-pulse 3s infinite ease-in-out; }
      `}</style>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled
          ? 'py-4 backdrop-blur-xl bg-black/60 border-b border-[#6c63ff]/20'
          : 'py-8 bg-transparent'
      }`}>

        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="XANIN XZ"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-10 items-center">

            <div className="relative group">
              <Link
                to="/"
                className="aura-text text-[14px] font-semibold uppercase tracking-[0.6em] text-[#6c63ff] pr-6 border-r border-white/10 transition-all duration-500 hover:text-white"
              >
                XANIN
              </Link>
              <span className="absolute bottom-[-8px] left-0 w-0 h-[1px] bg-[#6c63ff] transition-all duration-500 group-hover:w-[calc(100%-1.5rem)]" />
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative text-[9px] uppercase tracking-[0.4em] transition-all duration-300 py-1 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/30 hover:text-white'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-[1px] bg-[#6c63ff] transition-all duration-500 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}

            <Link
              to="/contact"
              className="text-[9px] uppercase tracking-[0.4em] px-5 py-2 border border-[#6c63ff]/40 text-[#6c63ff] hover:bg-[#6c63ff] hover:text-white rounded-full transition-all duration-300"
            >
              Hire Me
            </Link>

          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 mx-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="flex flex-col px-6 py-6 gap-6">

              <img src={logoImg} alt="XANIN XZ" className="h-10 w-auto object-contain" />

              <div className="w-full h-[1px] bg-white/10" />

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-xs uppercase tracking-[0.3em] transition-colors duration-300 ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-white/30 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="w-full h-[1px] bg-white/10" />

              <Link
                to="/contact"
                className="text-xs uppercase tracking-[0.3em] px-5 py-3 bg-[#6c63ff] text-white rounded-full text-center hover:bg-[#5a52e0] transition-all duration-300"
              >
                Hire Me
              </Link>

            </div>
          </div>
        )}

      </nav>
    </>
  )
}