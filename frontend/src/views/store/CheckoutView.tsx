import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js'

import CartSummary from '../../components/CartSummary'
import apiInstance from '../../utils/axios'
import { IOrder } from '../../shared/order.interface'
import { CartTotalProperties } from '../../shared/cart.interface'
import { AxiosError } from 'axios'
import { getCheckoutData } from '../../utils/plugins/GetCheckoutData'
import { PAYPAL_CLIENT_ID } from '../../utils/constants'

function CheckoutView() {
  const [order, setOrder] = useState<IOrder>()
  const [cartTotal, setCartTotal] = useState<CartTotalProperties>()
  const [couponCode, setCouponCode] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const navigate = useNavigate()

  const order_oid = useParams().order_oid

  useEffect(() => {
    if (order_oid) {
      getCheckoutData(order_oid, setOrder, setCartTotal)
    }
  }, [order_oid])

  const handleCoupon = async () => {
    const data = JSON.stringify({
      coupon_code: couponCode,
      order_oid: order_oid,
    })
    const formData = new FormData()
    formData.append('data', data)

    try {
      const response = await apiInstance.post(`coupon/`, formData)
      Swal.fire({
        icon: response.data.icon,
        title: response.data.message,
      })
      if (order_oid) getCheckoutData(order_oid, setOrder)
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: error.response?.data.icon,
          title: error.response?.data.message,
        })
        return
      }
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
      })
    }
  }

  // Stripe
  // test card 4242 4242 4242 4242

  const payWithStripe = async () => {
    setPaymentLoading(true)
    try {
      const res = await apiInstance.post(`checkout-stripe/${order?.oid}/`)
      console.log(res.data)
      if (res.data.redirect_url) {
        window.location.href = `${res.data.redirect_url}`
      }
      setPaymentLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  // Paypal
  // test card 4032 0389 5459 0182 - 07/2029 - 453

  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
  }

  const paypalOnAprover: PayPalButtonsComponentProps['onApprove'] = (
    data,
    actions,
  ) => {
    return actions.order.capture().then((details) => {
      // const name = details?.payment_source?.paypal?.name?.given_name
      const status = details.status
      const payapl_order_id = data.orderID

      if (status === 'COMPLETED') {
        navigate(
          `/payment-success/${order?.oid}/?payapl_order_id=${payapl_order_id}`,
        )
      }
    })
  }

  const paypalCreateOrder: PayPalButtonsComponentProps['createOrder'] = (
    data,
    actions,
  ) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: order?.total.toString(),
          },
        },
      ],
    })
  }

  return (
    <>
      <main>
        <main className="mb-4 mt-4">
          <div className="container">
            <section className="">
              <div className="row gx-lg-5">
                <div className="col-lg-8 mb-4 mb-md-0">
                  <section className="">
                    <div className="alert alert-warning">
                      <strong>Review Your Shipping &amp; Order Details </strong>
                    </div>
                    <form>
                      <h5 className="mb-4 mt-4">Shipping address</h5>
                      <div className="row mb-4">
                        <div className="col-lg-12">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.full_name || ''}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Email
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.email || ''}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Mobile
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.mobile || ''}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.address || ''}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.city || ''}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.state || ''}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order?.country || ''}
                            />
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-4 mt-4">Billing address</h5>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          defaultValue=""
                          id="form6Example8"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form6Example8"
                        >
                          Same as shipping address
                        </label>
                      </div>
                    </form>
                  </section>
                  {/* Section: Biling details */}
                </div>
                <div className="col-lg-4 mb-4 mb-md-0">
                  {/* Section: Summary */}
                  <section className="shadow-4 p-4 rounded-5 mb-4">
                    {cartTotal && (
                      <CartSummary cartTotal={cartTotal} isCheckout={true} />
                    )}

                    <div className="shadow p-3 d-flex mt-4 mb-4">
                      <input
                        name="couponCode"
                        type="text"
                        className="form-control"
                        style={{ border: 'dashed 1px gray' }}
                        placeholder="Enter Coupon Code"
                        id=""
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        className="btn btn-success ms-1"
                        onClick={handleCoupon}
                      >
                        <i className="fas fa-check-circle"></i>
                      </button>
                    </div>

                    {paymentLoading ? (
                      <button
                        onClick={payWithStripe}
                        disabled
                        className="btn btn-primary btn-rounded w-100 mt-2"
                        style={{ backgroundColor: '#635BFF' }}
                      >
                        Processing... <i className="fas fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button
                        onClick={payWithStripe}
                        className="btn btn-primary btn-rounded w-100 mt-2"
                        style={{ backgroundColor: '#635BFF' }}
                      >
                        Pay Now (Stripe)
                      </button>
                    )}

                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        className="mt-3"
                        createOrder={paypalCreateOrder}
                        onApprove={paypalOnAprover}
                      />
                    </PayPalScriptProvider>

                    {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </main>
    </>
  )
}

export default CheckoutView
