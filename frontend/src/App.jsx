import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'
import DashBoard from './views/auth/DashBoard'
import LogoutView from './views/auth/LogoutView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashBoard />} />
        <Route path='/login' element={<LoginView />} />
        <Route path='/register' element={<RegisterView />} />
        <Route path='/logout' element={<LogoutView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
