import favoriteModel from "../models/favorite.model.js";
import productModel from "../models/product.model.js";

export const toggleFavoriteController = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        let favorite = await favoriteModel.findOne({ user: userId });

        if (!favorite) {
            favorite = await favoriteModel.create({ user: userId, products: [productId] });
            return res.status(200).json({
                success: true,
                message: "Added to Favorites",
                isFavorite: true
            });
        }

        const productIndex = favorite.products.indexOf(productId);

        if (productIndex === -1) {
            favorite.products.push(productId);
            await favorite.save();
            return res.status(200).json({
                success: true,
                message: "Added to Favorites",
                isFavorite: true
            });
        } else {
            favorite.products.splice(productIndex, 1);
            await favorite.save();
            return res.status(200).json({
                success: true,
                message: "Removed from Favorites",
                isFavorite: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to toggle favorite"
        });
    }
};

export const getFavoritesController = async (req, res) => {
    try {
        const userId = req.user._id;

        const favorite = await favoriteModel.findOne({ user: userId }).populate({
            path: "products",
            populate: {
                path: "seller",
                select: "name email"
            }
        });

        return res.status(200).json({
            success: true,
            favorites: favorite ? favorite.products : []
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch favorites"
        });
    }
};
