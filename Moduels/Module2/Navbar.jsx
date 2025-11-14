import { Link } from 'react-router-dom'
import logo from '../assets/logoo.png'

export default function Navbar() {
  const authed = !!localStorage.getItem('token')
  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-500/20 bg-[#0b1220]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center" aria-label="Financify home">
            <img src={logo} alt="Financify logo" className="h-8 w-auto" />
          </Link>
          <Link to="/about" className="text-slate-300 hover:text-white text-sm">About</Link>
          <a href="/discover" className="text-slate-300 hover:text-white text-sm">Discover</a>
          {/* <a href="/services" className="text-slate-300 hover:text-white text-sm">Services</a> */}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {authed && (
            <Link to="/dashboard" className="text-slate-300 hover:text-white text-sm">Dashboard</Link>
          )}
          {authed ? null : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-full border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 hover:text-black transition">Login</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

