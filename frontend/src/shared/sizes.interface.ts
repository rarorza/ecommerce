import { IProduct } from './product.interface'

export interface ISizes {
  id: number
  name: string
  price: string
  product: IProduct
}
