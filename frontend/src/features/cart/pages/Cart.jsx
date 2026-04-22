import React from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { useEffect } from 'react'

const Cart = () => {

    const cartItems = useSelector(state => state.cart.items)
    const { handleGetCart} = useCart()

    useEffect(() => {
        handleGetCart()
    }, [])

    console.log(cartItems)

  return (
    <div>
        
    </div>
  )
}

export default Cart