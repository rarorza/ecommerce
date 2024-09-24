import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import ProductCard from '../../components/store/ProductCard'
import GetUserData from '../../utils/plugins/GetUserData'
import { IProduct } from '../../shared/product.interface'
import { IUser } from '../../shared/user.interface'
import Swal from 'sweetalert2'

export interface IWishlist {
  product: IProduct
  user: IUser
}

function Wishlist() {
  const [wishlist, setWishlist] = useState<IWishlist[]>()
  const userData = GetUserData()

  const getWishlistData = async () => {
    try {
      const res = await apiInstance.get(
        `customer/wishlist/${userData?.user_id}`,
      )
      setWishlist(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getWishlistData()
  }, [])

  const handleWishlist = async (productId: number, userId: number | null) => {
    if (userId) {
      const formData = new FormData()
      const data = JSON.stringify({
        product_id: productId,
        user_id: userId,
      })
      formData.append('data', data)

      try {
        const res = await apiInstance.post(
          `customer/wishlist/${userId}/`,
          formData,
        )

        Swal.fire({
          icon: 'success',
          title: res.data.message,
        })

        getWishlistData()
      } catch (error) {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Something when wrong',
        })
      }
    }
  }

  return (
    <div className="container">
      <section className="">
        <div className="row">
          <h3 className="mb-3">
            <i className="fas fa-heart text-danger" /> Wishlist
          </h3>
          {wishlist?.length ? (
            wishlist?.map((w, index) => (
              <ProductCard
                key={index}
                product={w.product}
                handleWishlist={handleWishlist}
              />
            ))
          ) : (
            <h6 className="container">Your wishlist is Empty </h6>
          )}
        </div>
      </section>
    </div>
  )
}

export default Wishlist
