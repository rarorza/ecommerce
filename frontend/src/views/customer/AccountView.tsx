import SideBar from '../../components/customer/SideBar'
import { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import { IProfile } from '../../shared/profile.interface'
import GetUserData from '../../utils/plugins/GetUserData'

function AccountView() {
  const [profile, setProfile] = useState<IProfile>()
  const userData = GetUserData()

  const getProfileData = async () => {
    if (userData?.user_id) {
      const res = await apiInstance.get(`user/profile/${userData?.user_id}`)
      setProfile(res.data)
    }
  }

  useEffect(() => {
    getProfileData()
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
                    <section className=""></section>
                    <section className="">
                      <div className="row rounded shadow p-3">
                        <h2>Hi {profile?.full_name}, </h2>
                        <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                          From your account dashboard. you can easily check
                          &amp; view your <a href="">orders</a>, manage your{' '}
                          <a href="">shipping</a>
                          <a href="">Edit Account</a>
                        </div>
                      </div>
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

export default AccountView
