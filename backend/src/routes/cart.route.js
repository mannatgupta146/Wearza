import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validators/cart.validator.js"
import { addToCartController } from "../controllers/cart.controller.js"

const cartRouter = Router()

/**
 * @route POST /cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add to cart
 * @argument variantId - ID of the variant to add to cart
 * @argument quantity - Quantity of the variant to add to cart
 */

cartRouter.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCartController)

/**
 * @route POST api/cart/add/productId, variantId, quantity
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add to cart
 * @argument variantId - ID of the variant to add to cart
 * @argument quantity - Quantity of the variant to add to cart
 */

cartRouter.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCartController)

export default cartRouter