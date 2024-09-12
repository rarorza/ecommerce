import { IProduct } from './product.interface'
import { IUser } from './user.interface'

export interface ICart extends CartTotalProperties {
  id: number
  cart_id: string
  qty: number
  price: number
  country: string
  size: string
  color: string
  date: string
  product: IProduct
  user: IUser
}

export interface CartTotalProperties {
  shipping_amount: number
  tax_fee: number
  service_fee: number
  sub_total: number
  total: number
  saved: number | string | null
}
