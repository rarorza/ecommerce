import { useAuthStore } from '../../store/auth'
import { Link } from 'react-router-dom'

function DashBoardView() {
  const [isLoggedIn, setIsLoggedIn] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ])
  return (
    <>
      {isLoggedIn() ? (
        <div>
          <h1>Dashboard</h1>
          <Link to={`/logout`}>Logout</Link>
        </div>
      ) : (
        <div>
          <h1>Home Page</h1>
          <div className="d-flex">
            <Link className="btn btn-primary" to={'/register'}>
              Register
            </Link>
            <Link className="btn btn-success ms-4" to={'/login'}>
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default DashBoardView
