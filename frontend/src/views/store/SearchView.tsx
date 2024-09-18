import { useContext, useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import ProductCard from '../../components/store/ProductCard'
import GetUserCountry from '../../utils/plugins/GetUserCountry'
import GetUserData from '../../utils/plugins/GetUserData'
import GenerateCartID from '../../utils/plugins/GenerateCartID'
import Swal from 'sweetalert2'
import { IProduct } from '../../shared/product.interface'
import { useSearchParams } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

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

function SearchView() {
  const [products, setProducts] = useState<IProduct[]>()

  const [colorValue, setColorValue] = useState('No Color')
  const [sizeValue, setSizeValue] = useState('No Size')
  const [qtyValue, setQtyValue] = useState(1)

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedColors, setSelectedColors] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})

  const userAddress = GetUserCountry()
  const userData = GetUserData()
  const cartID = GenerateCartID()
  const [cartCount, setCartCount] = useContext(CartContext)

  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')

  const getProducts = async () => {
    const res = await apiInstance.get(`search/?query=${query}`)
    setProducts(res.data)
  }

  useEffect(() => {
    getProducts()
  }, [query])

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
      const data = JSON.stringify({
        product_id: productId,
        user_id: userData ? userData.user_id : null,
        qty: qtyValue,
        price: price,
        shipping_amount: shippingAmount,
        country: userAddress.country,
        size: sizeValue,
        color: colorValue,
        cart_id: cartID,
      })
      formData.append('data', data)

      const response = await apiInstance.post(`cart/`, formData)

      ToastNotification.fire({
        icon: 'success',
        title: response.data.message,
      })

      setCartCount(() => {
        let total = cartCount
        return (total += 1)
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <>
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
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default SearchView
