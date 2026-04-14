import {Router} from "express"
import { authenticateSeller } from "../middleware/auth.midleware"

const productRouter = Router()

productRouter.post('', authenticateSeller,)

export default productRouter