import { useDispatch, useSelector } from "react-redux"
import {addItem, removeItem, updateItem, setCart} from "../state/cart.slice.js"
import { getCart, addToCart as addToCartApi, removeItem as removeItemApi, updateItem as updateItemApi } from "../services/cart.api.js"

export const useCart = () => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.items)

    const getCart = async () => {
        const response = await getCart()
        dispatch(setCart(response.cart))
    }

    const handleAddItem = async ({ productId, variantId, quantity }) => {
        const response = await addToCartApi({ productId, variantId, quantity })
        dispatch(addItem(response.item))
    }

    const handleRemoveItem = async ({ productId, variantId }) => {
        const response = await removeItemApi({ productId, variantId })
        dispatch(removeItem(response.item))
    }

    const handleUpdateItem = async ({ productId, variantId, quantity }) => {
        const response = await updateItemApi({ productId, variantId, quantity })
        dispatch(updateItem(response.item))
    }

    return {
        cart,
        getCart,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem
    }
}