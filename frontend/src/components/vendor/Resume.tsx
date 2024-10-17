import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart } from 'chart.js'
import { CategoryScale } from 'chart.js/auto'

import { useOutletDashBoardVendor } from '../../views/vendor/DashBoardVendorOutlet'
import apiInstance from '../../utils/axios'
import GetUserData from '../../utils/plugins/GetUserData'
import { OrderChart } from '../../shared/order.interface'
import { ProductsChart } from '../../shared/product.interface'
import { Link } from 'react-router-dom'

function Resume() {
  const { resumeStats, products } = useOutletDashBoardVendor()
  const userData = GetUserData()
  const [ordersChartData, setOrdersChartData] = useState<OrderChart[]>()
  const [productsChartData, setProductsChartData] = useState<ProductsChart[]>()

  Chart.register(CategoryScale)
  const getChartData = async () => {
    const orders_res = await apiInstance.get(
      `vendor/orders-chart/${userData?.vendor_id}/`,
    )
    setOrdersChartData(orders_res.data)

    const products_res = await apiInstance.get(
      `vendor/products-chart/${userData?.vendor_id}/`,
    )
    setProductsChartData(products_res.data)
  }

  const orders_months = ordersChartData?.map((item) => item.month)
  const orders_counts = ordersChartData?.map((item) => item.orders)

  const products_months = productsChartData?.map((item) => item.month)
  const products_counts = productsChartData?.map((item) => item.products)

  const orders_data = {
    labels: orders_months,
    datasets: [
      {
        label: 'Total Orders',
        data: orders_counts,
        fill: true,
        backgroundColor: 'green',
        borderColor: 'green',
      },
    ],
  }

  const products_data = {
    labels: products_months,
    datasets: [
      {
        label: 'Total Products',
        data: products_counts,
        fill: true,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  }

  useEffect(() => {
    getChartData()
  }, [])
  return (
    <div className="col-md-9 col-lg-10 main mt-4">
      <div className="row mb-3">
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-success">
            <div className="card-block bg-success p-3">
              <div className="rotate">
                <i className="bi bi-grid fa-5x" />
              </div>
              <h6 className="text-uppercase">Products</h6>
              <h1 className="display-1">{resumeStats?.products}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-danger">
            <div className="card-block bg-danger p-3">
              <div className="rotate">
                <i className="bi bi-cart-check fa-5x" />
              </div>
              <h6 className="text-uppercase">Orders</h6>
              <h1 className="display-1">{resumeStats.orders}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-info">
            <div className="card-block bg-info p-3">
              <div className="rotate">
                <i className="bi bi-people fa-5x" />
              </div>
              <h6 className="text-uppercase">Customers</h6>
              <h1 className="display-1">125</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-warning">
            <div className="card-block bg-warning p-3">
              <div className="rotate">
                <i className="bi bi-currency-dollar fa-5x" />
              </div>
              <h6 className="text-uppercase">Revenue</h6>
              <h1 className="display-1">${resumeStats.revenue}</h1>
            </div>
          </div>
        </div>
      </div>
      {/*/row*/}
      <hr />
      <div className="container">
        <div className="row my-3">
          <div className="col">
            <h4>Chart Analytics</h4>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-lg-6 py-1">
            <div className="card">
              <div className="card-body">
                <Bar data={orders_data} style={{ height: 300 }} />
              </div>
            </div>
          </div>
          <div className="col-lg-6 py-1">
            <div className="card">
              <div className="card-body">
                <Bar data={products_data} style={{ height: 300 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <a id="layouts" />
      <hr />
      <div className="row mb-3 container">
        <div className="col-lg-12" style={{ marginBottom: 100 }}>
          {/* Nav tabs */}
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                href="#home1"
                role="tab"
                data-toggle="tab"
              >
                Products
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#profile1"
                role="tab"
                data-toggle="tab"
              >
                Orders
              </a>
            </li>
          </ul>
          {/* Tab panes */}
          <div className="tab-content">
            <br />
            <div role="tabpanel" className="tab-pane active" id="home1">
              <h4>Products</h4>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Orders</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <img
                          src={product.image}
                          alt="Product Image"
                          style={{
                            width: '100px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                          }}
                        />
                      </th>
                      <td>{product.title}</td>
                      <td>${product.price}</td>
                      <td>{product.stock_qty}</td>
                      <td>{product.orders}</td>
                      <td>{product.status.toUpperCase()}</td>
                      <td>
                        <Link to="" className="btn btn-primary mb-1 me-2">
                          <i className="fas fa-eye" />
                        </Link>
                        <Link to="" className="btn btn-success mb-1 me-2">
                          <i className="fas fa-edit" />
                        </Link>
                        <Link to="" className="btn btn-danger mb-1">
                          <i className="fas fa-trash" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div role="tabpanel" className="tab-pane" id="profile1">
              <h4>Orders</h4>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#Order ID</th>
                    <th scope="col">Total</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Delivery Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">#trytrr</th>
                    <td>$100.90</td>
                    <td>Paid</td>
                    <td>Shipped</td>
                    <td>20th June, 2023</td>
                    <td>
                      <a href="" className="btn btn-primary mb-1">
                        <i className="fas fa-eye" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">#hjkjhkhk</th>
                    <td>$210.90</td>
                    <td>Pending</td>
                    <td>Not Shipped</td>
                    <td>21th June, 2023</td>
                    <td>
                      <a href="" className="btn btn-primary mb-1">
                        <i className="fas fa-eye" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">#retrey</th>
                    <td>$260.90</td>
                    <td>Failed</td>
                    <td>Not Shipped</td>
                    <td>25th June, 2023</td>
                    <td>
                      <a href="" className="btn btn-primary mb-1">
                        <i className="fas fa-eye" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resume
