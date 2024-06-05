import { useState } from 'react'
import apiInstance from '../../utils/axios'
import { useNavigate } from 'react-router-dom'

function ForgotPasswordView() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
        alert('An e-mail has been sent to you')
        navigate('/create-new-password')
      })
    } catch (error) {
      console.log('error', error)
      alert('E-mail does not exists')
    }
  }
  return (
    <div>
      <h1>Forgot Password</h1>
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Enter Email"
        name=""
        id=""
      />
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  )
}

export default ForgotPasswordView
