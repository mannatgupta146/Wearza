import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
    try {
        const product = await productModel.findById({
            _id: productId,
            "variants._id": variantId
        })

        const stock = product.variants.find(variant=> variant._id.toString() === variantId).stock
        return stock

    } catch (error) {
        console.log(error)
        return null
    }
}