import { Outlet } from 'react-router-dom'
import SideBar from '../../components/vendor/SideBar'
import { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import GetUserData from '../../utils/plugins/GetUserData'
import { IResumeStats } from '../../shared/vendor.interface'
// Outlet Typing
import { ContextType } from './DashBoardVendorOutlet'
import { IProduct } from '../../shared/product.interface'

function DashBoardVendorView() {
  const [resumeStats, setResumeStats] = useState<IResumeStats>()
  const [products, setProducts] = useState<IProduct[]>()
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

  const getProducts = async () => {
    if (userData?.vendor_id) {
      try {
        const res = await apiInstance.get(
          `vendor/products/${userData.vendor_id}`,
        )
        setProducts(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getVendorResumeStats()
    getProducts()
  }, [])

  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <SideBar />
          {resumeStats && products ? (
            <Outlet context={{ resumeStats, products } satisfies ContextType} />
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default DashBoardVendorView
