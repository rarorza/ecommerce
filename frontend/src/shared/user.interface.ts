import { JwtPayload } from 'jwt-decode'
export interface IUser {
  id: number
  password: string
  last_login: string
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  phone: string
  otp: string
  groups: []
  user_permissions: []
}

export interface IUserDataJwt extends JwtPayload {
  user_id: number | null
  username: string | null
}