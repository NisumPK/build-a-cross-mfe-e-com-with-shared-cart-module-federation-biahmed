import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectTotalItems } from '@shared/cartSlice'
import type { Product } from '@shared/types'
import type { RootState } from '../store'

export default function Nav() {
  const totalItems = useSelector((state: RootState) => selectTotalItems(state))
  const [recentProduct, setRecentProduct] = useState<Product | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('recentProduct')
    if (raw) {
      try {
        setRecentProduct(JSON.parse(raw))
      } catch {
        // ignore malformed value
      }
    }
  }, [])

  return (
    <header>
      <h2>MFE E-Commerce</h2>
      <nav>
        <Link to="/">Catalog</Link> |{' '}
        <Link to="/cart">Cart ({totalItems})</Link>
      </nav>
      {recentProduct && (
        <p style={{ fontSize: '0.85em', color: '#555' }}>
          Recently viewed (sessionStorage): {recentProduct.name}
        </p>
      )}
    </header>
  )
}
