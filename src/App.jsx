import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Contact from './pages/Contact'
import Admin from './pages/Admin.jsx'
import CV from './pages/CV.jsx'
import Reviews from './pages/Reviews'



function App() {
  const [loaded, setLoaded] = useState(false)
  const location = useLocation()

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="bg-[#030303] min-h-screen">
      <Loader onComplete={() => setLoaded(true)} />
      {loaded && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/works" element={<Works />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App