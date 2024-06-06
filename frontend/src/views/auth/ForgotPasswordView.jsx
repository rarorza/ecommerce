import { useState } from 'react'
import apiInstance from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function ForgotPasswordView() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
        alert('An e-mail has been sent to you')
        setIsLoading(false)
      })
    } catch (error) {
      console.log('error', error)
      alert('E-mail does not exists')
      setIsLoading(false)
    }
  }
  return (
    <>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container">
            {/* Section: Login form */}
            <section className="">
              <div className="row d-flex justify-content-center">
                <div className="col-xl-5 col-md-8">
                  <div className="card rounded-5">
                    <div className="card-body p-4">
                      <h3 className="text-center">Forgot Password</h3>
                      <br />

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
                          <form onSubmit={handleSubmit}>
                            {/* Email input */}
                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Email Address
                              </label>
                              <input
                                type="text"
                                id="email"
                                name="email"
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                              />
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
                                  Sent Email
                                  <i className="fas fa-paper-plane"></i>
                                </button>
                              )}
                              <p className="mt-2">
                                Want to sign in?{' '}
                                <Link to={'/login'}>Login</Link>
                              </p>
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

export default ForgotPasswordView
