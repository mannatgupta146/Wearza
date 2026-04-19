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

  const product = await productModel.findById(productId).populate("seller", "fullname")

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