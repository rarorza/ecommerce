import { useEffect } from 'react'
import { CartTotalProperties } from '../views/store/CartView'
interface Props {
  cartTotal: CartTotalProperties
}

const CartSummary = ({ cartTotal }: Props) => {
  useEffect(() => {
    console.log('o')
    console.log(cartTotal)
  }, [])
  return (
    <>
      <h5 className="mb-3">Cart Summary</h5>
      <div className="d-flex justify-content-between mb-3">
        <span>Subtotal </span>
        <span>${cartTotal?.sub_total.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Shipping </span>
        <span>${cartTotal?.shipping_amount.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Tax </span>
        <span>${cartTotal?.tax_fee.toFixed(2)}</span>
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
    </>
  )
}

export default CartSummary
