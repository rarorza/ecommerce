import { useEffect, useState } from 'react'
import { IProfile } from '../../shared/profile.interface'
import apiInstance from '../../utils/axios'
import GetUserData from '../../utils/plugins/GetUserData'

function AccountDetail() {
  const userData = GetUserData()
  const [profile, setProfile] = useState<IProfile>()
  // const [profile, setProfile] = useState<IProfile | undefined>(undefined)

  const getProfileData = async () => {
    try {
      const res = await apiInstance.get(`user/profile/${userData?.user_id}`)
      setProfile(res.data)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProfileData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    const updatedProfile: IProfile = {
      ...profile,
      [name]: value,
    }

    setProfile(updatedProfile)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    console.log(files)

    const updatedProfile: IProfile = {
      ...profile,
      [name]: files ? files[0] : profile?.image,
    }

    setProfile(updatedProfile)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    const res: IProfile = await getProfileData()
    const data: IProfile = {}

    if (profile?.image && profile.image !== res.image) {
      data.image = profile.image
    }
    data.full_name = profile?.full_name
    data.country = profile?.country
    data.state = profile?.state
    data.city = profile?.city
    data.adress = profile?.adress

    for (const key in data) {
      formData.append(key, data[key])
    }

    try {
      await apiInstance.patch(`user/profile/${userData?.user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container px-4">
      <section className="">
        <h3 className="mb-3">
          {' '}
          <i className="fas fa-gear fa-spin" /> Settings{' '}
        </h3>
        <form encType="multipart/form-data" onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-lg-12">
              <label htmlFor="profileImage" className="form-label">
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                className="form-control"
                aria-describedby="Profile Image Input"
                onChange={handleImageChange}
                name="image"
              />
            </div>
            <div className="col-lg-12 mt-3">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                aria-describedby="Full Name Input"
                value={profile?.full_name ?? ''}
                onChange={handleInputChange}
                name="full_name"
              />
            </div>
            <div className="col-lg-6 mt-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                aria-describedby="Email Input"
                value={profile?.user?.email ?? ''}
                onChange={handleInputChange}
                name="email"
                readOnly
              />
            </div>
            <div className="col-lg-6 mt-3">
              <label htmlFor="phoneNumber" className="form-label">
                Mobile
              </label>
              <input
                type="text"
                id="phoneNumber"
                className="form-control"
                aria-describedby="Phone Input"
                value={profile?.user?.phone ?? ''}
                onChange={handleInputChange}
                name="phone"
                readOnly
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="form-control"
                aria-describedby="Address Input"
                value={profile?.adress ?? ''}
                onChange={handleInputChange}
                name="adress"
              />
            </div>
            <div className="col-lg-6">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city"
                className="form-control"
                aria-describedby="City Input"
                value={profile?.city ?? ''}
                onChange={handleInputChange}
                name="city"
              />
            </div>
            <div className="col-lg-6 mt-3">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                type="text"
                id="state"
                className="form-control"
                aria-describedby="State Input"
                value={profile?.state ?? ''}
                onChange={handleInputChange}
                name="state"
              />
            </div>
            <div className="col-lg-6 mt-3">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="form-control"
                aria-describedby="Country Input"
                value={profile?.country ?? ''}
                onChange={handleInputChange}
                name="country"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-5">
            Save Changes
          </button>
        </form>
      </section>
    </div>
  )
}

export default AccountDetail
