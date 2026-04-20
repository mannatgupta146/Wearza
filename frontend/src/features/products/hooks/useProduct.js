import {
  setError,
  setLoading,
  setProducts,
  setSellerProducts,
} from "../state/product.slice"
import {
  createProduct,
  createProductVariant,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  updateProductVariantStock,
} from "../services/product.api.js"
import { useDispatch } from "react-redux"

export const useProduct = () => {
  const dispatch = useDispatch()

  async function handleCreateProduct(productData) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await createProduct(productData)
      return { success: true, product: data.product }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Product creation failed"
      dispatch(setError(message))
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function fetchSellerProducts() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await getSellerProducts()
      dispatch(setSellerProducts(data.products))
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch products"
      dispatch(setError(message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function fetchAllProducts() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await getAllProducts()
      dispatch(setProducts(data.products))
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch products"
      dispatch(setError(message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function fetchProductDetails(productId) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await getProductDetails(productId)
      return { success: true, product: data.product }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch product details"
      dispatch(setError(message))
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleCreateVariant(productId, payload) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await createProductVariant(productId, payload)
      return { success: true, variant: data.variant, product: data.product }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create product variant"
      dispatch(setError(message))
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleUpdateVariantStock(productId, variantId, stock) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await updateProductVariantStock(productId, variantId, stock)
      return { success: true, variant: data.variant, product: data.product }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update variant stock"
      dispatch(setError(message))
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  return {
    handleCreateProduct,
    fetchSellerProducts,
    fetchAllProducts,
    fetchProductDetails,
    handleCreateVariant,
    handleUpdateVariantStock,
  }
}
