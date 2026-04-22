import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"

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
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-300/85">
              Discover
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore latest drops from all sellers.
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Browse fresh styles and trending pieces in one place.
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
            <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const image = product?.images?.[0]?.url
                const sellerName = product?.seller?.fullname || "Unknown seller"
                const inStock = product?.countInStock > 0

                return (
                  <article
                    key={product?._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group cursor-pointer flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-3xl transition-all duration-700 hover:-translate-y-3 hover:border-amber-400/40 hover:bg-zinc-900/60 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.05)]"
                  >
                    {/* Image Container with 1:1 Aspect Ratio (Square) */}
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-black/40">
                      {image ? (
                        <>
                          {/* Background Blur Layer */}
                          <img
                            src={image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-20 brightness-50"
                            aria-hidden="true"
                          />
                          {/* Main Image Layer (Fit Inside) */}
                          <div className="relative flex h-full items-center justify-center p-4 transition-transform duration-1000 group-hover:scale-110">
                            <img
                              src={image}
                              alt={product?.title || "Product"}
                              className="max-h-full max-w-full rounded-xl object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center bg-zinc-900 text-sm text-gray-500">
                          <span className="opacity-40 tracking-widest uppercase text-[10px] font-bold">No Visuals</span>
                        </div>
                      )}
                      
                      {/* Floating Seller Tag */}
                      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-white/90 shadow-lg transition-all group-hover:border-amber-400/50 group-hover:bg-amber-400 group-hover:text-black">
                        {sellerName}
                      </div>

                      {/* Stock Status Badge */}
                      <div className={`absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-2.5 py-1 shadow-lg`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-rose-500"}`} />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${inStock ? "text-emerald-400" : "text-rose-400"}`}>
                          {inStock ? "In Stock" : "Sold Out"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 pt-4">
                      {/* Title Section with fixed height for alignment */}
                      <div className="flex h-12 flex-col justify-center text-center">
                        <h3 className="line-clamp-2 text-base font-bold leading-tight tracking-tight text-white transition-colors duration-500 group-hover:text-amber-400">
                          {product?.title || "Untitled Product"}
                        </h3>
                      </div>

                      {/* Footer Section */}
                      <div className="mt-2 flex flex-col items-center space-y-1">
                        <div className="h-px w-8 bg-white/10 transition-all duration-500 group-hover:w-16 group-hover:bg-amber-400/40" />
                        <div className="pt-2 text-center">
                          <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors duration-500 group-hover:text-amber-400/60">
                            Collection Piece
                          </span>
                          <span className="mt-0.5 block bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-xl font-black tracking-tighter text-transparent">
                            {formatCurrency(
                              product?.price?.amount,
                              product?.price?.currency || "INR",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
