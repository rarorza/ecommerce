import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'
import HomeView from './views/HomeView'
import LogoutView from './views/auth/LogoutView'
import ForgotPasswordView from './views/auth/ForgotPasswordView'
import CreatePasswordView from './views/auth/CreatePasswordView'
import Footer from './components/base/Footer'
import Header from './components/base/Header'
import ProductsView from './views/store/ProductsView'
import ProductDetailView from './views/store/ProductDetailView'
import CartView from './views/store/CartView'
import CheckoutView from './views/store/CheckoutView'
import PaymentSuccessView from './views/store/PaymentSuccessView'
import SearchView from './views/store/SearchView'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/logout" element={<LogoutView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/create-new-password" element={<CreatePasswordView />} />

        {/*Store Components*/}
        <Route path="/" element={<ProductsView />} />
        <Route path="/detail/:slug/" element={<ProductDetailView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/checkout/:order_oid" element={<CheckoutView />} />
        <Route
          path="/payment-success/:order_oid"
          element={<PaymentSuccessView />}
        />
        <Route path="/search" element={<SearchView />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
