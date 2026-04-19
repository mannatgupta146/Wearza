import {
  setError,
  setLoading,
  setProducts,
  setSellerProducts,
} from "../state/product.slice"
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
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
    }
      catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch product details"
        dispatch(setError(message))
        return { success: false, message }
      } 
      finally {
        dispatch(setLoading(false))
      }
  }

  return { handleCreateProduct, fetchSellerProducts, fetchAllProducts, fetchProductDetails }
}
