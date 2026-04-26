import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import { stockOfVariant } from "../dao/product.dao.js"
import { createOrder } from "../services/payment.service.js"
import { getCartDetails } from "../dao/cart.dao.js"
import paymentModel from "../models/payment.model.js"
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js"
import { config } from "../config/config.js"

export const addToCartController = async (req, res) => {
    try {
        const { productId, variantId } = req.params
        const { quantity = 1 } = req.body
        const userId = req.user.id

        // Use findOne instead of invalid findById with object
        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product or variant not found" 
            })
        }

        const stock = await stockOfVariant(productId, variantId)
        const variant = product.variants.find(v => v._id.toString() === variantId)
        const price = variant?.price

        if (!price) {
            return res.status(400).json({
                success: false,
                message: "Price information for this variant is missing"
            })
        }

        let cart = await cartModel.findOne({ user: userId })

        if (!cart) {
            if (quantity > stock) {
                return res.status(400).json({ 
                    success: false,
                    message: `Only ${stock} left in stock` 
                })
            }

            cart = new cartModel({
                user: userId,
                items: [{
                    product: productId,
                    variant: variantId,
                    quantity: Number(quantity),
                    price: price
                }]
            })
            await cart.save()
            return res.status(201).json({ success: true, message: "Item added to cart" })
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variant.toString() === variantId
        )

        if (existingItemIndex !== -1) {
            const currentQty = cart.items[existingItemIndex].quantity
            const newTotalQty = currentQty + Number(quantity)
            
            // Check against both stock and the global limit of 10
            if (newTotalQty > 10) {
                return res.status(400).json({ 
                    success: false,
                    message: `Maximum 10 units allowed per item. You already have ${currentQty} in cart.` 
                })
            }

            if (newTotalQty > stock) {
                return res.status(400).json({ 
                    success: false,
                    message: `Only ${stock - currentQty} more left in stock. You already have ${currentQty} in cart.` 
                })
            }
            cart.items[existingItemIndex].quantity = newTotalQty
            // Optionally update the price to the latest one
            cart.items[existingItemIndex].price = price
        } else {
            if (Number(quantity) > stock) {
                return res.status(400).json({ 
                    success: false,
                    message: `Only ${stock} left in stock` 
                })
            }
            cart.items.push({
                product: productId,
                variant: variantId,
                quantity: Number(quantity),
                price: price
            })
        }

        await cart.save()
        return res.status(200).json({ 
            success: true, 
            message: "Cart updated successfully" 
        })

    } catch (error) {
        console.error("Add to Cart Error:", error)
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        })
    }
}

export const getCartController = async (req, res) => {
    const user = req.user

    try {
        let cart = await getCartDetails(user._id)

        if (!cart) {
            cart = await cartModel.create({ user: user._id, items: [] })
        }

        if (cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                cart: {
                    ...cart.toObject(),
                    totalPrice: 0,
                    currency: null
                }
            })
        }

        const finalCart = await getCartDetails(user._id) || { ...cart.toObject(), totalPrice: 0 }

        return res.status(200).json({ 
            success: true,
            message: "Cart fetched successfully",
            cart: finalCart 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch cart"
        })
    }
}

export const removeFromCartController = async (req, res) => {
    try {
        const { productId, variantId } = req.params
        const userId = req.user.id

        const cart = await cartModel.findOne({ user: userId })
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

        cart.items = cart.items.filter(
            item => !(item.product.toString() === productId && item.variant.toString() === variantId)
        )

        await cart.save()
        return res.status(200).json({ success: true, message: "Item removed from cart" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const updateCartController = async (req, res) => {
    try {
        const { productId, variantId } = req.params
        const { quantity } = req.body
        const userId = req.user.id

        const stock = await stockOfVariant(productId, variantId)
        if (quantity > stock) {
            return res.status(400).json({ success: false, message: `Only ${stock} left in stock` })
        }

        const cart = await cartModel.findOne({ user: userId })
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variant.toString() === variantId
        )

        if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found in cart" })

        cart.items[itemIndex].quantity = quantity
        await cart.save()

        return res.status(200).json({ success: true, message: "Cart updated successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const createOrderController = async (req, res) => {
    try {

        const cart = await getCartDetails(req.user._id)

        if(!cart) return res.status(404).json({ 
            success: false, 
            message: "Cart not found" 
        })

        if(cart.items.length === 0) return res.status(400).json({
            success: false, 
            message: "Cart is empty" 
        })

        const order = await createOrder({amount: cart.totalPrice, currency: cart.currency})

        const payment = await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id,
            },
            price: {
                amount: cart.totalPrice,
                currency: cart.currency,
            },
            orderItems: cart.items.map(item => ({
                title: item.product.title,
                description: item.product.description,
                productId: item.product._id,
                variantId: item.variant,
                images: item.product.variants.images || item.product.images,
                quantity: item.quantity,
                price: {
                    amount: item.product.variants.price.amount || item.product.price.amount,
                    currency: item.product.variants.price.currency || item.product.price.currency
                }
            }))
        })

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create order"
        })
    }
}

export const verifyOrderController = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const userId = req.user._id

        const payment = await paymentModel.findOne({ 
            "razorpay.orderId": razorpay_order_id,
            status: "PENDING",
            user: userId 
        })

        if (!payment) return res.status(404).json({ 
            success: false, 
            message: "Payment not found" 
        })

        const isPaymentValid = validatePaymentVerification({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
        }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

        if(!isPaymentValid) {
            payment.status = "FAILED"
            await payment.save()
            
            return res.status(400).json({ 
                success: false, 
                message: "Invalid payment" 
            })
        }

        payment.razorpay.paymentId = razorpay_payment_id
        payment.razorpay.signature = razorpay_signature
        payment.status = "SUCCESS"

        await payment.save()

        return res.status(200).json({ 
            success: true, 
            message: "Payment verified successfully" 
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}