import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import apiInstance from '../../utils/axios'

function CreatePasswordView() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const otp = searchParams.get('otp')
  const uidb64 = searchParams.get('uidb64')

  const handlePasswordSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Password does not match')
      setIsLoading(false)
    } else {
      const formData = new FormData()
      formData.append('password', password)
      formData.append('otp', otp)
      formData.append('uidb64', uidb64)

      try {
        await apiInstance
          .post(`user/password-change/`, formData)
          .then((res) => {
            alert('Password changed successfully')
            navigate('/login')
            setIsLoading(false)
          })
      } catch (error) {
        console.log('error', error)
        alert('An error occured while trying to change the password')
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container">
            <section className="">
              <div className="row d-flex justify-content-center">
                <div className="col-xl-5 col-md-8">
                  <div className="card rounded-5">
                    <div className="card-body p-4">
                      <h3 className="text-center">Create New Password</h3>
                      <br />

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
                          <form onSubmit={handlePasswordSubmit}>
                            {/* Email input */}
                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Enter New Password
                              </label>
                              <input
                                type="password"
                                id="password"
                                required
                                name="password"
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>

                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                id="password"
                                required
                                name="confirmPassword"
                                className="form-control"
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                              {/* {error !== null &&
                                                            <>
                                                                {error === true

                                                                    ? <p className='text-danger fw-bold mt-2'>Password Does Not Match</p>
                                                                    : <p className='text-success fw-bold mt-2'>Password Matched</p>
                                                                }
                                                            </>
                                                        } */}
                            </div>

                            <div className="text-center">
                              {isLoading ? (
                                <button
                                  disabled
                                  type="submit"
                                  className="btn btn-primary w-100"
                                >
                                  Processing...
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary w-100"
                                >
                                  Reset Password
                                  <i className="fas fa-check-circle"></i>
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </section>
    </>
  )
}

export default CreatePasswordView
