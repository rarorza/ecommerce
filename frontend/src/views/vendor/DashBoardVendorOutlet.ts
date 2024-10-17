import { useOutletContext } from 'react-router-dom'
import { IResumeStats } from '../../shared/vendor.interface'
import { IProduct } from '../../shared/product.interface'

export interface ContextType {
  resumeStats: IResumeStats
  products: IProduct[]
}

export function useOutletDashBoardVendor() {
  return useOutletContext<ContextType>()
}
