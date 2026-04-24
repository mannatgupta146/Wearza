import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: false
    },
    currency: {
        type: String,
        enum: ["INR", "USD", "EUR", "GBP", "JPY"],
        default: "INR"
    }
},{
    _id: false,
    versionKey: false
})

export default priceSchema