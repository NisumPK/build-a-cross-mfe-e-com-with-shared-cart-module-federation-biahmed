import { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Nav from './components/Nav'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartRoutePage from './pages/CartRoutePage'
import WishlistRoutePage from './pages/WishlistRoutePage'
import LoginRoutePage from './pages/LoginRoutePage'

function RemotePage({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <ErrorBoundary key={pathname}>
      <Suspense fallback={<p>Loading…</p>}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          <Route
            path="/"
            element={
              <RemotePage>
                <CatalogPage />
              </RemotePage>
            }
          />
          <Route
            path="/login"
            element={
              <RemotePage>
                <LoginRoutePage />
              </RemotePage>
            }
          />
          <Route
            path="/product/:id"
            element={
              <RemotePage>
                <ProductDetailPage />
              </RemotePage>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RemotePage>
                <WishlistRoutePage />
              </RemotePage>
            }
          />
          <Route
            path="/cart"
            element={
              <RemotePage>
                <CartRoutePage />
              </RemotePage>
            }
          />
        </Routes>
      </main>
      <footer>
        <p>&copy; 2026 MFE E-Commerce</p>
      </footer>
    </div>
  )
}
