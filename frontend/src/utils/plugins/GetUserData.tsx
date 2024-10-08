import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { IUserDataJwt } from '../../shared/user.interface'

function GetUserData() {
  const access_token = Cookies.get('access_token')
  const refresh_token = Cookies.get('refresh_token')

  if (access_token && refresh_token) {
    const token = refresh_token
    const decoded: IUserDataJwt = jwtDecode(token)
    return decoded
  } else {
    console.log('User token does not exists')
  }
}

export default GetUserData
