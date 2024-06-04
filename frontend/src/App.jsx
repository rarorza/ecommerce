import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'
import DashBoard from './views/auth/DashBoard'
import LogoutView from './views/auth/LogoutView'
import ForgotPasswordView from './views/auth/ForgotPasswordView'
import CreatePasswordView from './views/auth/CreatePasswordView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashBoard />} />
        <Route path='/login' element={<LoginView />} />
        <Route path='/register' element={<RegisterView />} />
        <Route path='/logout' element={<LogoutView />} />
        <Route path='/forgot-password' element={<ForgotPasswordView />} />
        <Route path='/create-new-password' element={<CreatePasswordView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
