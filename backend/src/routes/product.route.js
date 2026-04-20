import { Router } from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import multer from "multer"
import {
  createProduct,
  getAllProducts,
  getSellerProducts,
  getProductDetails,
  createProductVariant,
  updateVariantStock,
} from "../controllers/product.controller.js"
import {
  validateCreateProduct,
  validateCreateVariant,
  validateUpdateVariantStock,
} from "../validators/product.validator.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
})

const productRouter = Router()

/**
 * @route POST /api/products/
 * @desc Create a new product
 * @access Private (Seller only)
 */

productRouter.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  validateCreateProduct,
  createProduct,
)

/**
 * @route GET /api/products/seller
 * @desc Get all products of the authenticated seller
 * @access Private (Seller only)
 */

productRouter.get("/seller", authenticateSeller, getSellerProducts)

/**
 * @route GET /api/products/
 * @desc Get all products (with optional filters)
 * @access Public
 */

productRouter.get("/", getAllProducts)

/**
 * @route GET /api/products/details/:productId
 * @desc Get details of a specific product
 * @access Public
 */

productRouter.get("/details/:productId", getProductDetails)

/**
 * @route POST /api/products/:productId/variants
 * @desc Create a variant for a seller-owned product
 * @access Private (Seller only)
 */

productRouter.post(
  "/:productId/variants",
  authenticateSeller,
  upload.array("images", 7),
  validateCreateVariant,
  createProductVariant,
)

/**
 * @route PATCH /api/products/:productId/variants/:variantId/stock
 * @desc Update stock of a specific variant for a seller-owned product
 * @access Private (Seller only)
 */

productRouter.patch(
  "/:productId/variants/:variantId/stock",
  authenticateSeller,
  validateUpdateVariantStock,
  updateVariantStock,
)

export default productRouter
