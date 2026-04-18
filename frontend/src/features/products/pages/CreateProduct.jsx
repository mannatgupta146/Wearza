import React, { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useProduct } from "../hooks/useProduct"

const MAX_IMAGES = 7
const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "JPY"]
const previewRailStyles = `
  @keyframes preview-rail {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  })
  const [images, setImages] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const imagePreviews = useMemo(
    () =>
      images.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    [images],
  )

  useEffect(() => {
    return () => {
      imagePreviews.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [imagePreviews])

  useEffect(() => {
    if (activeImageIndex >= images.length) {
      setActiveImageIndex(Math.max(0, images.length - 1))
    }
  }, [activeImageIndex, images.length])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) return

    const allowedCount = MAX_IMAGES - images.length
    if (allowedCount <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGES} images only`)
      return
    }

    const nextFiles = selectedFiles.slice(0, allowedCount)
    if (selectedFiles.length > allowedCount) {
      toast.info(`Only first ${allowedCount} image(s) were added`)
    }

    setImages((prev) => [...prev, ...nextFiles])
    e.target.value = ""
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setActiveImageIndex((prev) => {
      if (prev === index) {
        return Math.max(0, index - 1)
      }

      if (prev > index) {
        return prev - 1
      }

      return prev
    })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priceAmount: "",
      priceCurrency: "INR",
    })
    setImages([])
    setActiveImageIndex(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!formData.description.trim()) {
      toast.error("Description is required")
      return
    }

    if (!formData.priceAmount || Number(formData.priceAmount) <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    if (!images.length) {
      toast.error("At least 1 image is required")
      return
    }

    try {
      setIsSubmitting(true)

      const payload = new FormData()
      payload.append("title", formData.title.trim())
      payload.append("description", formData.description.trim())
      payload.append("priceAmount", String(formData.priceAmount))
      payload.append("priceCurrency", formData.priceCurrency)
      images.forEach((file) => payload.append("images", file))

      const result = await handleCreateProduct(payload)

      if (result?.success) {
        toast.success("Product created successfully")
        resetForm()
      } else {
        toast.error(result?.message || "Product creation failed")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingImages = MAX_IMAGES - images.length
  const isImageLimitReached = remainingImages === 0
  const featuredPreview =
    imagePreviews[activeImageIndex]?.previewUrl || imagePreviews[0]?.previewUrl

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <style>{previewRailStyles}</style>
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-yellow-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-yellow-300/80">
              Seller Studio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Build a product page that feels premium.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Use the preview panel to keep the listing sharp, then fill the
              form with the details buyers actually need.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-gray-800 bg-[#121212]/90 px-4 py-3 text-sm text-gray-300 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            Up to {MAX_IMAGES} images
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
          <form
            onSubmit={handleSubmit}
            className="order-1 rounded-4xl bg-[#111111]/95 p-5 backdrop-blur sm:p-7 xl:col-span-7"
          >
            <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300/90">
                  Create Listing
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Product details
                </h2>
              </div>

              <div className="rounded-full bg-yellow-400/10 px-4 py-2 text-xs text-yellow-200">
                {images.length
                  ? `${images.length} image${images.length > 1 ? "s" : ""} selected`
                  : "No images selected"}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Linen Summer Shirt"
                  className="w-full rounded-2xl border border-white/8 bg-[#121212] px-4 py-3 text-white outline-none transition-all placeholder:text-gray-500 focus:border-yellow-400"
                />
              </div>

              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Product Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the fit, fabric, key features, and ideal customer..."
                  className="w-full rounded-2xl border border-white/8 bg-[#121212] px-4 py-3 text-white outline-none transition-all placeholder:text-gray-500 focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Price Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-white/8 bg-[#121212] px-4 py-3 text-white outline-none transition-all placeholder:text-gray-500 focus:border-yellow-400"
                  />
                </div>

                <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Currency
                  </label>
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/8 bg-[#121212] px-4 py-3 text-white outline-none transition-all focus:border-yellow-400"
                  >
                    {CURRENCY_OPTIONS.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Product Images
                  </label>
                  <span className="rounded-full border border-gray-700 bg-[#121212] px-3 py-1 text-xs text-gray-300">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>

                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-5 py-10 text-center transition-all ${isImageLimitReached ? "border-white/10 bg-[#121212] text-gray-500" : "border-white/10 bg-[#121212] text-gray-300 hover:border-yellow-400 hover:bg-[#151515] hover:text-yellow-300"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isImageLimitReached}
                  />
                  <span className="text-base font-medium">
                    {isImageLimitReached
                      ? "Image limit reached"
                      : "Click to upload images"}
                  </span>
                  <span className="mt-2 text-xs text-gray-500">
                    Drag and drop is not enabled. JPG, PNG, WEBP accepted.
                  </span>
                </label>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {imagePreviews.map((item, index) => (
                      <div
                        key={`${item.file.name}-${index}`}
                        className="group relative overflow-hidden rounded-2xl bg-black"
                      >
                        <img
                          src={item.previewUrl}
                          alt={`Preview ${index + 1}`}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-2">
                          <p className="truncate text-[11px] text-gray-300">
                            {item.file.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-2 top-2 rounded-full border border-red-400/30 bg-black/80 px-2 py-1 text-[11px] text-red-300 opacity-100 transition-all hover:border-red-300 hover:text-red-200 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-gray-500 sm:max-w-md">
                Review your listing before publishing. A clean cover image and
                concise description usually perform best.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-2xl bg-linear-to-r from-yellow-400 to-orange-500 px-6 py-3 text-base font-semibold text-black transition-all sm:w-auto sm:min-w-55 ${isSubmitting ? "cursor-not-allowed opacity-70" : "hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"}`}
              >
                {isSubmitting ? "Creating Product..." : "Publish Product"}
              </button>
            </div>
          </form>

          <aside className="order-2 xl:sticky xl:top-6 xl:col-span-5 xl:self-start">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[28px] bg-[#121212]/90 backdrop-blur">
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300/90">
                    Live Preview
                  </p>
                </div>

                <div className="p-5">
                  <div className="overflow-hidden rounded-3xl bg-linear-to-br from-[#1d1d1d] via-[#111111] to-[#0a0a0a] p-4">
                    <div className="h-1 bg-linear-to-r from-yellow-400 via-orange-400 to-yellow-300" />

                    <div className="overflow-hidden rounded-2xl bg-black">
                      {featuredPreview ? (
                        <img
                          src={featuredPreview}
                          alt="Featured product preview"
                          className="h-72 w-full object-cover sm:h-96"
                        />
                      ) : (
                        <div className="flex h-72 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),rgba(0,0,0,0.7))] sm:h-96">
                          <div className="text-center">
                            <div className="mx-auto mb-3 h-14 w-14 rounded-2xl border border-yellow-400/30 bg-yellow-400/10" />
                            <p className="text-sm text-gray-300">
                              Your main image will appear here
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Upload a photo to preview the listing cover
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 rounded-2xl bg-[#0f0f0f] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Headline
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        {formData.title || "Product title goes here"}
                      </h2>
                      <p className="mt-3 line-clamp-5 text-sm leading-6 text-gray-400">
                        {formData.description ||
                          "Short description preview for the product. Add fabric, fit, and style details to make this card feel complete."}
                      </p>
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center justify-between rounded-2xl bg-[#161616] px-4 py-3">
                          <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                            Price
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {formData.priceAmount
                              ? `${formData.priceCurrency} ${formData.priceAmount}`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-[#161616] px-4 py-3">
                          <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                            Images
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {images.length}/{MAX_IMAGES}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-[#0f0f0f] p-4 sm:p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          All Images
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Click any image to make it the main preview
                        </p>
                      </div>
                      {imagePreviews.length > 0 ? (
                        <div className="overflow-hidden px-1 py-2 sm:px-2">
                          <div
                            className="flex w-max gap-2 sm:gap-3"
                            style={{
                              animation:
                                imagePreviews.length > 1
                                  ? "preview-rail 16s linear infinite"
                                  : "none",
                            }}
                          >
                            {[...imagePreviews, ...imagePreviews].map(
                              (item, index) => (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveImageIndex(
                                      index % imagePreviews.length,
                                    )
                                  }
                                  key={`${item.file.name}-${index}`}
                                  className={`h-20 w-20 flex-none overflow-hidden rounded-xl bg-black transition-all sm:h-24 sm:w-24 ${activeImageIndex === index % imagePreviews.length ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0f0f0f]" : "opacity-80 hover:opacity-100"}`}
                                  aria-label={`Set image ${index + 1} as main preview`}
                                >
                                  <img
                                    src={item.previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-gray-500">
                          Uploaded images will cycle here
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl bg-[#0f0f0f] p-4 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Ready
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {images.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#0f0f0f] p-4 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Left
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {remainingImages}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#0f0f0f] p-4 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Status
                      </p>
                      <p className="mt-1 text-lg font-semibold text-yellow-300">
                        {isImageLimitReached ? "Full" : "Open"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-[#121212]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300/90">
                  Publishing Notes
                </p>
                <div className="mt-4 space-y-3 text-sm text-gray-400">
                  <p>Lead with a clear title and a clean hero image.</p>
                  <p>
                    Use the description to answer fit, fabric, and occasion
                    questions.
                  </p>
                  <p>
                    Upload multiple angles to make the product feel trustworthy.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CreateProduct
