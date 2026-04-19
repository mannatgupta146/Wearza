import React, { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"

const ProductDetails = () => {
  const { productId } = useParams()

  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageTransitioning, setIsImageTransitioning] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [copied, setCopied] = useState(false)

  const transitionTimerRef = useRef(null)
  const copyTimerRef = useRef(null)

  const { fetchProductDetails } = useProduct()

  async function fetchDetails() {
    setLoading(true)
    setError("")

    const data = await fetchProductDetails(productId)

    if (data.success) {
      setProduct(data.product)
      setSelectedImageIndex(0)
      setQuantity(1)
    } else {
      setError(data.message || "Failed to fetch product details")
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchDetails()
  }, [productId])

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

  const productImages = (product?.images || [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean)

  const selectedImage = productImages[selectedImageIndex] || null
  const hasMultipleImages = productImages.length > 1

  const setImageWithTransition = (nextIndex) => {
    if (nextIndex === selectedImageIndex) return

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current)
    }

    setIsImageTransitioning(true)
    transitionTimerRef.current = setTimeout(() => {
      setSelectedImageIndex(nextIndex)
      setIsImageTransitioning(false)
    }, 120)
  }

  const handlePreviousImage = () => {
    if (productImages.length <= 1) return
    const nextIndex =
      selectedImageIndex === 0
        ? productImages.length - 1
        : selectedImageIndex - 1
    setImageWithTransition(nextIndex)
  }

  const handleNextImage = () => {
    if (productImages.length <= 1) return
    const nextIndex =
      selectedImageIndex === productImages.length - 1
        ? 0
        : selectedImageIndex + 1
    setImageWithTransition(nextIndex)
  }

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  const handleShare = async () => {
    const pageUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || "Wearza Product",
          text: "Check out this product on Wearza",
          url: pageUrl,
        })
        return
      } catch {
        // If native share is dismissed, fallback to clipboard action.
      }
    }

    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current)
      }

      copyTimerRef.current = setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  useEffect(() => {
    if (!hasMultipleImages) return

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handlePreviousImage()
      }

      if (event.key === "ArrowRight") {
        handleNextImage()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [hasMultipleImages, selectedImageIndex, productImages.length])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#09090a] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#151517] px-4 py-2 text-sm text-gray-100 transition-all hover:border-amber-300/40 hover:text-white"
          >
            <span aria-hidden="true">{"<-"}</span>
            Back to Home
          </Link>

          {!loading && !error && product && (
            <p className="bg-linear-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-xs uppercase tracking-[0.22em] text-transparent">
              Product Details
            </p>
          )}
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#121214] p-6 text-sm text-gray-300">
            Loading product details...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && product && (
          <section>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="relative overflow-hidden rounded-md border border-white/10 bg-[#141416]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product?.title || "Product image"}
                      className={`h-128 w-full object-cover transition-all duration-300 sm:h-144 ${
                        isImageTransitioning
                          ? "scale-[1.02] opacity-80"
                          : "scale-100 opacity-100"
                      }`}
                    />
                  ) : (
                    <div className="flex h-120 items-center justify-center text-sm text-gray-500 sm:h-136">
                      No image available
                    </div>
                  )}

                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={handlePreviousImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md border border-white/20 bg-[#0f0f10]/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all hover:border-amber-300/70"
                        aria-label="Show previous image"
                      >
                        Prev
                      </button>

                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/20 bg-[#0f0f10]/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all hover:border-amber-300/70"
                        aria-label="Show next image"
                      >
                        Next
                      </button>

                      <div className="absolute bottom-3 right-3 rounded-md border border-white/20 bg-black/50 px-3 py-1 text-xs text-white/90">
                        {selectedImageIndex + 1} / {productImages.length}
                      </div>
                    </>
                  )}
                </div>

                {hasMultipleImages && (
                  <div className="mt-3 grid grid-cols-7 gap-2">
                    {productImages.map((imageUrl, index) => {
                      const isActive = index === selectedImageIndex

                      return (
                        <button
                          type="button"
                          key={`${imageUrl}-${index}`}
                          onClick={() => setImageWithTransition(index)}
                          className={`overflow-hidden rounded-sm border transition-all ${
                            isActive
                              ? "border-amber-300 shadow-[0_0_0_2px_rgba(252,211,77,0.25)]"
                              : "border-white/15 hover:border-white/40"
                          }`}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={imageUrl}
                            alt={`${product?.title || "Product"} thumbnail ${index + 1}`}
                            className="h-18 w-full object-cover"
                          />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#121214] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                    Product
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWishlisted((prev) => !prev)}
                      className={`rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all ${
                        isWishlisted
                          ? "border-amber-300/70 bg-[#2a2417] text-amber-100"
                          : "border-white/15 bg-[#17181b] text-gray-200 hover:border-amber-300/40"
                      }`}
                    >
                      {isWishlisted ? "Wishlisted" : "Wishlist"}
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="rounded-md border border-white/15 bg-[#17181b] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-200 transition-all hover:border-amber-300/40"
                    >
                      {copied ? "Copied" : "Share"}
                    </button>
                  </div>
                </div>

                <h1 className="mt-2 bg-linear-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-3xl font-medium leading-tight text-transparent sm:text-4xl">
                  {product?.title || "Untitled Product"}
                </h1>

                <p className="mt-3 text-xs uppercase tracking-[0.12em] text-gray-500">
                  In {product?.price?.currency || "INR"}
                </p>

                <p className="mt-1 bg-linear-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
                  {formatCurrency(
                    product?.price?.amount,
                    product?.price?.currency || "INR",
                  )}
                </p>

                <div className="mt-5 h-px bg-white/10" />

                <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
                  {product?.description ||
                    "No description provided for this product yet."}
                </p>

                <div className="mt-6 space-y-2 text-sm">
                  <p className="text-gray-300">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                      Seller:
                    </span>{" "}
                    {product?.seller?.fullname || "Unknown"}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                      Currency:
                    </span>{" "}
                    {product?.price?.currency || "INR"}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-md border border-white/10 bg-[#17181b] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                    Quantity
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      className="h-8 w-8 rounded-md border border-white/20 bg-[#111215] text-sm font-semibold text-gray-200 transition-all hover:border-amber-300/50"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      className="h-8 w-8 rounded-md border border-white/20 bg-[#111215] text-sm font-semibold text-gray-200 transition-all hover:border-amber-300/50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <button
                    type="button"
                    className="w-full border border-[#3a3f4a] bg-[#2a2f38] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all hover:-translate-y-0.5 hover:border-[#50586b] hover:bg-[#323846]"
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="w-full border border-amber-200/50 bg-linear-to-r from-yellow-300 via-amber-300 to-orange-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#161616] shadow-[0_10px_20px_rgba(245,158,11,0.26)] transition-all hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="mt-5 h-px bg-white/10" />

                <p className="mt-4 text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Secure checkout and trusted seller delivery.
                </p>

                {hasMultipleImages && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-gray-600">
                    Tip: use keyboard arrows to browse product images.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
