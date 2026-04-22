import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"

const ProductCard = ({ product, navigate, formatCurrency }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const timerRef = React.useRef(null)

  const images = product?.images?.map(img => img.url).filter(Boolean) || []
  const image = images[currentImageIndex] || "/placeholder.png"
  const sellerName = product?.seller?.fullname || "Unknown seller"
  const inStock = product?.countInStock > 0

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
      className={`group cursor-pointer flex flex-col overflow-hidden rounded-xl border transition-all duration-500 
        ${isHovered 
          ? "border-amber-400/40 bg-zinc-900/90 -translate-y-2 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5),0_0_20px_rgba(251,191,36,0.05)]" 
          : "border-white/5 bg-zinc-900/20 shadow-none"
        }`}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-black/20">
        {/* Favorite Action */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Placeholder for favorite logic
            console.log("Toggle favorite:", product._id)
          }}
          className="absolute left-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white/40 transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-400 hover:text-black hover:scale-110 group/fav"
        >
          <svg className="h-4 w-4 transition-transform group-hover/fav:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Background Blur Layer */}
        <img
          src={image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover blur-3xl opacity-10 transition-opacity duration-1000 ${isHovered ? "opacity-20" : "opacity-10"}`}
          aria-hidden="true"
        />
        
        {/* Sold Out - Corner Ribbon Style */}
        {!inStock && (
          <div className="absolute top-0 right-0 z-20 h-20 w-20 overflow-hidden">
            <div className="absolute -right-7 top-4 w-28 rotate-45 bg-rose-600 py-1 text-center shadow-lg">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                Sold Out
              </span>
            </div>
          </div>
        )}

        {/* Main Image Layer */}
        <div className={`relative flex h-full items-center justify-center p-7 transition-all duration-1000 ${isHovered ? "scale-110" : "scale-100"}`}>
          <img
            src={image}
            alt={product?.title || "Product"}
            className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all duration-500"
          />
        </div>
        
        {/* Image Progress Indicators */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-30">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-[1px] rounded-full transition-all duration-500 ${idx === currentImageIndex ? "w-3 bg-amber-400" : "w-1 bg-white/20"}`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section - Architectural Refinement */}
      <div className="relative flex flex-1 flex-col p-5">
        {/* Subtle Accent Glow */}
        <div className={`absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent transition-all duration-700 ${isHovered ? "w-full opacity-100" : "w-0 opacity-0"}`} />
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${!inStock ? "text-rose-500" : "text-amber-400/40"}`}>
              {!inStock ? "Archive Piece" : (product?.category || "Essential")}
            </span>
            {inStock && (
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                <span className="text-[7px] font-bold uppercase tracking-widest text-emerald-400/60">Ready</span>
              </div>
            )}
          </div>
          <h3 className={`line-clamp-1 text-sm font-bold tracking-tight transition-colors duration-500 ${isHovered ? "text-white" : "text-white/80"}`}>
            {product?.title || "Untitled Piece"}
          </h3>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">Value</span>
            <span className="text-lg font-black tracking-tighter text-white">
              {formatCurrency(product?.price?.amount)}
            </span>
          </div>
          
          <div className={`flex h-8 w-8 items-center justify-center rounded-sm border border-white/5 bg-white/5 transition-all duration-500 ${isHovered ? "border-amber-400/30 text-amber-400 translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
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

  useEffect(() => {
    fetchAllProducts()
  }, [])

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
    <div className="min-h-screen bg-[#09090a] text-white">
      <main className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-400/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-500/7 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400/60">
              Discover
            </p>
            <h2 className="text-3xl font-light tracking-tight sm:text-5xl">
              Explore latest <span className="text-amber-400">drops</span> from all sellers.
            </h2>
            <p className="mt-4 text-sm text-gray-500 font-light max-w-xl">
              Browse fresh styles and trending pieces curated from our exclusive community of high-end creators.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-[#121214] p-6 text-sm text-gray-300">
              Loading products...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && (!products || products.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-[#121214] p-8 text-center">
              <p className="text-lg font-medium text-white">
                No products found
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Products will appear here once sellers publish them.
              </p>
            </div>
          )}

          {!loading && !error && products?.length > 0 && (
            <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard 
                  key={product?._id} 
                  product={product} 
                  navigate={navigate} 
                  formatCurrency={formatCurrency} 
                />
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
