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
import { CartProvider } from './context/CartContext'
import PrivateRoute from './layout/PrivateRoute'
import MainWrapper from './layout/MainWrapper'
import DashBoardView from './views/customer/DashBoardView'
import Account from './components/customer/Account'
import Orders from './components/customer/Orders'
import OrderDetail from './components/customer/OrderDetail'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <MainWrapper>
          <Routes>
            <Route path="/dashboard" element={<HomeView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/logout" element={<LogoutView />} />
            <Route path="/forgot-password" element={<ForgotPasswordView />} />
            <Route
              path="/create-new-password"
              element={<CreatePasswordView />}
            />

            {/*Store Components*/}
            <Route path="/" element={<ProductsView />} />
            <Route path="/detail/:slug" element={<ProductDetailView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/checkout/:order_oid" element={<CheckoutView />} />
            <Route
              path="/payment-success/:order_oid"
              element={<PaymentSuccessView />}
            />
            <Route path="/search" element={<SearchView />} />
            {/*Customer Components*/}
            {/* To make possible nested routes, I'm using Outlet from react router dom to manage props  */}
            <Route
              path="/customer/*"
              element={
                <PrivateRoute>
                  <DashBoardView />
                </PrivateRoute>
              }
            >
              <Route path="account" element={<Account />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:order_oid" element={<OrderDetail />} />
            </Route>
            <Route />
          </Routes>
        </MainWrapper>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
