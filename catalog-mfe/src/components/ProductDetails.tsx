import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@shared/cartSlice'
import { dispatchCartItemAdded } from '@shared/events'
import type { Product } from '@shared/types'
import products from '../data/products.json'

interface Props {
  /** Route param `:id`, supplied by whichever router owns navigation. */
  id: string
}

export default function ProductDetails({ id }: Props) {
  const dispatch = useDispatch()
  const product = (products as Product[]).find((p) => String(p.id) === id)

  // sessionStorage: tab-scoped "recently viewed" — distinct from the
  // persistent cart data that lives in localStorage.
  useEffect(() => {
    if (product) {
      sessionStorage.setItem('recentProduct', JSON.stringify(product))
    }
  }, [product])

  if (!product) {
    return <p>Product not found.</p>
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    dispatchCartItemAdded(product)
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} width={200} height={200} />
      <p>${product.price}</p>
      <p>{product.description}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  )
}
