import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFavorites, toggleFavorite } from '../services/favorite.api'
import { Link } from 'react-router-dom'

const Favorites = () => {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await getFavorites()
                setFavorites(response.favorites || [])
            } catch (error) {
                console.error("Failed to fetch favorites:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchFavorites()
    }, [])

    const handleRemove = async (productId) => {
        try {
            const { success } = await toggleFavorite(productId)
            if (success) {
                setFavorites(favorites.filter(p => p._id !== productId))
            }
        } catch (error) {
            console.error("Failed to remove favorite:", error)
        }
    }

    return (
        <div className="min-h-screen bg-[#060607] text-white pt-32 pb-32 px-6 selection:bg-amber-500/30 overflow-x-hidden">
            {/* Atmospheric Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[160px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/5 blur-[160px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <p className="text-[9px] font-black uppercase tracking-[0.8em] text-amber-500/50 mb-4">
                            Saved Items
                        </p>
                        <h1 className="text-6xl md:text-8xl font-extralight tracking-[-0.05em] leading-none mb-2">
                            Your <span className="italic font-serif text-amber-400">Favorites</span>
                        </h1>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col gap-2"
                    >
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Saved Items</p>
                        <p className="text-4xl font-extralight tracking-tighter tabular-nums">
                            {favorites.length}
                        </p>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-12 h-px bg-amber-500/20 relative overflow-hidden">
                            <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 bg-amber-400"
                            />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Loading Favorites</p>
                    </div>
                ) : favorites.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] backdrop-blur-3xl"
                    >
                        <h2 className="text-2xl font-light text-white/40 mb-8 tracking-tight italic">Your favorites list is currently empty.</h2>
                        <Link to="/" className="inline-flex items-center gap-4 text-amber-400 text-[10px] font-black uppercase tracking-[0.5em] hover:gap-8 transition-all duration-700">
                            Explore Collection <span className="text-xl">→</span>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        <AnimatePresence mode='popLayout'>
                            {favorites.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="group relative"
                                >
                                    <Link to={`/product/${product._id}`} className="block">
                                        <div className="aspect-[3/4] bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden relative transition-all duration-700 group-hover:border-amber-400/20">
                                            <img 
                                                src={product.images?.[0]?.url || product.images?.[0]} 
                                                alt={product.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-2">View Piece</p>
                                                <h3 className="text-2xl font-light leading-tight">{product.title}</h3>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Quick Actions */}
                                    <div className="mt-6 flex items-center justify-between px-2">
                                        <div>
                                            <p className="text-[11px] font-medium text-white/40 mb-1">{product.price.currency} {product.price.amount.toLocaleString()}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleRemove(product._id)}
                                            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all group/btn"
                                        >
                                            <svg className="w-5 h-5 text-white/20 group-hover/btn:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 13H5v-2h14v2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favorites
