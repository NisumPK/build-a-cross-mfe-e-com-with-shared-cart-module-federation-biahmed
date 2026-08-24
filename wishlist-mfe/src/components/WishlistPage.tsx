import { useDispatch, useSelector } from 'react-redux'
import { removeFromWishlist, clearWishlist, selectWishlistItems } from '@shared/wishlistSlice'
import { addToCart } from '@shared/cartSlice'
import type { WishlistState } from '@shared/wishlistSlice'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const items = useSelector((state: { wishlist: WishlistState }) => selectWishlistItems(state))

  const handleMoveToCart = (productId: number) => {
    const item = items.find((i) => i.id === productId)
    if (item) {
      dispatch(addToCart(item))
      dispatch(removeFromWishlist(productId))
    }
  }

  return (
    <div>
      <h2>❤️ My Wishlist</h2>

      {items.length === 0 ? (
        <p>Your wishlist is empty. Add items from the catalog!</p>
      ) : (
        <>
          <p>{items.length} item(s) in wishlist</p>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <button onClick={() => handleMoveToCart(item.id)}>Move to Cart</button>{' '}
                    <button onClick={() => dispatch(removeFromWishlist(item.id))}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 0 && (
            <button onClick={() => dispatch(clearWishlist())}>Clear Wishlist</button>
          )}
        </>
      )}
    </div>
  )
}
