import {Router} from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import multer from "multer"
import { createProduct, getSellerProducts } from "../controllers/product.controller.js"
import { validateCreateProduct } from "../validators/product.validator.js"

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

productRouter.post('/', authenticateSeller, validateCreateProduct, upload.array('images', 7), createProduct)

/**
 * @route GET /api/products/seller
 * @desc Get all products of the authenticated seller
 * @access Private (Seller only)
 */

productRouter.get('/seller', authenticateSeller, getSellerProducts)

export default productRouter