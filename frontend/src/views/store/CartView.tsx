import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { get } from 'lodash'

import apiInstance from '../../utils/axios'
import GetUserData from '../../utils/plugins/GetUserData'
import GenarateCartID from '../../utils/plugins/GenerateCartID'
import { ICart } from '../../shared/cart.interface'
import { IProduct } from '../../shared/product.interface'
import GetUserCountry from '../../utils/plugins/GetUserCountry'

interface CartTotalProperties {
  shipping: number
  tax: number
  service_fee: number
  sub_total: number
  total: number
}

interface IHashNumber {
  [key: number]: number
}

const ToastNotification = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})

function Cart() {
  const [cart, setCart] = useState<Array<ICart>>()
  const [cartTotal, setCartTotal] = useState<CartTotalProperties>()
  const [productsQuantities, setProductsQuantities] = useState<IHashNumber>({})
  const userAddress = GetUserCountry()

  const userData = GetUserData()
  const cartId = GenarateCartID()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  // Cart General

  const fetchCartData = (cartId: string, userId: number | null) => {
    const url = userId
      ? `cart-list/${cartId}/${userId}/`
      : `cart-list/${cartId}/`

    try {
      apiInstance.get(url).then((res) => {
        setCart(res.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCartTotal = (cartId: string, userId: number | null) => {
    const url = userId ? `cart-detail/${cartId}/` : `cart-detail/${cartId}/`

    try {
      apiInstance.get(url).then((res) => {
        setCartTotal(res.data)
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (cartId !== null || cartId !== undefined) {
      if (userData !== undefined) {
        // Send cart data with useId and cartId
        const userId = userData?.user_id
        fetchCartData(cartId, userId)
        fetchCartTotal(cartId, userId)
      } else {
        // Send cart data without userId, with only cartId
        fetchCartData(cartId, null)
        fetchCartTotal(cartId, null)
      }
    }
  }, [cartId])

  // Quantity

  const handleQtyChange = (e, product_id: number) => {
    const quantity = e.target.value
    setProductsQuantities((prevProductsQuantities) => ({
      ...prevProductsQuantities,
      [product_id]: quantity,
    }))
  }

  const updateCart = async (product: IProduct, color: string, size: string) => {
    const qtyValue = productsQuantities[product.id]

    const formData = new FormData()
    const data = JSON.stringify({
      product_id: product.id,
      user_id: userData?.user_id,
      cart_id: cartId,
      qty: qtyValue,
      price: product.price,
      shipping_amount: product.shipping_amount,
      country: get(userAddress, 'contry', ''),
      color: color,
      size: size,
    })

    formData.append('data', data)
    try {
      const response = await apiInstance.post('cart/', formData)

      fetchCartData(cartId, userData?.user_id)
      fetchCartTotal(cartId, userData?.user_id)

      ToastNotification.fire({
        icon: 'success',
        title: response.data.message,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const initialQuantities: IHashNumber = {}
    if (cart !== undefined) {
      cart.forEach((c) => {
        initialQuantities[c.product.id] = c.qty
      })
      setProductsQuantities(initialQuantities)
    }
  }, [cart])

  // Delete Item

  const handleDeleteCartItem = async (itemId: number) => {
    const url = userData?.user_id
      ? `cart-delete/${cartId}/${itemId}/${userData?.user_id}`
      : `cart-delete/${cartId}/${itemId}`

    try {
      await apiInstance.delete(url)

      fetchCartData(cartId, userData?.user_id)
      fetchCartTotal(cartId, userData?.user_id)

      ToastNotification.fire({
        icon: 'success',
        title: 'Item removed from cart',
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Shipping Details

  const handleShippingDetails = (e) => {
    const { name, value } = e.target
    switch (name) {
      case 'fullName':
        setFullName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'mobile':
        setMobile(value)
        break
      case 'address':
        setAddress(value)
        break
      case 'city':
        setCity(value)
        break
      case 'state':
        setState(value)
        break
      case 'country':
        setCountry(value)
        break
      default:
        break
    }
  }

  const handleCheckout = () => {
    console.log('order')
  }

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          <main className="mb-6">
            <div className="container">
              <section className="">
                <div className="row gx-lg-5 mb-5">
                  <div className="col-lg-8 mb-4 mb-md-0">
                    <section className="mb-5">
                      {cart?.map((c, index) => (
                        <div className="row border-bottom mb-4" key={index}>
                          <div className="col-md-2 mb-4 mb-md-0">
                            <div
                              className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                              data-ripple-color="light"
                            >
                              <Link to="">
                                <img
                                  src={c.product?.image}
                                  className="w-100"
                                  alt=""
                                  style={{
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                  }}
                                />
                              </Link>
                              <a href="#!">
                                <div className="hover-overlay">
                                  <div
                                    className="mask"
                                    style={{
                                      backgroundColor:
                                        'hsla(0, 0%, 98.4%, 0.2)',
                                    }}
                                  />
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="col-md-8 mb-4 mb-md-0">
                            <Link to={null} className="fw-bold text-dark mb-4">
                              {c?.product?.title}
                            </Link>
                            {c.size !== 'No Size' && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Size:</span>
                                <span>{c.size}</span>
                              </p>
                            )}
                            {c.color !== 'No Color' && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Color:</span>
                                <span>{c.color}</span>
                              </p>
                            )}
                            <p className="mb-0">
                              <span className="text-muted me-2">Price:</span>
                              <span>{c.price}</span>
                            </p>
                            <p className="mb-0">
                              <span className="text-muted me-2">
                                Stock Qty:
                              </span>
                              <span>{c.product.stock_qty}</span>
                            </p>
                            <p className="mb-0">
                              <span className="text-muted me-2">Vendor:</span>
                              <span>Rarorza</span>
                            </p>
                            <p className="mt-3">
                              <button
                                onClick={() => handleDeleteCartItem(c.id)}
                                className="btn btn-danger "
                              >
                                <small>
                                  <i className="fas fa-trash me-2" />
                                  Remove
                                </small>
                              </button>
                            </p>
                          </div>
                          <div className="col-md-2 mb-4 mb-md-0">
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="form-outline">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={
                                    productsQuantities[c.product.id] || c.qty
                                  }
                                  min={1}
                                  onChange={(e) =>
                                    handleQtyChange(e, c.product.id)
                                  }
                                />
                              </div>
                              <button
                                onClick={() =>
                                  updateCart(c.product, c.color, c.size)
                                }
                                className="ms-2 btn btn-primary"
                              >
                                <i className="fas fa-rotate-right"></i>
                              </button>
                            </div>
                            <h5 className="mb-2 mt-3 text-center">
                              <span className="align-middle">
                                ${c.price * c.qty}
                              </span>
                            </h5>
                          </div>
                        </div>
                      ))}

                      {get(cart, 'length', 0) < 1 && (
                        <>
                          <h5>Your Cart Is Empty</h5>
                          <Link to="/">
                            {' '}
                            <i className="fas fa-shopping-cart"></i> Continue
                            Shopping
                          </Link>
                        </>
                      )}
                    </section>

                    {get(cart, 'length', 1) > 0 && (
                      <div>
                        <h5 className="mb-4 mt-4">Personal Information</h5>
                        {/* 2 column grid layout with text inputs for the first and last names */}
                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="full_name">
                                {' '}
                                <i className="fas fa-user"></i> Full Name
                              </label>
                              <input
                                type="text"
                                id=""
                                name="fullName"
                                className="form-control"
                                onChange={handleShippingDetails}
                                value={fullName}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                <i className="fas fa-envelope"></i> Email
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="email"
                                onChange={handleShippingDetails}
                                value={email}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                <i className="fas fa-phone"></i> Mobile
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="mobile"
                                onChange={handleShippingDetails}
                                value={mobile}
                              />
                            </div>
                          </div>
                        </div>

                        <h5 className="mb-1 mt-4">Shipping address</h5>

                        <div className="row mb-4">
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {' '}
                                Address
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="address"
                                onChange={handleShippingDetails}
                                value={address}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {' '}
                                City
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="city"
                                onChange={handleShippingDetails}
                                value={city}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {' '}
                                State
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="state"
                                onChange={handleShippingDetails}
                                value={state}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {' '}
                                Country
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="country"
                                onChange={handleShippingDetails}
                                value={country}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-4 mb-4 mb-md-0">
                    {/* Section: Summary */}
                    <section className="shadow-4 p-4 rounded-5 mb-4">
                      <h5 className="mb-3">Cart Summary</h5>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Subtotal </span>
                        <span>${cartTotal?.sub_total.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Shipping </span>
                        <span>${cartTotal?.shipping.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Tax </span>
                        <span>${cartTotal?.tax.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Servive Fee </span>
                        <span>${cartTotal?.service_fee.toFixed(2)}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between fw-bold mb-5">
                        <span>Total </span>
                        <span>${cartTotal?.total.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="btn btn-primary btn-rounded w-100"
                      >
                        Got to checkout
                      </button>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </main>
    </div>
  )
}

export default Cart
