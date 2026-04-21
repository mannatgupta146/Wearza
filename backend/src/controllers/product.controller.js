import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body
  const seller = req.user

  if (!seller || !seller._id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: seller information is missing",
    })
  }

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile(file.buffer, file.originalname)
    }),
  )

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    images: images.map((image) => ({ url: image.url })),
    seller: seller._id,
  })

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  })
}

export async function getSellerProducts(req, res) {
  const seller = req.user

  const products = await productModel.find({ seller: seller._id })

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    products,
  })
}

export async function getAllProducts(req, res) {
  const products = await productModel.find().populate("seller", "fullname")

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    products,
  })
}

export async function getProductDetails(req, res) {
  const { productId } = req.params

  const product = await productModel
    .findById(productId)
    .populate("seller", "fullname")

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }

  res.status(200).json({
    success: true,
    message: "Product details retrieved successfully",
    product,
  })
}

export async function createProductVariant(req, res) {
  const { productId } = req.params
  const {
    priceAmount,
    priceCurrency,
    stock = 0,
    attributes = {},
    images = [],
  } = req.body

  const product = await productModel.findById(productId)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }

  if (String(product.seller) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to manage variants for this product",
    })
  }

  let normalizedAttributes = {}

  if (typeof attributes === "string") {
    try {
      const parsedAttributes = JSON.parse(attributes)
      if (
        parsedAttributes &&
        typeof parsedAttributes === "object" &&
        !Array.isArray(parsedAttributes)
      ) {
        normalizedAttributes = parsedAttributes
      }
    } catch {
      normalizedAttributes = {}
    }
  } else if (
    attributes &&
    typeof attributes === "object" &&
    !Array.isArray(attributes)
  ) {
    normalizedAttributes = attributes
  }

  if (Object.keys(normalizedAttributes).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one attribute is required",
    })
  }

  let normalizedImages = []

  if (Array.isArray(req.files) && req.files.length > 0) {
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile(file.buffer, file.originalname)
      }),
    )

    normalizedImages = uploadedImages.map((image) => ({ url: image.url }))
  } else {
    normalizedImages = Array.isArray(images)
      ? images.filter(Boolean).map((url) => ({ url }))
      : []
  }

  const normalizedPriceAmount =
    priceAmount === undefined || priceAmount === null || priceAmount === ""
      ? Number(product?.price?.amount || 0)
      : Number(priceAmount)

  const normalizedPriceCurrency =
    priceCurrency || product?.price?.currency || "INR"

  const variant = {
    stock: Number(stock) || 0,
    attributes: normalizedAttributes,
    images: normalizedImages,
    price: {
      amount: normalizedPriceAmount,
      currency: normalizedPriceCurrency,
    },
  }

  product.variants.push(variant)
  await product.save()

  const createdVariant = product.variants[product.variants.length - 1]

  res.status(201).json({
    success: true,
    message: "Variant created successfully",
    variant: createdVariant,
    product,
  })
}

export async function updateVariantStock(req, res) {
  const { productId, variantId } = req.params
  const { stock } = req.body

  const product = await productModel.findById(productId)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }

  if (String(product.seller) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to manage variants for this product",
    })
  }

  const variant = product.variants.id(variantId)

  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    })
  }

  variant.stock = Number(stock)
  await product.save()

  res.status(200).json({
    success: true,
    message: "Variant stock updated successfully",
    variant,
    product,
  })
}
