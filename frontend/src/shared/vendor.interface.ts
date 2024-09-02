import { IUser } from './user.interface'

export interface IVendor {
  id: number
  image: string
  name: string
  description: string
  mobile: string
  active: boolean
  date: string
  slug: string
  user: IUser
}
