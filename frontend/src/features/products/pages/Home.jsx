import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import { useAuth } from "../../auth/hooks/useAuth"

const Home = () => {
  const navigate = useNavigate()
  const { fetchAllProducts } = useProduct()
  const { handleLogout } = useAuth()
  const user = useSelector((state) => state.auth.user)
  const { products, loading, error } = useSelector(
    (state) => state.product ?? { products: [], loading: false, error: null },
  )

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const onLogout = async () => {
    const result = await handleLogout()
    if (result?.success) {
      navigate("/login", { replace: true })
    }
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
    <div className="min-h-screen bg-[#09090a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0b] shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Wearza logo"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200/80">
                Marketplace
              </p>
              <h1 className="text-xl font-semibold">Wearza</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-gray-300 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-linear-to-r from-yellow-300 to-orange-400" />
                  )}
                </>
              )}
            </NavLink>
            {user?.role === "seller" && (
              <NavLink
                to="/seller/dashboard"
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-all ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Seller
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-linear-to-r from-yellow-300 to-orange-400" />
                    )}
                  </>
                )}
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user?.role === "seller" && (
              <Link
                to="/seller/dashboard"
                className="hidden rounded-lg border border-white/15 bg-[#151517] px-3 py-2 text-sm text-gray-200 transition-all hover:border-amber-300/40 hover:text-white sm:inline-flex"
              >
                Seller Dashboard
              </Link>
            )}

            <div className="hidden rounded-xl border border-white/10 bg-[#141416] px-3 py-2 sm:block">
              <p className="text-sm font-medium text-white">
                {user?.fullname || "Guest User"}
              </p>
              <p className="text-xs text-gray-400">{user?.email || "-"}</p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-linear-to-r from-yellow-300 to-orange-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:brightness-110"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-400/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-500/7 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/80">
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
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => {
                const image = product?.images?.[0]?.url
                const sellerName = product?.seller?.fullname || "Unknown seller"

                return (
                  <article
                    key={product?._id}
                    onClick={()=> navigate(`/product/${product._id}`)}
                    className="overflow-hidden rounded-2xl bg-[#121214]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product?.title || "Product"}
                        className="h-80 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-80 items-center justify-center bg-[#171719] text-sm text-gray-500">
                        No image available
                      </div>
                    )}

                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        By {sellerName}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {product?.title || "Untitled Product"}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                        {product?.description || "No description provided."}
                      </p>

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#18181a] px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                          Price
                        </p>
                        <p className="text-sm font-semibold text-amber-200">
                          {formatCurrency(
                            product?.price?.amount,
                            product?.price?.currency || "INR",
                          )}
                        </p>
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
