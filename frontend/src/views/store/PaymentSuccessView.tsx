import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IOrder } from '../../shared/order.interface'
import { getCheckoutData } from '../../utils/plugins/GetCheckoutData'
import apiInstace from '../../utils/axios'

export default function PaymentSuccessView() {
  const [order, setOrder] = useState<IOrder>()
  const [status, setStatus] = useState('Verifying')

  const params = useParams()
  const order_oid = params?.order_oid

  const urlParam = new URLSearchParams(window.location.search)
  const sessionId = urlParam.get('session_id')
  const paypalOrderId = urlParam.get('paypal_order_id')

  useEffect(() => {
    if (order_oid) {
      getCheckoutData(order_oid, setOrder)
    }
  }, [order_oid])

  useEffect(() => {
    const formData = new FormData()
    const data = JSON.stringify({
      order_oid: order_oid,
      session_id: sessionId,
      paypal_order_id: paypalOrderId,
    })
    formData.append('data', data)

    try {
      apiInstace.post(`payment-success/${params.order_oid}/`, formData).then((res) => {
        const { message } = res.data
        if (message === 'Payment successfull' || message === 'Already paid') {
          setStatus('Payment Successfull')
        }
        if (message === 'Your invoice is unpaid') {
          setStatus('Your invoice is unpaid')
        }
      })
    } catch (error) {
      console.log(error)
      setStatus('An error occured, try again...')
    }
  }, [order_oid, sessionId])

  return (
    <>
      <main className="mb-4 mt-4 h-100">
        <div className="container">
          {/* Section: Checkout form */}
          <section className="">
            <div className="gx-lg-5">
              <div className="row pb50">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h4 className="fw-bold text-center mb-4 mt-4">
                      Checkout Successfull <i className="fas fa-check-circle" />{' '}
                    </h4>
                    {/* <p class="para">Lorem ipsum dolor sit amet, consectetur.</p> */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="application_statics">
                    <div className="account_user_deails dashboard_page">
                      <div className="d-flex justify-content-center align-items-center">
                        {status === 'Verifying' && (
                          <div className="col-lg-12">
                            <div className="border border-3 border-warning" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-spinner text-warning"
                                  style={{ fontSize: 100, color: 'yellow' }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>
                                  Payment Verifying <i className=""></i>
                                </h1>
                                <p>
                                  <b className="">
                                    Please hold on, while we verify your
                                    payment.
                                  </b>
                                  <br />
                                  <b className="text-danger">
                                    NOTE: Do not reload or leave the page
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {status === 'Payment Successfull' && (
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: 'green' }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>Thank You !</h1>
                                <p>
                                  Your checkout was successfull, we have sent
                                  the order detail to your email {order?.email}
                                </p>
                                <button
                                  className="btn btn-success mt-3"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  View Order <i className="fas fa-eye" />{' '}
                                </button>
                                <a
                                  href="/"
                                  className="btn btn-primary mt-3 ms-2"
                                >
                                  Download Invoice{' '}
                                  <i className="fas fa-file-invoice" />{' '}
                                </a>
                                <a className="btn btn-secondary mt-3 ms-2">
                                  Go Home <i className="fas fa-fa-arrow-left" />{' '}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {status === 'Your invoice is unpaid' && (
                          <div className="col-lg-12">
                            <div className="border border-3 border-danger" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-ban text-danger"
                                  style={{ fontSize: 100, color: 'red' }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>
                                  Your invoice is unpaid <i className=""></i>
                                </h1>
                                <p>
                                  <b className="text-danger">
                                    Something whent wrong.
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Order Summary
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="modal-body text-start text-black p-4">
                <h5
                  className="modal-title text-uppercase "
                  id="exampleModalLabel"
                >
                  {order?.full_name}
                </h5>
                <h6>{order?.email}</h6>
                <h6 className="mb-5">{order?.address}</h6>
                <p className="mb-0" style={{ color: '#35558a' }}>
                  Payment summary
                </p>
                <hr
                  className="mt-2 mb-4"
                  style={{
                    height: 0,
                    backgroundColor: 'transparent',
                    opacity: '.75',
                    borderTop: '2px dashed #9e9e9e',
                  }}
                />
                <div className="d-flex justify-content-between">
                  <p className="fw-bold mb-0">Subtotal</p>
                  <p className="text-muted mb-0">${order?.sub_total}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Shipping Fee</p>
                  <p className="small mb-0">${order?.shipping_amount}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Service Fee</p>
                  <p className="small mb-0">${order?.service_fee}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Tax</p>
                  <p className="small mb-0">${order?.tax_fee}</p>
                </div>
                {order?.saved ? (
                  <div className="d-flex justify-content-between">
                    <p className="small mb-0">Discount</p>
                    <p className="small mb-0">-${order?.saved}</p>
                  </div>
                ) : (
                  ''
                )}
                <div className="d-flex justify-content-between mt-4">
                  <p className="fw-bold">Total</p>
                  <p className="fw-bold" style={{ color: '#35558a' }}>
                    ${order?.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
