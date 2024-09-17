import { createContext, useEffect, useState } from 'react'
import apiInstance from '../utils/axios'
import GetUserData from '../utils/plugins/GetUserData'
import GenerateCartID from '../utils/plugins/GenerateCartID'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0)

  const userData = GetUserData()
  const userId = userData?.user_id
  const cartId = GenerateCartID()

  const fetchCartData = async (cartId: string, userId: number | null) => {
    const url = userId
      ? `cart-list/${cartId}/${userId}/`
      : `cart-list/${cartId}/`

    try {
      const res = await apiInstance.get(url)
      setCartCount(res.data.length)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCartData(cartId, userId || null)
  }, [cartCount])

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      {children}
    </CartContext.Provider>
  )
}
