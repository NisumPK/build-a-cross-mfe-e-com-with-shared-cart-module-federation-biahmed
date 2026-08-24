import { useDispatch } from 'react-redux'
import { addToCart } from '@shared/cartSlice'
import { dispatchCartItemAdded } from '@shared/events'
import type { Product } from '@shared/types'
import products from '../data/products.json'
import ProductCard from './ProductCard'

interface Props {
  /** Called by the Host's router to navigate. In standalone mode, falls back
   * to window.location. Remotes never use react-router-dom directly. */
  onSelectProduct?: (id: number) => void
}

export default function ProductList({ onSelectProduct }: Props) {
  const dispatch = useDispatch()

  const handleAddToCart = (product: Product) => {
    // Redux update (goes to Cart MFE via shared store, persisted by host's store.subscribe)
    dispatch(addToCart(product))

    // Custom event (separate notification, shows independent mechanism)
    dispatchCartItemAdded(product)
  }

  const handleSelectProduct = (id: number) => {
    if (onSelectProduct) {
      onSelectProduct(id)
    } else {
      window.location.href = `/product/${id}?ref=list`
    }
  }

  return (
    <div>
      <h2>Products</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {(products as Product[]).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
          />
        ))}
      </div>
    </div>
  )
}
