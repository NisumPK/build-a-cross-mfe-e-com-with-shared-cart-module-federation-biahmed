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
