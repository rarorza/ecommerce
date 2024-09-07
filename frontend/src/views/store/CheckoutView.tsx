import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import CartSummary from '../../components/CartSummary'
import apiInstace from '../../utils/axios'
import { IOrder } from '../../shared/order.interface'
import { CartTotalProperties } from './CartView'
import { AxiosError } from 'axios'

function CheckoutView() {
  const [order, setOrder] = useState<IOrder>()
  const [cartTotal, setCartTotal] = useState<CartTotalProperties>()
  const [couponCode, setCouponCode] = useState('')

  const order_oid = useParams().order_oid
  const getCheckoutData = async (oid: string) => {
    apiInstace.get(`checkout/${oid}`).then((res) => {
      setOrder(res.data)
      setCartTotal(() => {
        const {
          shipping_amount,
          tax_fee,
          service_fee,
          sub_total,
          total,
          saved,
        } = res.data
        return {
          shipping_amount,
          tax_fee,
          service_fee,
          sub_total,
          total,
          saved,
        }
      })
    })
  }
  useEffect(() => {
    if (order_oid) {
      getCheckoutData(order_oid)
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
      const response = await apiInstace.post(`coupon/`, formData)
      Swal.fire({
        icon: response.data.icon,
        title: response.data.message,
      })
      if (order_oid) getCheckoutData(order_oid)
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

                    <form
                      action={`http://127.0.0.1:8000/stripe-checkout/ORDER_ID/`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="btn btn-primary btn-rounded w-100 mt-2"
                        style={{ backgroundColor: '#635BFF' }}
                      >
                        Pay Now (Stripe)
                      </button>
                    </form>

                    {/* <PayPalScriptProvider options={initialOptions}> */}
                    {/*   <PayPalButtons */}
                    {/*     className="mt-3" */}
                    {/*     createOrder={(data, actions) => { */}
                    {/*       return actions.order.create({ */}
                    {/*         purchase_units: [ */}
                    {/*           { */}
                    {/*             amount: { */}
                    {/*               currency_code: 'USD', */}
                    {/*               value: 100, */}
                    {/*             }, */}
                    {/*           }, */}
                    {/*         ], */}
                    {/*       }) */}
                    {/*     }} */}
                    {/*     onApprove={(data, actions) => { */}
                    {/*       return actions.order.capture().then((details) => { */}
                    {/*         const name = details.payer.name.given_name */}
                    {/*         const status = details.status */}
                    {/*         const payapl_order_id = data.orderID */}
                    {/**/}
                    {/*         console.log(status) */}
                    {/*         if (status === 'COMPLETED') { */}
                    {/*           navigate( */}
                    {/*             `/payment-success/${order.oid}/?payapl_order_id=${payapl_order_id}`, */}
                    {/*           ) */}
                    {/*         } */}
                    {/*       }) */}
                    {/*     }} */}
                    {/*   /> */}
                    {/* </PayPalScriptProvider> */}

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
