import { IUser } from './user.interface'

export interface IProfile {
  image?: string | any
  full_name?: string
  about?: string
  gender?: string
  country?: string
  state?: string
  city?: string
  adress?: string
  date?: string
  pid?: string
  user?: IUser
}
