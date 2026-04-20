import axios from "axios"

const productApi = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
})

export async function createProduct(productData) {
  try {
    const response = await productApi.post("/", productData)
    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function getSellerProducts() {
  try {
    const response = await productApi.get("/seller")
    return response.data
  } catch (error) {
    console.error("Error fetching seller products:", error)
    throw error
  }
}

export async function getAllProducts() {
  try {
    const response = await productApi.get("/")
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function getProductDetails(productId) {
  try {
    const response = await productApi.get(`/details/${productId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching product details:", error)
    throw error
  }
}

export async function createProductVariant(productId, payload) {
  try {
    const response = await productApi.post(`/${productId}/variants`, payload)
    return response.data
  } catch (error) {
    console.error("Error creating product variant:", error)
    throw error
  }
}

export async function updateProductVariantStock(productId, variantId, stock) {
  try {
    const response = await productApi.patch(
      `/${productId}/variants/${variantId}/stock`,
      { stock },
    )
    return response.data
  } catch (error) {
    console.error("Error updating variant stock:", error)
    throw error
  }
}
