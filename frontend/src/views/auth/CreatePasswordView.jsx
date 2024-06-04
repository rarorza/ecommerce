import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import apiInstance from "../../utils/axios"

function CreatePasswordView() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const otp = searchParams.get('otp')
  const uidb64 = searchParams.get('uidb64')

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Password does not match')
    } else {
      const formData = new FormData()
      formData.append('password', password)
      formData.append('otp', otp)
      formData.append('uidb64', uidb64)

      try {
        await apiInstance.post(`user/password-change/`, formData).then((res) => {
          alert('Password changed successfully')
          navigate('/login')
        })
      } catch (error) {
        console.log('error', error)
        alert('An error occured while trying to change the password')
      }
    }
  }

  return (
    <div>
      <h1>Create Password</h1>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          name="" id=""
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
          />
        <input
          type="password"
          name="" id=""
          placeholder="Confirm new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Save New Password</button>
      </form>
    </div>
  )
}

export default CreatePasswordView