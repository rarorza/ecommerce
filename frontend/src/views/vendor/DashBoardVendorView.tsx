import { Outlet } from 'react-router-dom'
import SideBar from '../../components/vendor/SideBar'
import { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import GetUserData from '../../utils/plugins/GetUserData'
import { IResumeStats } from '../../shared/vendor.interface'
// Outlet Typing
import { ContextType } from './DashBoardVendorOutlet'

function DashBoardVendorView() {
  const [resumeStats, setResumeStats] = useState<IResumeStats>()
  const userData = GetUserData()

  const getVendorResumeStats = async () => {
    if (userData?.vendor_id) {
      try {
        const res = await apiInstance.get(`vendor/resume/${userData.vendor_id}`)
        setResumeStats(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getVendorResumeStats()
  }, [])

  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <SideBar />
          {resumeStats ? (
            <Outlet context={{ resumeStats } satisfies ContextType} />
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default DashBoardVendorView
