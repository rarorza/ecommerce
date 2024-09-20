import { useParams } from 'react-router-dom'

import { useOutletDashBoard } from '../../views/customer/DashBoardOutlet'
import { useEffect } from 'react'
import CardOrder from './CardOrder'

function OrderDetail() {
  const params = useParams()
  const { orders } = useOutletDashBoard()
  const order = orders.filter((or) => or.oid == params.order_oid)[0]
  const { order_item } = order

  useEffect(() => {
    console.log(order_item)
  }, [])

  return (
    <div className="container px-4">
      {/* Section: Summary */}
      <section className="mb-5">
        <h3 className="mb-3">
          {' '}
          <i className="fas fa-shopping-cart text-primary" /> #{order.oid}{' '}
        </h3>
        <div className="row gx-xl-5">
          <CardOrder
            bgColor="#B2DFDB"
            title="Total"
            content={`$${order.total.toFixed(2)}`}
          />
          <CardOrder
            bgColor="#D1C4E9"
            title="Payment Status"
            content={`${order.payment_status.toUpperCase()}`}
          />
          <CardOrder
            bgColor="#BBDEFB"
            title="Order Status"
            content={`${order.order_status.toUpperCase()}`}
          />
          <CardOrder
            bgColor="#BBFBEB"
            title="Shipping Amount"
            content={`${order.shipping_amount.toFixed(2)}`}
          />
          <CardOrder
            bgColor="#BBF7FB"
            title="Tax Fee"
            content={`${order.tax_fee.toFixed(2)}`}
            collumLenght={4}
            marginTop={5}
          />
          <CardOrder
            bgColor="#EEBBFB"
            title="Service Fee"
            content={`${order.service_fee.toFixed(2)}`}
            collumLenght={4}
            marginTop={5}
          />
          <CardOrder
            bgColor="#BBC5FB"
            title="Discount"
            content={`${order.saved ? `-${order.saved}` : '0.00'}`}
            collumLenght={4}
            marginTop={5}
          />
        </div>
      </section>
      {/* Section: Summary */}
      {/* Section: MSC */}
      <section className="">
        <div className="row rounded shadow p-3">
          <div className="col-lg-12 mb-4 mb-lg-0">
            <table className="table align-middle mb-0 bg-white">
              <thead className="bg-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order_item.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.product.image}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: '10px',
                          }}
                          alt=""
                        />
                        <p className="text-muted mb-0 p-2">
                          {item.product.title}
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">${item.price}</p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.qty}</p>
                    </td>
                    <td>
                      <span className="fw-normal mb-1">${item.sub_total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OrderDetail
