import React, { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"

const SellerProductDetails = () => {
  const { productId } = useParams()
  const { fetchProductDetails, handleCreateVariant, handleUpdateVariantStock } =
    useProduct()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const [variantForm, setVariantForm] = useState({
    stock: "0",
    priceAmount: "",
    priceCurrency: "INR", // Will be updated when product loads
    attributesText: "",
  })
  const [stockDraft, setStockDraft] = useState({})
  const [selectedVariantFiles, setSelectedVariantFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedBaseImageIndex, setSelectedBaseImageIndex] = useState(0)
  const [attributeDraft, setAttributeDraft] = useState({ key: "", value: "" })

  const currencyOptions = ["INR", "USD", "EUR", "GBP", "JPY"]
  const MAX_VARIANT_IMAGES = 7

  const parseAttributesText = (value) => {
    const result = {}
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    for (const line of lines) {
      const [rawKey, ...rest] = line.split(":")
      const key = rawKey?.trim()
      const itemValue = rest.join(":").trim()
      if (key && itemValue) {
        result[key] = itemValue
      }
    }

    return result
  }

  const appendFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return

    setSelectedVariantFiles((prev) => {
      const next = [...prev]
      let skippedByLimit = 0

      for (const file of incomingFiles) {
        if (!file?.type?.startsWith("image/")) continue
        const isDuplicate = next.some(
          (item) => item.name === file.name && item.size === file.size,
        )
        if (!isDuplicate) {
          if (next.length < MAX_VARIANT_IMAGES) {
            next.push(file)
          } else {
            skippedByLimit += 1
          }
        }
      }

      if (skippedByLimit > 0) {
        setActionMessage(
          `Only up to ${MAX_VARIANT_IMAGES} images are allowed per variant.`,
        )
      }

      return next.slice(0, MAX_VARIANT_IMAGES)
    })
  }

  const removeSelectedFile = (indexToRemove) => {
    setSelectedVariantFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
  }

  const addAttributeLine = () => {
    const nextKey = attributeDraft.key.trim()
    const nextValue = attributeDraft.value.trim()

    if (!nextKey || !nextValue) {
      setActionMessage("Please enter both attribute key and value.")
      return
    }

    const nextLine = `${nextKey}:${nextValue}`
    setVariantForm((prev) => ({
      ...prev,
      attributesText: prev.attributesText.trim()
        ? `${prev.attributesText.trim()}\n${nextLine}`
        : nextLine,
    }))
    setAttributeDraft({ key: "", value: "" })
    setActionMessage("")
  }

  async function fetchProduct() {
    setLoading(true)
    setPageError("")

    const result = await fetchProductDetails(productId)
    if (result.success) {
      setProduct(result.product)
      setSelectedBaseImageIndex(0)
      // Set currency from product data
      setVariantForm((prev) => ({
        ...prev,
        priceCurrency: result.product?.price?.currency || "INR",
      }))
      const nextDraft = {}
      for (const variant of result.product?.variants || []) {
        nextDraft[variant?._id] = String(variant?.stock ?? 0)
      }
      setStockDraft(nextDraft)
    } else {
      setPageError(result.message || "Failed to fetch product details")
    }

    setLoading(false)
  }

  async function onCreateVariant(event) {
    event.preventDefault()
    setActionMessage("")

    const normalizedAttributes = parseAttributesText(variantForm.attributesText)

    if (Object.keys(normalizedAttributes).length === 0) {
      setActionMessage(
        "Please add at least one attribute (for example: size:M).",
      )
      return
    }

    const hasCustomPrice =
      variantForm.priceAmount !== undefined &&
      variantForm.priceAmount !== null &&
      String(variantForm.priceAmount).trim() !== ""

    const priceAmount = Number(variantForm.priceAmount)

    if (hasCustomPrice && (!priceAmount || priceAmount <= 0)) {
      setActionMessage("If provided, variant price must be a positive number.")
      return
    }

    const payload = new FormData()
    payload.append("stock", String(Number(variantForm.stock || 0)))
    if (hasCustomPrice) {
      payload.append("priceAmount", String(priceAmount))
      payload.append("priceCurrency", variantForm.priceCurrency || "INR")
    }
    payload.append("attributes", JSON.stringify(normalizedAttributes))

    for (const file of selectedVariantFiles) {
      payload.append("images", file)
    }

    const result = await handleCreateVariant(productId, payload)

    if (!result.success) {
      setActionMessage(result.message || "Failed to create variant")
      return
    }

    setActionMessage("Variant created successfully.")
    setVariantForm((prev) => ({
      ...prev,
      stock: "0",
      priceAmount: "",
    }))
    setSelectedVariantFiles([])
    await fetchProduct()
  }

  async function onSaveStock(variantId) {
    setActionMessage("")
    const value = Number(stockDraft[variantId])

    if (Number.isNaN(value) || value < 0) {
      setActionMessage("Stock must be a non-negative number.")
      return
    }

    const result = await handleUpdateVariantStock(productId, variantId, value)

    if (!result.success) {
      setActionMessage(result.message || "Failed to update stock")
      return
    }

    setActionMessage("Variant stock updated.")
    await fetchProduct()
  }

  const totalVariantStock = useMemo(() => {
    return (product?.variants || []).reduce(
      (sum, variant) => sum + Number(variant?.stock || 0),
      0,
    )
  }, [product])

  const baseImages = useMemo(() => {
    return (product?.images || []).map((image) => image?.url).filter(Boolean)
  }, [product])

  const selectedVariantPreviews = useMemo(() => {
    return selectedVariantFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }))
  }, [selectedVariantFiles])

  const selectedBaseImage =
    baseImages[selectedBaseImageIndex] || baseImages[0] || null

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

  useEffect(() => {
    fetchProduct()
  }, [productId])

  useEffect(() => {
    return () => {
      selectedVariantPreviews.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [selectedVariantPreviews])

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-yellow-300/80">
              Seller Variant Manager
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Manage Product Variants
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Create variants, review variant pricing, and update stock per
              variant.
            </p>
          </div>

          <Link
            to="/seller/dashboard"
            className="rounded-xl border border-white/15 bg-[#151517] px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:border-yellow-400/60 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 text-sm text-gray-300">
            Loading product details...
          </div>
        )}

        {!loading && pageError && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
            {pageError}
          </div>
        )}

        {!loading && !pageError && product && (
          <div className="space-y-6">
            {/* Product Overview Card */}
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr_150px]">
                {/* Product Image */}
                <div className="flex items-center justify-center">
                  {selectedBaseImage ? (
                    <img
                      src={selectedBaseImage}
                      alt={product?.title}
                      className="h-48 w-48 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-[#171717] text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {product?.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm text-gray-400">
                      {product?.description}
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-[#171717]/50 p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Base Price
                      </p>
                      <p className="mt-2 bg-linear-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-lg font-bold text-transparent">
                        {formatCurrency(
                          product?.price?.amount,
                          product?.price?.currency || "INR",
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#171717]/50 p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Variants
                      </p>
                      <p className="mt-2 text-lg font-bold text-white">
                        {(product?.variants || []).length}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#171717]/50 p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Stock
                      </p>
                      <p className="mt-2 text-lg font-bold text-white">
                        {totalVariantStock}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-[#171717] p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      Total Images
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {baseImages.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#171717] p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      Created
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {formatDate(product?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images Gallery */}
            {baseImages.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Product Images ({baseImages.length})
                </h3>
                <div className="grid grid-cols-6 gap-3 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10">
                  {baseImages.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() => setSelectedBaseImageIndex(index)}
                      className={`relative group rounded-lg overflow-hidden transition-all ${
                        selectedBaseImageIndex === index
                          ? "ring-2 ring-yellow-400 border-yellow-400/60"
                          : "border border-white/10 hover:border-yellow-400/60"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="h-24 w-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content: Form + Variants */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
              {/* Create Variant Form */}
              <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                <h3 className="text-lg font-semibold text-white">
                  Create New Variant
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Add a new variant with pricing and attributes
                </p>

                <form onSubmit={onCreateVariant} className="mt-6 space-y-4">
                  {/* Stock */}
                  <label className="block">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                      Initial Stock
                    </p>
                    <input
                      type="number"
                      min="0"
                      value={variantForm.stock}
                      onChange={(event) =>
                        setVariantForm((prev) => ({
                          ...prev,
                          stock: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f10] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/60"
                    />
                  </label>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                      Price (optional)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Amount"
                        value={variantForm.priceAmount}
                        onChange={(event) =>
                          setVariantForm((prev) => ({
                            ...prev,
                            priceAmount: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-white/10 bg-[#0f0f10] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/60"
                      />
                      <div
                        className="rounded-lg border border-white/10 bg-[#0a0a0b] px-3 py-2.5 text-sm text-gray-400 flex items-center group relative cursor-not-allowed"
                        title="Currency cannot be changed"
                      >
                        <span>🔒</span>
                        <span className="ml-2">
                          {variantForm.priceCurrency}
                        </span>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Cannot be changed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <label className="block">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                      Attributes (required)
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <input
                        type="text"
                        placeholder="Key (e.g. size)"
                        value={attributeDraft.key}
                        onChange={(event) =>
                          setAttributeDraft((prev) => ({
                            ...prev,
                            key: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-white/10 bg-[#0f0f10] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/60"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. M)"
                        value={attributeDraft.value}
                        onChange={(event) =>
                          setAttributeDraft((prev) => ({
                            ...prev,
                            value: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-white/10 bg-[#0f0f10] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/60"
                      />
                      <button
                        type="button"
                        onClick={addAttributeLine}
                        className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-2.5 text-sm font-semibold text-yellow-300 transition-all hover:bg-yellow-400/20"
                        title="Add attribute"
                      >
                        +
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={variantForm.attributesText}
                      onChange={(event) =>
                        setVariantForm((prev) => ({
                          ...prev,
                          attributesText: event.target.value,
                        }))
                      }
                      className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-[#0f0f10] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/60"
                      placeholder="size:M&#10;color:Black"
                    />
                  </label>

                  {/* Image Upload */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                      Images ({selectedVariantFiles.length}/{MAX_VARIANT_IMAGES}
                      )
                    </p>
                    <label
                      onDragOver={(event) => {
                        event.preventDefault()
                        setIsDragOver(true)
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(event) => {
                        event.preventDefault()
                        setIsDragOver(false)
                        appendFiles(Array.from(event.dataTransfer.files || []))
                      }}
                      className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-all ${
                        isDragOver
                          ? "border-yellow-400/80 bg-yellow-500/10"
                          : "border-white/20 bg-[#0f0f10] hover:border-white/40"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-200">
                        Drop images here
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) =>
                          appendFiles(Array.from(event.target.files || []))
                        }
                        className="hidden"
                      />
                    </label>

                    {selectedVariantFiles.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {selectedVariantPreviews.map((item, index) => (
                            <div
                              key={item.id}
                              className="group relative overflow-hidden rounded-2xl bg-black"
                            >
                              <img
                                src={item.url}
                                alt={`img ${index + 1}`}
                                className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-2">
                                <p className="truncate text-[11px] text-gray-300">
                                  {item.name}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(index)}
                                className="absolute right-2 top-2 rounded-full border border-red-400/30 bg-black/80 px-2 py-1 text-[11px] text-red-300 opacity-100 transition-all hover:border-red-300 hover:text-red-200 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-linear-to-r from-yellow-400 to-orange-500 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110"
                  >
                    Create Variant
                  </button>
                </form>
              </div>

              {/* Variants List */}
              <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                <h3 className="text-lg font-semibold text-white">
                  Product Variants
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {(product?.variants || []).length} variants
                </p>

                <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                  {(product?.variants || []).length === 0 && (
                    <div className="rounded-lg border border-white/10 bg-[#0f0f10] px-4 py-6 text-center">
                      <p className="text-sm text-gray-400">No variants yet</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Create one using the form
                      </p>
                    </div>
                  )}

                  {(product?.variants || []).map((variant, index) => (
                    <div
                      key={variant?._id || index}
                      className="rounded-lg border border-white/10 bg-[#0f0f10] p-3 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase">
                            Variant {index + 1}
                          </p>
                          <p className="mt-1 bg-linear-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-sm font-bold text-transparent">
                            {formatCurrency(
                              variant?.price?.amount,
                              variant?.price?.currency || "INR",
                            )}
                          </p>
                        </div>
                        {variant?.images?.[0]?.url && (
                          <img
                            src={variant.images[0].url}
                            alt="variant"
                            className="h-12 w-12 rounded object-cover shrink-0"
                          />
                        )}
                      </div>

                      {Object.entries(variant?.attributes || {}).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(variant.attributes).map(
                            ([key, value]) => (
                              <span
                                key={`${variant?._id}-${key}`}
                                className="text-[10px] rounded-full bg-white/10 px-2 py-0.5 text-gray-300"
                              >
                                {key}: {value}
                              </span>
                            ),
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={
                            stockDraft[variant?._id] ??
                            String(variant?.stock ?? 0)
                          }
                          onChange={(event) =>
                            setStockDraft((prev) => ({
                              ...prev,
                              [variant?._id]: event.target.value,
                            }))
                          }
                          className="w-16 rounded border border-white/10 bg-[#000000] px-2 py-1 text-xs text-white outline-none focus:border-yellow-400/60"
                        />
                        <button
                          type="button"
                          onClick={() => onSaveStock(variant?._id)}
                          className="flex-1 rounded border border-white/15 bg-[#171717] px-2 py-1 text-xs font-semibold text-gray-300 hover:border-yellow-400/60 hover:text-yellow-400 transition-all"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {actionMessage && (
              <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                {actionMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerProductDetails
