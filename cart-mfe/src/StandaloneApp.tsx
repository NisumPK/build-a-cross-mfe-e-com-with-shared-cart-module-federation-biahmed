import { useSearchParams } from 'react-router-dom'
import CartPage from './components/CartPage'

export default function StandaloneApp() {
  const [searchParams] = useSearchParams()

  return (
    <div style={{ padding: '1rem' }}>
      <p style={{ background: '#fffae6', padding: '0.5rem' }}>
        Standalone mode — this app normally runs embedded inside the Host via Module
        Federation. This local store/router only exists so it also works when opened
        directly.
      </p>
      <CartPage coupon={searchParams.get('coupon')} />
    </div>
  )
}
