import apiInstace from '../axios'

import { IOrder } from '../../shared/order.interface'
import { CartTotalProperties } from '../../shared/cart.interface'

export const getCheckoutData = async (
  oid: string,
  setOrder: (order: IOrder) => void,
  setCartTotal?: (cartTotal: CartTotalProperties) => void | null,
) => {
  const response = await apiInstace.get(`checkout/${oid}`)
  const order: IOrder = response.data

  const cartTotal: CartTotalProperties = {
    shipping_amount: order.shipping_amount,
    tax_fee: order.tax_fee,
    service_fee: order.service_fee,
    sub_total: order.sub_total,
    total: order.total,
    saved: order.saved,
  }
  setOrder(order)
  if (setCartTotal) {
    setCartTotal(cartTotal)
  }
}
