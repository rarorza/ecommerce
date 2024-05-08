import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

const PrivateRoute = ({ children }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    return isLoggedIn ? <>{children}</> : <Navigate to={'/login'} />
}

export default PrivateRoute