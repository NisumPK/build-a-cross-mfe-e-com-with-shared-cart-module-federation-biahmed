import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  decrementQty,
  incrementQty,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from '@shared/cartSlice'
import { listenCartItemAdded } from '@shared/events'
import type { CartState, Product } from '@shared/types'
import CartItemRow from './CartItemRow'

interface Props {
  /** Query param `?coupon=`, supplied by whichever router owns navigation. Display-only. */
  coupon?: string | null
}

export default function CartPage({ coupon }: Props) {
  const dispatch = useDispatch()
  const items = useSelector((state: { cart: CartState }) => selectCartItems(state))
  const totalItems = useSelector((state: { cart: CartState }) => selectTotalItems(state))
  const totalPrice = useSelector((state: { cart: CartState }) => selectTotalPrice(state))

  const [eventBanner, setEventBanner] = useState<Product | null>(null)

  // Listen for custom events (shows the item without changing Redux count)
  useEffect(() => {
    return listenCartItemAdded((product) => {
      setEventBanner(product)
    })
  }, [])

  return (
    <div>
      <h2>Shopping Cart</h2>

      {eventBanner && (
        <p style={{ background: '#e6ffed', padding: '0.5rem' }}>
          Custom event received: "{eventBanner.name}" was added to the cart elsewhere.
        </p>
      )}

      {coupon && (
        <p style={{ fontSize: '0.85em', color: '#555' }}>
          Coupon applied (query param <code>?coupon=</code>, display only): {coupon}
        </p>
      )}

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onIncrement={(id) => dispatch(incrementQty(id))}
                onDecrement={(id) => dispatch(decrementQty(id))}
                onRemove={(id) => dispatch(removeFromCart(id))}
              />
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <p>Total Items: {totalItems}</p>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      {items.length > 0 && <button onClick={() => dispatch(clearCart())}>Clear Cart</button>}
    </div>
  )
}
