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
        const response = await addToCartApi({ productId, variantId, quantity })
        dispatch(addItem(response.item))
    }

    const handleRemoveItem = async ({ productId, variantId }) => {
        const response = await removeFromCartApi({ productId, variantId })
        dispatch(removeItem(response.item))
    }

    const handleUpdateItem = async ({ productId, variantId, quantity }) => {
        const response = await updateItemInCartApi({ productId, variantId, quantity })
        dispatch(updateItem(response.item))
    }

    return {
        cart,
        handleGetCart,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem
    }
}