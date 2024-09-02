import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import ProductCard from '../../components/ProductCard'
import GetUserCountry from '../../utils/plugins/GetUserCountry'
import GetUserData from '../../utils/plugins/GetUserData'
import GenerateCartID from '../../utils/plugins/GenerateCartID'
import Swal from 'sweetalert2'
import { get } from 'lodash'
import { IProduct } from '../../shared/product.interface'

interface ICategory {
  image: string
  title: string
}

const ToastNotification = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})

function Products() {
  const [products, setProducts] = useState<IProduct[]>()
  const [categories, setCategories] = useState<ICategory[]>([])

  const [colorValue, setColorValue] = useState('No Color')
  const [sizeValue, setSizeValue] = useState('No Size')
  const [qtyValue, setQtyValue] = useState(1)

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedColors, setSelectedColors] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})

  const userAddress = GetUserCountry()
  const userData = GetUserData()
  const cartID = GenerateCartID()

  useEffect(() => {
    apiInstance.get('products/').then((res) => {
      setProducts(res.data)
    })
  }, [])

  useEffect(() => {
    apiInstance.get('categories/').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const handleColorButtonClick = (productId: number, colorName: string) => {
    setColorValue(colorName)
    setSelectedProduct(productId)

    setSelectedColors((prevSelectedColors) => ({
      // This function updates the state object selectedColors. It uses the previous
      // state (prevSelectedColors) and returns a new state object where the
      // productId key is set to colorName. The ...prevSelectedColors syntax ensures
      // that the rest of the state object remains unchanged
      ...prevSelectedColors,
      [productId]: colorName,
    }))
  }

  const handleSizeButtonClick = (productId: number, sizeName: string) => {
    setSizeValue(sizeName)
    setSelectedProduct(productId)

    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [productId]: sizeName,
    }))
  }

  const handleQtyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: number,
  ) => {
    setQtyValue(parseInt(e.target.value))
    setSelectedProduct(productId)
  }

  const handleAddToCart = async (
    productId: number,
    price: number,
    shippingAmount: number,
  ) => {
    try {
      const formData = new FormData()
      formData.append('product_id', productId.toString())
      formData.append('user_id', userData.user_id)
      formData.append('qty', qtyValue.toString())
      formData.append('price', price.toString())
      formData.append('shipping_amount', shippingAmount.toString())
      formData.append('country', get(userAddress, 'country', ''))
      formData.append('size', sizeValue)
      formData.append('color', colorValue)
      formData.append('cart_id', cartID)

      const response = await apiInstance.post(`cart/`, formData)

      ToastNotification.fire({
        icon: 'success',
        title: response.data.message,
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <div>
        <main className="mt-5">
          <div className="container">
            <section className="text-center">
              <div className="row">
                {products?.map((product, index) => (
                  <ProductCard
                    product={product}
                    key={index}
                    handleQtyChange={handleQtyChange}
                    handleSizeButtonClick={handleSizeButtonClick}
                    handleColorButtonClick={handleColorButtonClick}
                    qtyValue={qtyValue}
                    selectedSizes={selectedSizes}
                    selectedColors={selectedColors}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
                <div className="row">
                  {/* category card */}
                  {categories?.map((category, index) => (
                    <div className="col-lg-2" key={index}>
                      <img
                        src={category.image}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                        alt=""
                      />
                      <h6>{category.title}</h6>
                    </div>
                  ))}
                  {/* end */}
                </div>
              </div>
            </section>
            {/*Section: Wishlist*/}
          </div>
        </main>
        {/*Main layout*/}
        <main>
          <section className="text-center container">
            <div className="row py-lg-5">
              <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Trending Products</h1>
                <p className="lead text-muted">
                  Something short and leading about the collection below—its
                  contents
                </p>
              </div>
            </div>
          </section>
          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Products
