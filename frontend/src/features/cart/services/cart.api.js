import axios from "axios"

const cartApi = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const getCartItemsApi = async () => {
    const response = await cartApi.get("/", {withCredentials: true})
    return response.data
}

export const addToCartApi = async ({ productId, variantId, quantity }) => {
    const response = await cartApi.post(`/add/${productId}/${variantId}`, { quantity })
    return response.data
}

export const removeFromCartApi = async ({ productId, variantId }) => {
    const response = await cartApi.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export const updateItemInCartApi = async ({ productId, variantId, quantity }) => {
    const response = await cartApi.put(`/update/${productId}/${variantId}`, { quantity })
    return response.data
}