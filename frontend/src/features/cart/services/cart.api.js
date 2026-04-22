import axios from "axios"

const cartApi = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const getCart = async () => {
    const response = await cartApi.get("/")
    return response.data
}

export const addToCart = async ({ productId, variantId, quantity }) => {
    const response = await cartApi.post(`/add/${productId}/${variantId}`, { quantity })
    return response.data
}

export const removeItem = async ({ productId, variantId }) => {
    const response = await cartApi.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export const updateItem = async ({ productId, variantId, quantity }) => {
    const response = await cartApi.put(`/update/${productId}/${variantId}`, { quantity })
    return response.data
}