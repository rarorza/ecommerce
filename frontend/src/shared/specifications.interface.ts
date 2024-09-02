import { IProduct } from './product.interface'

export interface ISpecifications {
  id: number
  title: string
  content: string
  product: IProduct
}
