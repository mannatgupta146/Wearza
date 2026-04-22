import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { useCart } from "../../cart/hooks/useCart"

const Nav = () => {
    const navigate = useNavigate()
    const { handleLogout } = useAuth()
    const { handleGetCart } = useCart()
    const user = useSelector((state) => state.auth.user)
    const cartItems = useSelector(state => state.cart.items)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        if (user) {
            handleGetCart()
        }
    }, [user])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const onLogout = async () => {
        const result = await handleLogout()
        if (result?.success) {
            navigate("/login", { replace: true })
        }
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
            scrolled 
            ? "py-4 bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl" 
            : "py-6 bg-transparent"
        }`}>
            <div className="mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between">
                
                {/* Brand */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <img src="/logo.png" alt="W" className="w-9 h-9 object-contain relative z-10 transition-transform duration-700 group-hover:rotate-[360deg]" />
                        <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-xl font-light tracking-[0.1em] text-white">WEARZA</h1>
                        <p className="text-[7px] font-black tracking-[0.4em] text-amber-400/50 uppercase">Marketplace</p>
                    </div>
                </Link>

                {/* Core Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    <NavLink to="/" end className={({ isActive }) => `
                        text-[10px] font-bold uppercase tracking-[0.25em] transition-all
                        ${isActive ? "text-amber-400" : "text-white/40 hover:text-white"}
                    `}>
                        Home
                    </NavLink>
                    {user?.role === "seller" && (
                        <NavLink to="/seller/dashboard" className={({ isActive }) => `
                            text-[10px] font-bold uppercase tracking-[0.25em] transition-all
                            ${isActive ? "text-amber-400" : "text-white/40 hover:text-white"}
                        `}>
                            Seller Dashboard
                        </NavLink>
                    )}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    {/* Cart Icon - Reverted to your preferred style */}
                    <Link to="/cart" className="relative p-2 group">
                        <svg className="w-6 h-6 text-white/60 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartItems?.length > 0 && (
                            <span className="absolute top-0 right-0 h-4 min-w-[16px] px-1 bg-amber-400 text-black text-[9px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <div className="h-4 w-[1px] bg-white/10 mx-2" />

                    {user ? (
                        <div className="flex items-center gap-4">
                            {/* User Profile Info */}
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-[11px] font-bold text-white uppercase tracking-wider">{user.fullname}</span>
                                <span className="text-[9px] text-amber-400/60 uppercase tracking-widest font-bold">{user.role}</span>
                            </div>
                            
                            {/* Logout - Premium Button */}
                            <button
                                onClick={onLogout}
                                className="px-5 py-2 rounded-sm bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all active:scale-[0.95]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-8 py-2 rounded-sm border border-white/10 bg-white/5 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-amber-400/50 hover:text-amber-400 transition-all duration-500 active:scale-[0.95]"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Nav