import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LoginView from './views/auth/LoginView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginView/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
