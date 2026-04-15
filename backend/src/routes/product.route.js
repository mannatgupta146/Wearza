import {Router} from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import multer from "multer"
import { createProduct } from "../controllers/product.controller.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
})

const productRouter = Router()

productRouter.post('', authenticateSeller, upload.array('images', 7), createProduct)

export default productRouter