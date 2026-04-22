import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
    try {
        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!product) return 0

        const variant = product.variants.find(variant => variant._id.toString() === variantId)
        return variant ? variant.stock : 0

    } catch (error) {
        console.log(error)
        return null
    }
}