import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart, validateUpdateCart } from "../validators/cart.validator.js"
import { addToCartController, createOrderController, getCartController, getOrderHistoryController, removeFromCartController, updateCartController, verifyOrderController } from "../controllers/cart.controller.js"

const cartRouter = Router()

/**
 * @route GET /cart
 * @desc Get user's cart
 * @access Private
 */

cartRouter.get('/', authenticateUser, getCartController)

/**
 * @route GET /cart/orders
 * @desc Get user's order history
 * @access Private
 */
cartRouter.get('/orders', authenticateUser, getOrderHistoryController)

/**
 * @route POST /cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 */

cartRouter.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCartController)

/**
 * @route DELETE /cart/remove/:productId/:variantId
 * @desc Remove item from cart
 * @access Private
 */
cartRouter.delete('/remove/:productId/:variantId', authenticateUser, removeFromCartController)

/**
 * @route PUT /cart/update/:productId/:variantId
 * @desc Update item quantity in cart
 * @access Private
 */

cartRouter.put('/update/:productId/:variantId', authenticateUser, validateUpdateCart, updateCartController)

/**
 * @route POST /cart/payment/create/order
 * @desc Create order for payment
 * @access Private
 */

cartRouter.post('/payment/create/order', authenticateUser, createOrderController)

/**
 * @route POST /cart/payment/verify/order
 * @desc Verify order for payment
 * @access Private
 */

cartRouter.post('/payment/verify/order', authenticateUser, verifyOrderController)

export default cartRouter