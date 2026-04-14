import {Router} from "express"
import { authenticateSeller } from "../middleware/auth.midleware"
import multer from "multer"

const multer = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
})

const productRouter = Router()

productRouter.post('', authenticateSeller, upload.array['images', 7])

export default productRouter