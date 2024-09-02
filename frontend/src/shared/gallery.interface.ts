import { IProduct } from './product.interface'

export interface IGallery {
  id: number
  gid: string
  image: string
  active: boolean
  product: IProduct
}
