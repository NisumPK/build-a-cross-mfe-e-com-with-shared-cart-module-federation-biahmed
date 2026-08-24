import { lazy } from 'react'

const WishlistPage = lazy(() => import('wishlist_mfe/WishlistPage'))

export default function WishlistRoutePage() {
  return <WishlistPage />
}
