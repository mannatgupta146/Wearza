import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    ]
}, { timestamps: true });

const favoriteModel = mongoose.model("favorites", favoriteSchema);

export default favoriteModel;
