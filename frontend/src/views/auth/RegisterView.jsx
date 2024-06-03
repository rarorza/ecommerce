import { useState, useEffect } from 'react'
import { register } from '../../utils/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

function RegisterView() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await register(fullName, email, phone, password, password2)
    if (error) {
      alert(JSON.stringify(error))
    } else {
      navigate('/')
    }
  }
  return (
    <>
      <div>RegisterView</div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Full Name'
          name=''
          id=''
          onChange={(e) => setFullName(e.target.value)}
        />
        <br />
        <input
          type='email'
          placeholder='E-mail'
          name=''
          id=''
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type='number'
          placeholder='Mobile Number'
          name=''
          id=''
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />
        <input
          type='password'
          placeholder='Enter Password'
          name=''
          id=''
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type='password'
          placeholder='Confirm your password'
          name=''
          id=''
          onChange={(e) => setPassword2(e.target.value)}
        />
        <br />
        <button type='submit'>Register</button>
      </form>
    </>
  )
}

export default RegisterView