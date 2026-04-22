import { useDispatch, useSelector } from "react-redux"
import {addItem, removeItem, updateItem, setCart} from "../state/cart.slice.js"
import { getCartItemsApi, addToCartApi, removeFromCartApi, updateItemInCartApi } from "../services/cart.api.js"
import { toast } from "react-toastify"

export const useCart = () => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.items)

    const handleGetCart = async () => {
        const response = await getCartItemsApi()
        dispatch(setCart(response.cart.items))
    }

    const handleAddItem = async ({ productId, variantId, quantity }) => {
        try {
            const response = await addToCartApi({ productId, variantId, quantity })
            if (response.success) {
                toast.success("Item added to bag", {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    theme: "dark",
                })
                await handleGetCart()
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to add item"
            toast.error(message, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "dark",
            })
        }
    }

    const handleRemoveItem = async ({ productId, variantId }) => {
        try {
            const response = await removeFromCartApi({ productId, variantId })
            if (response.success) {
                toast.info("Item removed from bag", {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    theme: "dark",
                })
                await handleGetCart()
            }
        } catch (error) {
            toast.error("Failed to remove item", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
            })
        }
    }

    const handleUpdateItem = async ({ productId, variantId, quantity }) => {
        try {
            const response = await updateItemInCartApi({ productId, variantId, quantity })
            if (response.success) {
                await handleGetCart()
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update quantity"
            toast.error(message, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
            })
        }
    }

    return {
        cart,
        handleGetCart,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem
    }
}