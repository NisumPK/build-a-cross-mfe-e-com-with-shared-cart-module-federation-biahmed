declare module 'catalog_mfe/ProductList' {
  import type { FC } from 'react'
  const ProductList: FC<{ onSelectProduct?: (id: number) => void }>
  export default ProductList
}

declare module 'catalog_mfe/ProductDetails' {
  import type { FC } from 'react'
  const ProductDetails: FC<{ id: string }>
  export default ProductDetails
}

declare module 'cart_mfe/CartPage' {
  import type { FC } from 'react'
  const CartPage: FC<{ coupon?: string | null }>
  export default CartPage
}

declare module 'wishlist_mfe/WishlistPage' {
  import type { FC } from 'react'
  const WishlistPage: FC
  export default WishlistPage
}

declare module 'auth_mfe/LoginPage' {
  import type { FC } from 'react'
  const LoginPage: FC
  export default LoginPage
}
