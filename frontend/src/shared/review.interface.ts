import { IProduct } from './product.interface'
import { IProfile } from './profile.interface'

export interface BaseReview {
  review: string
  rating: number
}

export interface IReview extends BaseReview {
  id: number
  profile: IProfile
  product: IProduct
  active: boolean
  date: string
  reply: string
}

export interface NewReview extends BaseReview {
  user_id: number
  product_id: number
}
