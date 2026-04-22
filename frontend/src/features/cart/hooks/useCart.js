import { useDispatch, useSelector } from "react-redux"
import {addItem, removeItem, updateItem, setCart} from "../state/cart.slice.js"
import { getCartItemsApi, addToCartApi, removeFromCartApi, updateItemInCartApi } from "../services/cart.api.js"

export const useCart = () => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.items)

    const handleGetCart = async () => {
        const response = await getCartItemsApi()
        dispatch(setCart(response.cart.items))
    }

    const handleAddItem = async ({ productId, variantId, quantity }) => {
        await addToCartApi({ productId, variantId, quantity })
        await handleGetCart()
    }

    const handleRemoveItem = async ({ productId, variantId }) => {
        await removeFromCartApi({ productId, variantId })
        await handleGetCart()
    }

    const handleUpdateItem = async ({ productId, variantId, quantity }) => {
        await updateItemInCartApi({ productId, variantId, quantity })
        await handleGetCart()
    }

    return {
        cart,
        handleGetCart,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem
    }
}