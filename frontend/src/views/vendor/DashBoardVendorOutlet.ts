import { useOutletContext } from 'react-router-dom'
import { IResumeStats } from '../../shared/vendor.interface'

export interface ContextType {
  resumeStats: IResumeStats
}

export function useOutletDashBoardVendor() {
  return useOutletContext<ContextType>()
}
