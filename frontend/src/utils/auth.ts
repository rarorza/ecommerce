import { useAuthStore } from '../store/auth'
import axios from './axios'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { AxiosError } from 'axios'
import { IUserDataJwt } from '../shared/user.interface'

const ToastNotification = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})

interface ILoginResponse {
  access: string
  refresh: string
}

interface IErrorResponse {
  detail: string
}

interface IUserResponse {
  full_name: string
  email: string
  phone: string
  password: string
  password2: string
}

export const login = async (
  email: string,
  password: string,
): Promise<{ data: ILoginResponse | null; error: string | null }> => {
  try {
    const { data, status } = await axios.post<ILoginResponse>('user/token/', {
      email,
      password,
    })

    if (status === 200) {
      setAuthUser(data.access, data.refresh)
      ToastNotification.fire({
        icon: 'success',
        title: 'Login Successfully',
      })
      return { data, error: null }
    }
    return { data: null, error: null }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        error:
          (error.response?.data as IErrorResponse)?.detail ||
          'Something went wrong',
      }
    }
    return { data: null, error: null }
  }
}

export const register = async (
  full_name: string,
  email: string,
  phone: string,
  password: string,
  password2: string,
): Promise<{ data: IUserResponse | null; error: string | null }> => {
  try {
    const { data } = await axios.post('user/register/', {
      full_name,
      email,
      phone,
      password,
      password2,
    })

    await login(email, password)

    ToastNotification.fire({
      icon: 'success',
      title: 'Account Created Successfully',
    })

    return { data, error: null }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        error:
          (error.response?.data as IErrorResponse)?.detail ||
          'Something went wrong',
      }
    }
    return { data: null, error: null }
  }
}

export const logout = (): void => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  useAuthStore.getState().setUser(null)
}

export const setUser = async (): Promise<void> => {
  const accessToken = Cookies.get('access_token')
  const refreshToken = Cookies.get('refresh_token')

  if (!accessToken || !refreshToken) {
    return
  }

  if (isAccessTokenExpired(accessToken)) {
    const response = await getRefreshToken()
    setAuthUser(response.access, response.refresh)
  } else {
    setAuthUser(accessToken, refreshToken)
  }
}

export const setAuthUser = (
  access_token: string,
  refresh_token: string,
): void => {
  Cookies.set('access_token', access_token, {
    expires: 1,
    secure: true,
  })
  Cookies.set('refresh_token', refresh_token, {
    expires: 7,
    secure: true,
  })

  const user = jwtDecode<IUserDataJwt>(access_token) ?? {
    username: null,
    user_id: null,
  }

  if (user) {
    useAuthStore.getState().setUser(user)
  }
  useAuthStore.getState().setLoading(false)
}

export const getRefreshToken = async (): Promise<ILoginResponse> => {
  const refresh_token = Cookies.get('refresh_token')
  const response = await axios.post<ILoginResponse>('user/token/refresh/', {
    refresh: refresh_token,
  })
  return response.data
}

export const isAccessTokenExpired = (accessToken: string): boolean => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(accessToken)
    return decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : true
  } catch (error) {
    console.log(error)
    return true
  }
}
