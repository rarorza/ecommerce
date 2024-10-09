import { IProduct } from './product.interface'
import { IUser } from './user.interface'
import { IVendor } from './vendor.interface'

export interface IOrder {
  id: number
  oid: string
  buyer: IUser
  email: string
  mobile: string
  address: string
  city: string
  state: string
  country: string
  full_name: string
  order_status: string
  payment_status: string
  service_fee: number
  sub_total: number
  tax_fee: number
  shipping_amount: number
  initial_total: number
  total: number
  saved: string
  date: string
  order_item: OrderItem[]
  vendor: IVendor
}

interface OrderItem extends IProduct {
  qty: number
  total: number
  sub_total: number
  product: IProduct
}

export interface OrderChart {
  month: number
  orders: number
}
