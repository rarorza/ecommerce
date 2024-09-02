import { IProduct } from './product.interface'
import { IUser } from './user.interface'

export interface ICart {
  id: number
  cart_id: string
  qty: number
  price: number
  country: string
  size: string
  color: string
  date: string
  sub_total: string
  shipping_amount: string
  service_fee: string
  tax_fee: string
  total: string
  product: IProduct
  user: IUser
}
