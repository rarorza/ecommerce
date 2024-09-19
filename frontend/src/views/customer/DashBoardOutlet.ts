import { IProfile } from '../../shared/profile.interface'
import { IOrder } from '../../shared/order.interface'
import { useOutletContext } from 'react-router-dom'

export interface ContextType {
  profile: IProfile
  orders: IOrder[]
}

export function useOutletDashBoard() {
  return useOutletContext<ContextType>()
}
