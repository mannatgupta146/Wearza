import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useParams } from 'react-router-dom'

const SellerProductDetails = () => {
  const { productId } = useParams()
  const { fetchProductDetails } = useProduct()
  const [product, setProduct] = useState(null)
  
  async function fetchProduct() {
    const result = await fetchProductDetails(productId)
    if (result.success) {
      setProduct(result.product)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId])


  return (
    <div>SellerProductDetails</div>
  )
}

export default SellerProductDetails