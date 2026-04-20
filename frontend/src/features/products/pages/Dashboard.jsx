import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useProduct } from "../hooks/useProduct.js"
import { Link, useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()

  const { fetchSellerProducts } = useProduct()
  const [activeImageMap, setActiveImageMap] = useState({})
  const { sellerProducts, loading, error } = useSelector(
    (state) =>
      state.product ?? {
        sellerProducts: [],
        loading: false,
        error: null,
      },
  )

  useEffect(() => {
    fetchSellerProducts()
  }, [])

  const { totalProducts, totalValue, totalImages } = useMemo(() => {
    const products = Array.isArray(sellerProducts) ? sellerProducts : []

    return {
      totalProducts: products.length,
      totalValue: products.reduce(
        (sum, product) => sum + Number(product?.price?.amount || 0),
        0,
      ),
      totalImages: products.reduce(
        (sum, product) =>
          sum + (Array.isArray(product?.images) ? product.images.length : 0),
        0,
      ),
    }
  }, [sellerProducts])

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

  const formatDate = (value) => {
    if (!value) return "-"
    return new Date(value).toLocaleDateString()
  }

  const getActiveImageIndex = (productId, imagesLength) => {
    const currentIndex = activeImageMap[productId] ?? 0

    if (!imagesLength || currentIndex < 0) return 0
    if (currentIndex >= imagesLength) return 0

    return currentIndex
  }

  const setActiveImage = (productId, index) => {
    setActiveImageMap((prev) => ({
      ...prev,
      [productId]: index,
    }))
  }

  const shiftActiveImage = (productId, imagesLength, step) => {
    if (!imagesLength) return

    const current = getActiveImageIndex(productId, imagesLength)
    const next = (current + step + imagesLength) % imagesLength
    setActiveImage(productId, next)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-300/80">
              Seller Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your Product Performance
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              View your catalog, monitor inventory visuals, and manage listings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchSellerProducts}
              className="rounded-xl border border-white/10 bg-[#141414] px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:border-yellow-400/60 hover:text-yellow-300"
            >
              Refresh
            </button>
            <Link
              to="/seller/create-product"
              className="rounded-xl bg-linear-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:brightness-110"
            >
              Create Product
            </Link>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-[#121212]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Total Products
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {totalProducts}
            </p>
          </div>
          <div className="rounded-2xl bg-[#121212]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Total Value
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#121212]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Images Uploaded
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {totalImages}
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-[#121212] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
              >
                <div className="h-48 bg-[#181818]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-[#1d1d1d]" />
                  <div className="h-3 w-full rounded bg-[#1a1a1a]" />
                  <div className="h-3 w-2/3 rounded bg-[#1a1a1a]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && totalProducts === 0 && (
          <div className="rounded-2xl bg-[#121212] p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            <p className="text-lg font-semibold text-white">No products yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Start by creating your first listing.
            </p>
            <Link
              to="/seller/create-product"
              className="mt-5 inline-block rounded-xl bg-linear-to-r from-yellow-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110"
            >
              Create First Product
            </Link>
          </div>
        )}

        {!loading && !error && totalProducts > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sellerProducts.map((product) => {
              const images = Array.isArray(product?.images)
                ? product.images
                : []
              const activeImageIndex = getActiveImageIndex(
                product?._id,
                images.length,
              )
              const primaryImage =
                images[activeImageIndex]?.url || images[0]?.url
              const currency = product?.price?.currency || "INR"
              const priceAmount = product?.price?.amount || 0

              return (
                <article
                  key={product?._id}
                  onClick={() => {
                    navigate(`/seller/product/${product._id}`)
                  }}
                  className="overflow-hidden rounded-2xl bg-[#121212]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.22),0_14px_34px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative bg-[#0d0d0d]">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product?.title || "Product image"}
                        className="h-64 w-full object-contain object-center sm:h-72"
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-[#171717] text-sm text-gray-500 sm:h-72">
                        No image uploaded
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/55 to-transparent" />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            shiftActiveImage(product?._id, images.length, -1)
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition-all hover:border-yellow-300/50 hover:bg-black/70"
                          aria-label="Previous image"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            shiftActiveImage(product?._id, images.length, 1)
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition-all hover:border-yellow-300/50 hover:bg-black/70"
                          aria-label="Next image"
                        >
                          Next
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="border-t border-white/5 bg-[#101010] px-3 py-2">
                      <div className="grid grid-cols-7 gap-2 py-1">
                        {images.map((image, index) => (
                          <button
                            type="button"
                            key={`${product?._id}-${index}`}
                            onClick={(event) => {
                              event.stopPropagation()
                              setActiveImage(product?._id, index)
                            }}
                            className={`aspect-square min-w-0 overflow-hidden rounded-lg transition-all ${activeImageIndex === index ? "ring-2 ring-yellow-400" : "border border-white/10 opacity-80"}`}
                            aria-label={`Show image ${index + 1}`}
                          >
                            <img
                              src={image?.url}
                              alt={`${product?.title || "Product"} image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold text-white sm:text-2xl">
                        {product?.title || "Untitled Product"}
                      </h3>
                    </div>

                    <div className="mb-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-[#171717] px-2.5 py-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                          Price
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-yellow-300 sm:text-base">
                          {formatCurrency(priceAmount, currency)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#171717] px-2.5 py-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                          Images
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-white sm:text-base">
                          {product?.images?.length || 0}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#171717] px-2.5 py-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                          Created
                        </p>
                        <p className="mt-1.5 text-xs font-semibold text-white sm:text-sm">
                          {formatDate(product?.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p
                      className="text-sm leading-6 text-gray-400"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product?.description || "No description"}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
