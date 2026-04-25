import mongoose from "mongoose";
import priceSchema from "./price.schema.js"

const paymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
    },

    price: {
        type: priceSchema,
        required: true
    },

    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    orderItems: [
        {
            title: String,
            description: String,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "variants"
            },
            images: [{ url: String }],
            quantity: Number,
            price: priceSchema
        }
    ],

    paymentDate: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const paymentModel = mongoose.model("payments", paymentSchema)

export default paymentModel
