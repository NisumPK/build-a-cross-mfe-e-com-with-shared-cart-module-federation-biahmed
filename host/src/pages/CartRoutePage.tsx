import { lazy } from 'react'
import { useSearchParams } from 'react-router-dom'

const CartPage = lazy(() => import('cart_mfe/CartPage'))

export default function CartRoutePage() {
  const [searchParams] = useSearchParams()
  return <CartPage coupon={searchParams.get('coupon')} />
}
