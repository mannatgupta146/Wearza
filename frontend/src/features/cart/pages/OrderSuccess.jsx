import React, { useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const OrderSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)
    const orderId = queryParams.get("order_id")

    // Redirect if no order ID is present to maintain the "exclusive" feel
    useEffect(() => {
        if (!orderId) {
            navigate('/')
        }
    }, [orderId, navigate])

    if (!orderId) return null

    return (
        <div className="min-h-screen bg-[#09090a] flex flex-col items-center pt-32 pb-20 px-6 selection:bg-amber-500/30 overflow-x-hidden">
            {/* Ambient Background Glows - Matching Brand Theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-xl text-center"
            >
                {/* Refined Success Seal with Brand Glow */}
                <div className="mb-14 relative">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 rounded-full flex items-center justify-center mx-auto relative z-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.1)]"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="3" 
                                d="M5 13l4 4L19 7" 
                            />
                        </svg>
                    </motion.div>
                    {/* Atmospheric Amber Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Header */}
                <h1 className="text-white text-[10px] font-black uppercase tracking-[0.8em] mb-4 opacity-50">
                    Transaction Confirmed
                </h1>
                <h2 className="text-4xl md:text-5xl font-extralight text-white tracking-[-0.05em] mb-8 leading-tight">
                    Your collection is on <br />
                    <span className="italic font-serif text-amber-400/90">its way.</span>
                </h2>

                {/* Slim & Refined Order Reference */}
                <div className="mb-12 relative flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">
                        Reference ID
                    </span>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3 bg-white/[0.03] border border-white/5 px-6 py-3 rounded-2xl backdrop-blur-md max-w-full">
                        <span className="text-sm md:text-lg font-mono text-white/80 tracking-widest break-all">
                            {orderId}
                        </span>
                        
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(orderId)
                            }}
                            className="p-2 hover:text-amber-400 transition-colors text-white/30"
                            title="Copy Reference"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Footer Message */}
                <p className="text-white/40 text-[11px] leading-relaxed max-w-sm mx-auto mb-12 uppercase tracking-widest font-medium">
                    A confirmation email has been dispatched to your registered digital address with full tracking logistics.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto bg-white text-black px-10 py-4.5 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-amber-400 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(245,158,11,0.2)]"
                    >
                        Continue Exploring
                    </Link>
                    <Link 
                        to="/account/orders" 
                        className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-4.5 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-white/10 transition-all duration-500 backdrop-blur-md"
                    >
                        View Registry
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default OrderSuccess