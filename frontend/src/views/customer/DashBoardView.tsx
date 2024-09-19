import { Outlet } from 'react-router-dom'
import SideBar from '../../components/customer/SideBar'
import { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import { IProfile } from '../../shared/profile.interface'
import GetUserData from '../../utils/plugins/GetUserData'
import { IOrder } from '../../shared/order.interface'
// Outlet Typing
import { ContextType } from './DashBoardOutlet'

function DashBoardView() {
  const [profile, setProfile] = useState<IProfile>()
  const [orders, setOrders] = useState<IOrder[]>()
  const userData = GetUserData()

  const getProfileData = async () => {
    if (userData?.user_id) {
      try {
        const res = await apiInstance.get(`user/profile/${userData?.user_id}`)
        setProfile(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getOrdersData = async () => {
    if (userData?.user_id) {
      try {
        const res = await apiInstance.get(
          `customer/orders/${userData?.user_id}/`,
        )
        setOrders(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getProfileData()
    getOrdersData()
  }, [])

  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="">
            <div className="row">
              <div className="col-lg-3">
                {profile && <SideBar profile={profile} />}
              </div>
              <div className="col-lg-9 mt-1">
                <main className="mb-5" style={{}}>
                  <div className="container px-4">
                    <section className="">
                      {/* WARNING: before add new state in outlet context, add Typing in ContextType */}
                      {orders && profile ? (
                        <Outlet
                          context={{ profile, orders } satisfies ContextType}
                        />
                      ) : (
                        ''
                      )}
                    </section>
                  </div>
                </main>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default DashBoardView
