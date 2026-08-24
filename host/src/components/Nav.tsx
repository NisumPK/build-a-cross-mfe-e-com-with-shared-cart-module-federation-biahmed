import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectTotalItems } from '@shared/cartSlice'
import { selectWishlistCount } from '@shared/wishlistSlice'
import { selectUser } from '@shared/authSlice'
import type { RootState } from '../store'

export default function Nav() {
  const totalItems = useSelector((state: RootState) => selectTotalItems(state))
  const wishlistCount = useSelector((state: RootState) => selectWishlistCount(state))
  const user = useSelector((state: RootState) => selectUser(state))

  return (
    <header>
      <h2>MFE E-Commerce</h2>
      <nav>
        <Link to="/">Catalog</Link> |{' '}
        <Link to="/wishlist">❤️ Wishlist ({wishlistCount})</Link> |{' '}
        <Link to="/cart">Cart ({totalItems})</Link> |{' '}
        {user ? (
          <>
            <span style={{ marginRight: '0.5rem' }}>Welcome, {user.name}</span>
            <Link to="/login">Logout</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  )
}
