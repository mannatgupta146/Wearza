import React, { useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useProduct } from "../hooks/useProduct"
import { useCart } from "../../cart/hooks/useCart"
import InventoryNotification from "../components/InventoryNotification.jsx"
import AlertNotification from "../../Shared/components/AlertNotification.jsx"

const ProductDetails = () => {
  const { productId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageTransitioning, setIsImageTransitioning] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null)

  const transitionTimerRef = useRef(null)
  const copyTimerRef = useRef(null)
  const errorTimerRef = useRef(null)

  const { fetchProductDetails } = useProduct()
  const { handleAddItem } = useCart()

  async function fetchDetails() {
    setLoading(true)
    setError("")

    const data = await fetchProductDetails(productId)

    if (data.success) {
      setProduct(data.product)
      setSelectedImageIndex(0)
      setQuantity(1)
      
      // Handle variant from URL
      const variantIdFromUrl = searchParams.get("variant")
      if (variantIdFromUrl && data.product.variants) {
        const matchingVariant = data.product.variants.find(v => v._id === variantIdFromUrl)
        if (matchingVariant) {
          setSelectedVariant(matchingVariant)
          setSelectedAttributes(matchingVariant.attributes || {})
        }
      }
    } else {
      setError(data.message || "Failed to fetch product details")
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchDetails()
  }, [productId])

  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {}
    const attrs = {}
    product.variants.forEach((variant) => {
      Object.entries(variant.attributes || {}).forEach(([key, value]) => {
        if (!attrs[key]) attrs[key] = new Set()
        attrs[key].add(value)
      })
    })
    Object.keys(attrs).forEach((key) => {
      attrs[key] = Array.from(attrs[key])
    })
    return attrs
  }, [product])

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setSelectedVariant(null)
    }
  }, [selectedAttributes])


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

  const productImages = (selectedVariant?.images || product?.images || [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean)

  useEffect(() => {
    if (selectedImageIndex >= productImages.length && productImages.length > 0) {
      setSelectedImageIndex(0)
    }
  }, [productImages.length, selectedImageIndex])

  const displayedImage = selectedVariant
    ? selectedVariant?.images?.[selectedImageIndex]?.url
    : productImages[selectedImageIndex] || null

  const displayedTitle = selectedVariant?.title || product?.title
  const displayedPrice =
    selectedVariant?.price?.amount || product?.price?.amount
  const displayedStock = selectedVariant?.stock || product?.stock || 0
  const isInStock = displayedStock > 0

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

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1)
    } else {
      toast(AlertNotification, {
        toastId: "max-qty-reached",
        data: { message: "Maximum order quantity is 10 units", type: "warning" },
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeButton: false,
        className: "!bg-[#09090a]/95 !border !border-amber-500/20 !rounded-[1.2rem] !p-0 !shadow-[0_20px_40px_rgba(0,0,0,0.8)] !backdrop-blur-3xl !mb-6 !mr-6 !w-auto !min-w-0 !overflow-hidden",
        progressClassName: "!bg-amber-500 !h-0.5 !bottom-1 !left-6 !right-6",
      })
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    } else {
      toast(AlertNotification, {
        toastId: "min-qty-reached",
        data: { message: "Minimum order quantity is 1 unit", type: "warning" },
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeButton: false,
        className: "!bg-[#09090a]/95 !border !border-amber-500/20 !rounded-[1.2rem] !p-0 !shadow-[0_20px_40px_rgba(0,0,0,0.8)] !backdrop-blur-3xl !mb-6 !mr-6 !w-auto !min-w-0 !overflow-hidden",
        progressClassName: "!bg-amber-500 !h-0.5 !bottom-1 !left-6 !right-6",
      })
    }
  }

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

  const handleAttributeSelect = (key, value) => {
    setSelectedAttributes((prev) => {
      const newAttrs = { ...prev }
      if (newAttrs[key] === value) {
        delete newAttrs[key]
      } else {
        newAttrs[key] = value
      }

      // Find matching variant based on ALL currently selected attributes
      const matchingVariant = product.variants.find((variant) => {
        return Object.entries(newAttrs).every(
          ([attrKey, attrValue]) => variant.attributes[attrKey] === attrValue,
        )
      })

      // Update variant state if all attributes for a variant are selected
      if (Object.keys(newAttrs).length > 0 && matchingVariant) {
        setSelectedVariant(matchingVariant)
      } else {
        setSelectedVariant(null)
      }

      setSelectedImageIndex(0)
      return newAttrs
    })
  }

  // Synchronize URL with selected variant to prevent "update during render" warning
  useEffect(() => {
    if (selectedVariant) {
      if (searchParams.get("variant") !== selectedVariant._id) {
        setSearchParams({ variant: selectedVariant._id }, { replace: true })
      }
    } else if (searchParams.has("variant")) {
      setSearchParams({}, { replace: true })
    }
  }, [selectedVariant, setSearchParams])

  const hasMultipleImages =
    (selectedVariant?.images?.length || productImages.length) > 1

  const handleActionClick = (actionType) => {
    if (!isInStock) {
      toast(InventoryNotification, {
        toastId: "inventory-alert",
        data: { title: displayedTitle },
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeButton: false,
        theme: "dark",
        className: "!bg-[#09090a]/95 !border !border-white/10 !rounded-[1.2rem] !p-0 !shadow-[0_20px_40px_rgba(0,0,0,0.8)] !backdrop-blur-3xl !mr-6 !mt-6 !w-auto !min-w-0 !overflow-hidden",
        progressClassName: "!bg-gradient-to-r !from-amber-400 !to-orange-500 !h-0.5 !bottom-1 !left-6 !right-6",
      })
      return
    }
    
    // Placeholder for actual cart/buy logic
    console.log(`${actionType} clicked for product:`, product._id)
  }

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#09090a] px-4 pt-32 pb-20 text-white sm:px-6 lg:px-10">
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
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-2xl">
                  {displayedImage ? (
                    <>
                      {/* Deep Blur Background to fill aspect ratio */}
                      <img
                        src={displayedImage}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-50 scale-110"
                        aria-hidden="true"
                      />
                      {/* Main Contained Image with Padding */}
                      <div className="relative z-10 flex h-full w-full items-center justify-center p-7">
                        <img
                          src={displayedImage}
                          alt={displayedTitle || "Product image"}
                          className={`max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-[1.05] ${
                            isImageTransitioning
                              ? "opacity-0 blur-sm"
                              : "opacity-100 blur-0"
                          }`}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      No image available
                    </div>
                  )}

                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-3 text-white transition-all hover:bg-black/60 hover:border-amber-300/50 opacity-70 group-hover:opacity-100"
                        aria-label="Show previous image"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-3 text-white transition-all hover:bg-black/60 hover:border-amber-300/50 opacity-70 group-hover:opacity-100"
                        aria-label="Show next image"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="absolute bottom-5 right-5 z-20 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-2xl">
                        {selectedImageIndex + 1} <span className="mx-1.5 opacity-30">/</span> {productImages.length}
                      </div>
                    </>
                  )}
                </div>

                {hasMultipleImages && (
                  <div className="flex gap-3 overflow-x-auto px-2 py-2 scrollbar-hide">
                    {productImages.map((imageUrl, index) => {
                      const isActive = index === selectedImageIndex

                      return (
                        <button
                          type="button"
                          key={`${imageUrl}-${index}`}
                          onClick={() => setImageWithTransition(index)}
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 bg-[#1a1a1c] p-1 ${
                            isActive
                              ? "border-amber-400 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                              : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                          aria-label={`View image ${index + 1}`}
                        >
                          {/* Background blur for thumbnail */}
                          <img
                            src={imageUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover blur-lg opacity-40"
                            aria-hidden="true"
                          />
                          {/* Main contained thumbnail */}
                          <img
                            src={imageUrl}
                            alt={`${product?.title || "Product"} thumbnail ${index + 1}`}
                            className="relative z-10 h-full w-full object-contain"
                          />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-8 rounded-3xl border border-white/10 bg-[#121214]/50 backdrop-blur-xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 border border-amber-400/20">
                      Premium Edition
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsWishlisted((prev) => !prev)}
                        className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                          isWishlisted
                            ? "border-amber-300 bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {isWishlisted ? "★ Saved" : "☆ Save"}
                      </button>

                      <button
                        type="button"
                        onClick={handleShare}
                        className={`relative flex items-center justify-center rounded-full border border-white/10 p-2.5 transition-all duration-500 overflow-hidden ${
                          copied
                            ? "bg-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                            : "bg-white/5 hover:bg-white/10 hover:border-white/30"
                        }`}
                        title="Share"
                      >
                        <div className={`flex items-center gap-2 transition-all duration-300 ${copied ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}>
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                        <div className={`absolute inset-0 flex items-center justify-center font-bold text-[10px] uppercase tracking-tighter text-white transition-all duration-300 ${copied ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                          {copied ? "Copied!" : ""}
                        </div>
                      </button>
                    </div>
                  </div>

                  <h1 className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                    {displayedTitle}
                  </h1>

                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="text-4xl font-black text-amber-400 tracking-tighter">
                      {formatCurrency(displayedPrice)}
                    </span>
                    <span className="text-sm font-medium text-gray-500 line-through decoration-gray-600">
                      {formatCurrency(displayedPrice * 1.5)}
                    </span>
                    <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-green-400 border border-green-500/20">
                      33% Off
                    </span>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">The Story</h3>
                  <p className="text-base leading-relaxed text-gray-400 font-normal">
                    {product?.description || "A masterfully crafted piece designed for those who value both style and substance. Every detail has been considered to ensure ultimate comfort and timeless aesthetic appeal."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Curated By</p>
                    <p className="font-medium text-white">{product?.seller?.fullname || "Wearza Exclusive"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Availability</p>
                    <p className={`font-medium ${displayedStock > 0 ? "text-green-400" : "text-red-400"}`}>
                      {displayedStock > 0 ? `${displayedStock} In Stock` : "Out of Stock"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.keys(availableAttributes).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Personalize</h3>
                      <div className="space-y-5">
                        {Object.entries(availableAttributes).map(([key, values]) => (
                          <div key={key} className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                              Select {key}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {values.map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleAttributeSelect(key, val)}
                                  className={`min-w-14 rounded-xl border-2 px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                                    selectedAttributes[key] === val
                                      ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-105"
                                      : "border-white/5 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Quantity</p>
                      <p className="text-sm text-gray-500 font-medium tracking-tight">Adjust units (Limit 10)</p>
                    </div>

                    <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isInStock) {
                            handleActionClick("adjust_quantity")
                            return
                          }
                          decrementQuantity()
                        }}
                        className={`h-9 w-9 rounded-lg bg-white/5 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95 ${!isInStock ? "opacity-20" : quantity <= 1 ? "opacity-20 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={`min-w-6 text-center text-sm font-bold ${!isInStock ? "text-white/20" : "text-white"}`}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isInStock) {
                            handleActionClick("adjust_quantity")
                            return
                          }
                          incrementQuantity()
                        }}
                        className={`h-9 w-9 rounded-lg bg-white/5 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95 ${!isInStock ? "opacity-20" : quantity >= 10 ? "opacity-20 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleActionClick("add_to_cart")
                      if (isInStock) {
                        handleAddItem({
                          productId: product?._id,
                          variantId: selectedVariant?._id,
                          quantity,
                          title: displayedTitle,
                          image: displayedImage,
                        })
                      }
                    }}
                    className={`w-full rounded-sm border py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] ${
                      isInStock 
                        ? "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40" 
                        : "border-white/5 bg-white/[0.02] text-white/40"
                    }`}
                  >
                    {isInStock ? "Add to Cart" : "Out of Stock"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick("buy_now")}
                    className={`w-full rounded-sm py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] ${
                      isInStock 
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg hover:brightness-105 hover:-translate-y-0.5" 
                        : "bg-white/[0.04] text-white/50 border border-white/5"
                    }`}
                  >
                    {isInStock ? "Buy Now" : "Sold Out"}
                  </button>
                </div>

                <div className="pt-6">
                  <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-4 space-y-2">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-300/80">
                      <span className="text-base">🛡</span> Secure Checkout
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                      Your transaction is encrypted and secured. Guaranteed delivery within 3-5 business days with premium tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
