import { useDispatch, useSelector } from "react-redux"
import {addItem, removeItem, updateItem, setCart} from "../state/cart.slice.js"
import { getCartItemsApi, addToCartApi, removeFromCartApi, updateItemInCartApi, createCartOrderApi, verifyCartOrderApi } from "../services/cart.api.js"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import CartNotification from "../components/CartNotification.jsx"
import AlertNotification from "../../Shared/components/AlertNotification.jsx"

export const useCart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart.items)

    const handleGetCart = async () => {
        const response = await getCartItemsApi()
        if (response.success && response.cart) {
            dispatch(setCart(response.cart))
        }
    }

    const handleAddItem = async ({ productId, variantId, quantity, title, image }) => {
        try {
            const response = await addToCartApi({ productId, variantId, quantity })
            if (response.success) {
                toast(CartNotification, {
                    toastId: "cart-success",
                    data: { title, image, quantity, navigate },
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeButton: false,
                    theme: "dark",
                    className: "!bg-[#09090a]/95 !border !border-white/10 !rounded-[1.2rem] !p-0 !shadow-[0_20px_40px_rgba(0,0,0,0.8)] !backdrop-blur-3xl !mr-6 !mt-6 !w-auto !min-w-0 !overflow-hidden",
                    progressClassName: "!bg-gradient-to-r !from-amber-400 !to-orange-500 !h-0.5 !bottom-1 !left-6 !right-6",
                })
                await handleGetCart()
            }
        } catch (error) {
            let message = error.response?.data?.message || "Failed to add item"
            
            // Refine specific quantity limit message for cleaner UX
            if (message.includes("Maximum 10 units") || message.includes("already have")) {
                message = "Maximum 10 units allowed per item"
            }

            toast(AlertNotification, {
                toastId: "cart-error",
                data: { message, type: "error" },
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeButton: false,
                className: "!bg-[#09090a]/95 !border !border-rose-500/20 !rounded-[1.2rem] !p-0 !shadow-[0_20px_40px_rgba(0,0,0,0.8)] !backdrop-blur-3xl !mb-6 !mr-6 !w-auto !min-w-0 !overflow-hidden",
                progressClassName: "!bg-rose-500 !h-0.5 !bottom-1 !left-6 !right-6",
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

    const handleCreateCartOrder = async () => {
        try {
            const data = await createCartOrderApi()
            return data.order

        } catch (error) {
            const message = error.response?.data?.message || "Failed to create order"
            toast.error(message, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
            })
        }
    }

    const handleVerifyCartOrder = async ({razorpay_payment_id, razorpay_order_id, razorpay_signature}) => {
        try {
            const data = await verifyCartOrderApi({
                razorpay_payment_id, 
                razorpay_order_id, 
                razorpay_signature
            })

            return data
        } catch (error) {
            const message = error.response?.data?.message || "Failed to verify order"
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
        handleUpdateItem,
        handleCreateCartOrder,
        handleVerifyCartOrder
    }
}
