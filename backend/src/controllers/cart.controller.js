import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import { stockOfVariant } from "../dao/product.dao.js"

export const addToCartController = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.params
        const userId = req.user.id

        const product = await productModel.findById({
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

        const cart = await cartModel.findOne({ user: userId })

        if (!cart) {
            const newCart = new cartModel({
                user: userId,
                items: [
                    {
                        product: productId,
                        variant: variantId,
                        quantity: quantity
                    }
                ]
            })

            await newCart.save()
            return res.status(201).json({ message: "Item added to cart" })
        }

        const existingItem = cart.items.find(item => item.variant.toString() === variantId)
        if (existingItem) {
            existingItem.quantity += quantity
            await cart.save()
            return res.status(200).json({ message: "Item quantity updated in cart" })
        }

        cart.items.push({
            product: productId,
            variant: variantId,
            quantity: quantity
        })

        const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId)

        if (isProductAlreadyInCart) {
            const quantityInCart = cart.items.find(item=> item.product.toString() === productId && item.variant.toString() === variantId).quantity
            if (quantityInCart + quantity > stock) {
                return res.status(400).json({ 
                    success: false,
                    message: `Only ${stock - quantityInCart} left in stock and you already have ${quantityInCart} in cart` 
                })
            }

            await cartModel.findOneAndUpdate(
                {user: userId, "items.product": productId, "items.variant": variantId},
                { $inc: { "items.$.quantity": quantity } },
                {new: true}
            )

            return res.status(201).json({ 
                success: true,
                message: "Cart updated successfully" 
            })
        }

        if ( quantity > stock) {
            return res.status(400).json({ 
                success: false,
                message: `Only ${stock} left in stock` 
            })
        }

        cart.items.push({
            product: productId,
            variant: variantId,
            quantity: quantity
        })

        await cart.save()
        return res.status(201).json({ message: "Item added to cart successfully" })
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        })
    }
}

export const getCartController = async (req, res) => {
    const user = req.user

    let cart = await cartModel.findOne({ user: user._id }).populate("items.product")

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({ 
        success: true,
        message: "Cart fetched successfully",
        cart 
    })
}