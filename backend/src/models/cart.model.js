import mongoose from "mongoose"
import priceSchema from "./price.schema.js"

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "variants",
                required: true
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
})

const cartModel = mongoose.model("cart", cartSchema)

export default cartModel
