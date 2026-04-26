import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import { toggleFavorite, getFavorites } from "../services/favorite.api"
import { motion, AnimatePresence } from "framer-motion"

const ProductCard = ({ product, navigate, formatCurrency, isFavorite, onToggleFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const timerRef = React.useRef(null)

  const images = product?.images?.map(img => img.url).filter(Boolean) || []
  const image = images[currentImageIndex] || "/placeholder.png"
  
  // Calculate actual stock from variants
  const totalStock = product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0
  const inStock = totalStock > 0

  React.useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 1200)
    } else {
      clearInterval(timerRef.current)
      setCurrentImageIndex(0)
    }
    return () => clearInterval(timerRef.current)
  }, [isHovered, images.length])

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product._id}`)}
      className={`group cursor-pointer flex flex-col overflow-hidden rounded-[2rem] border transition-all duration-700 
        ${isHovered 
          ? "border-white/20 bg-white/[0.04] -translate-y-3 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]" 
          : "border-white/[0.03] bg-white/[0.01] shadow-none"
        }`}
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-black/40">
        
        {/* Favorite Button - FIXED ALIGNMENT */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(product._id)
          }}
          className={`absolute left-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 backdrop-blur-2xl hover:scale-110 active:scale-90 group/fav
            ${isFavorite 
              ? "bg-rose-600 border-rose-500/50 text-white shadow-[0_0_30px_rgba(225,29,72,0.6)]" 
              : "bg-white/5 border-white/10 text-white/30 hover:border-white/40 hover:bg-white/10 hover:text-white"}`}
        >
          <svg 
            className={`h-5 w-5 transition-all duration-500 ${isFavorite ? "scale-110" : "scale-100"}`} 
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            />
          </svg>
        </button>

        {/* SOLD OUT RIBBON - BROUGHT BACK */}
        {!inStock && (
          <div className="absolute top-0 right-0 z-30 h-24 w-24 overflow-hidden pointer-events-none">
            <div className="absolute -right-8 top-5 w-32 rotate-45 bg-rose-600 py-1.5 text-center shadow-[0_5px_15px_rgba(225,29,72,0.4)]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Sold Out
              </span>
            </div>
          </div>
        )}

        {/* Main Image */}
        <div className={`relative w-full h-full flex items-center justify-center p-8 transition-all duration-1000 ${isHovered ? "scale-105" : "scale-100"}`}>
          <img
            src={image}
            alt={product?.title || "Product"}
            className="max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Image Progress Indicators - RE-IMPLEMENTED */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-[1.5px] rounded-full transition-all duration-500 ${idx === currentImageIndex ? "w-4 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "w-1.5 bg-white/20"}`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Luxury Info Section */}
      <div className="relative flex flex-1 flex-col p-8 pt-6">
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/60">
            {product?.category || "Essential Collection"}
          </span>
          <h3 className={`text-xl font-light tracking-tight transition-colors duration-500 line-clamp-1 ${isHovered ? "text-white" : "text-white/70"}`}>
            {product?.title || "Untitled Piece"}
          </h3>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Acquisition Value</span>
            <span className="text-2xl font-extralight tracking-tighter text-white">
              {formatCurrency(product?.price?.amount)}
            </span>
          </div>
          
          <div className={`flex items-center gap-4 transition-all duration-700 ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400">Explore</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
              <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const { fetchAllProducts } = useProduct()
  const { products, loading, error } = useSelector(
    (state) => state.product ?? { products: [], loading: false, error: null },
  )
  const [favoriteIds, setFavoriteIds] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchAllProducts()
    const fetchFavorites = async () => {
        try {
            const response = await getFavorites()
            setFavoriteIds(response.favorites.map(f => f._id) || [])
        } catch (error) {
            console.error("Failed to fetch favorites")
        }
    }
    fetchFavorites()
  }, [])

  const handleToggleFavorite = async (productId) => {
    try {
      const { isFavorite } = await toggleFavorite(productId)
      const product = products.find(p => p._id === productId)
      
      if (isFavorite) {
        setFavoriteIds([...favoriteIds, productId])
        showNotification("Added to Favorites", product.title, true)
      } else {
        setFavoriteIds(favoriteIds.filter(id => id !== productId))
        showNotification("Removed from Favorites", product.title, false)
      }
    } catch (err) {
      console.error("Failed to toggle favorite")
    }
  }

  const showNotification = (title, productTitle, added) => {
    setNotification({ title, productTitle, added })
    setTimeout(() => setNotification(null), 4000)
  }

  const formatCurrency = (amount, currency = "INR") => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Number(amount || 0))
    } catch {
      return `${currency} ${amount}`
    }
  }

  return (
    <div className="min-h-screen bg-[#060607] text-white selection:bg-amber-500/30">
      {/* High-End Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            className="fixed bottom-12 right-12 z-[100] flex flex-col min-w-[340px]"
          >
            <div className={`relative overflow-hidden bg-black/80 backdrop-blur-3xl border ${notification.added ? 'border-amber-400/20' : 'border-rose-500/20'} rounded-[2rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]`}>
              <div className={`absolute -right-20 -top-20 w-40 h-40 blur-[80px] opacity-30 rounded-full ${notification.added ? 'bg-amber-500' : 'bg-rose-600'}`} />
              
              <div className="relative flex items-center justify-between gap-8">
                <div className="flex-1">
                  <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-2 ${notification.added ? 'text-amber-400' : 'text-rose-500'}`}>
                    {notification.title}
                  </p>
                  <p className="text-base font-light text-white/90 line-clamp-1 italic tracking-tight">{notification.productTitle}</p>
                </div>
                
                {notification.added && (
                  <Link 
                    to="/account/favorites" 
                    className="flex h-12 px-6 items-center justify-center rounded-full bg-amber-400 text-black text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(251,191,36,0.3)]"
                  >
                    Favorites
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative overflow-hidden px-8 pt-40 pb-40 lg:px-20">
        {/* Background Depth */}
        <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[60%] w-[60%] rounded-full bg-amber-500/5 blur-[160px]" />
        <div className="pointer-events-none fixed right-[-10%] bottom-[-10%] h-[60%] w-[60%] rounded-full bg-orange-600/5 blur-[160px]" />

        <div className="relative mx-auto max-w-[1600px]">
          <header className="mb-24 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.6em] text-amber-500/50">Curated Marketplace</p>
              <h2 className="text-6xl font-extralight tracking-[-0.04em] leading-[0.95] sm:text-8xl">
                The <span className="italic font-serif text-amber-400">Registry</span> Archive.
              </h2>
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
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Loading Archives</p>
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-500/10 bg-rose-500/5 p-12 text-center">
              <p className="text-rose-500 font-light italic">{error}</p>
            </div>
          ) : products?.length > 0 ? (
            <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard 
                  key={product?._id} 
                  product={product} 
                  navigate={navigate} 
                  formatCurrency={formatCurrency}
                  isFavorite={favoriteIds.includes(product._id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </section>
          ) : (
            <div className="rounded-[3rem] border border-white/[0.05] bg-white/[0.01] p-32 text-center backdrop-blur-3xl">
              <p className="text-3xl font-extralight tracking-tight text-white/20 italic">No pieces currently available in the archive.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
