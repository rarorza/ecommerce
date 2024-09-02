import { IProduct } from './product.interface'

export interface IColors {
  id: number
  name: string
  color_code: string
  product: IProduct
}
