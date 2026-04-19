import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            required: true,
            enum: ["USD", "EUR", "INR", "GBP", "JPY"],
            default: "INR", 
        },
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    images: [
        {
            url: {
                type: String,
                required: true,
            },
        },
    ],

    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true,
                    }
                }
            ],

            stock: {
                type: Number,
                default: 0,
            },

            attributes: {
                type: Map,
                of: String,
            },

            price: {
                amount: {
                    type: Number,
                    required: true,
                },
                currency: {
                    type: String,
                    required: true,
                    enum: ["USD", "EUR", "INR", "GBP", "JPY"],
                    default: "INR",
                }
            },

            
        }
    ]
}, { timestamps: true })

const productModel = mongoose.model("products", productSchema)

export default productModel
